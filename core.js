const babelGenerator = require('./node_modules/babel-generator/lib/index');
const babelTraverse = require('babel-traverse');
const babelTypes = require('@babel/types');
const uuidv1 = require('uuid/v1');
const babylon = require('babylon');

const options = {
  sourceType: 'module',
  plugins: [
    // enable jsx syntax
    'jsx',
    'classProperties',
    'flow',
    'doExpressions',
    'objectRestSpread'
  ]
};
function generateStyleSheet(styleNames, styleProperties, existingStyleObjects) {
  var styleObjects = styleNames.map((item, index) => {
    return babelTypes.objectProperty(
      babelTypes.identifier(item),
      styleProperties[index]
    );
  });
  styleObjects.push.apply(styleObjects, existingStyleObjects);
  return babelTypes.variableDeclaration('const', [
    babelTypes.variableDeclarator(
      babelTypes.identifier('styles'),
      babelTypes.callExpression(
        babelTypes.memberExpression(
          babelTypes.identifier('StyleSheet'),
          babelTypes.identifier('create')
        ),
        [babelTypes.objectExpression(styleObjects)]
      )
    )
  ]);
}

// TODO: check type of propertyvalue to generate corresponding literal
// function generateStylePropertyWithValue(propertyName, propertyValue) {
//   return babelTypes.objectProperty(
//     babelTypes.identifier(propertyName),
//     babelTypes.numericLiteral(propertyValue)
//   );
// }

function generateStyles(styleName) {
  return babelTypes.jsxAttribute(
    babelTypes.jsxIdentifier('style'),
    babelTypes.jsxExpressionContainer(
      babelTypes.memberExpression(
        babelTypes.identifier('styles'),
        babelTypes.identifier(styleName)
      )
    )
  );
}
function generateAST(code) {
  var ast;
  try {
    ast = babylon.parse(code, options);
  } catch (error) {
    // console.log(error);
    // return error;
    return 'Oops!! error parsing the tree';
  }
  return ast;
}

//  function isJSXAttribute(type) {
//   return type === 'JSXAttribute';
// }

function isStyle(name) {
  return name === 'style';
}
var convertFunc = function convertCode(code) {
  // console.log('*********convertCode starts************');
  var returnCode = '';
  // console.log('before generating ast');
  var ast = generateAST(code);
  // console.log('AST GENERATED ');
  if (ast === 'Oops!! error parsing the tree') {
    // console.log('after generating ast');
    // console.log('ERROR OCCURED WHILE GENERATING AST');
    return ast;
  }
  var objectExpressionArray = []; // stores style object to put in stylesheet.create
  var styleNames = []; // style names
  var nodesToReplace = []; // style nodes to replace with styles.something

  var existingStyleSheetNode;
  var existingStyleSheetName = '';
  var existingStyleObjects = [];
  // console.log('**************TRAVERSING STARTS****************');
  babelTraverse.default(ast, {
    enter(path) {
      // finding pre-existing stylesheet
      // looking for expressions with stylesheet.create as RHS
      if (babelTypes.isVariableDeclaration(path.node)) {
        // console.log('variableDeclaration\n, ');
        if (babelTypes.isVariableDeclarator(path.node.declarations[0])) {
          // console.log('variableDeclarator < === >');
          // getting variable name of existing stylesheet
          existingStyleSheetName = path.node.declarations[0].id.name;
          // console.log(existingStyleSheetName);
          if (babelTypes.isCallExpression(path.node.declarations[0].init)) {
            // console.log('callExpression < == >');
            if (
              babelTypes.isMemberExpression(
                path.node.declarations[0].init.callee
              )
            ) {
              // console.log('memberExpression < == >');
              if (
                path.node.declarations[0].init.callee.object.name ===
                  'StyleSheet' &&
                path.node.declarations[0].init.callee.property.name === 'create'
              ) {
                existingStyleSheetNode = path;
                // console.log('stylesheet.create < == >');
                //getting existing style objects present in  stylesheet
                existingStyleObjects =
                  path.node.declarations[0].init.arguments[0].properties;
                // console.log(existingStyleObjects);
              }
            }
          }
        }
      }
      if (babelTypes.isJSXAttribute(path.node)) {
        if (isStyle(path.node.name.name)) {
          // path to which changes will be made
          if (babelTypes.isJSXExpressionContainer(path.node.value)) {
            if (babelTypes.isObjectExpression(path.node.value.expression)) {
              // console.log('getting style={{}}');
              nodesToReplace.push(path);
              var styleName = 'a' + uuidv1();
              styleName = styleName.replace(/-/g, '');
              styleNames.push(styleName);
              objectExpressionArray.push(path.node.value.expression);
            }
          }
        }
      }
    }
  });
  console.log('**************TRAVERSING ENDS****************');

  // generating Stylesheet
  ////
  // checking if we have pre-existing stylesheet or not
  if (objectExpressionArray.length > 0) {
    // merging existing stylesheet data with to be converted data
    const generatedStyleSheet = generateStyleSheet(
      styleNames,
      objectExpressionArray,
      existingStyleObjects
    );
    // console.log(generatedStyleSheet);

    // replacing old stylesheet with newly generated stylesheet
    if (existingStyleSheetNode) {
      existingStyleSheetNode.replaceWith(generatedStyleSheet);
    } else {
      returnCode = babelGenerator.default(generatedStyleSheet).code;
    }

    // replacing style object
    nodesToReplace.forEach((styleNode, index) => {
      var replaceWithThis = generateStyles(styleNames[index]);
      styleNode.replaceWith(replaceWithThis);
    });
  }
  try {
    const output = babelGenerator.default(ast);
    returnCode = `${returnCode} \n${output.code}`;
  } catch (error) {
    console.log(error);
  }
  // console.log('*********convertCode ends************');
  return returnCode;
};

exports.codeConvert = convertFunc;

// console.log(convertCode(test1));
