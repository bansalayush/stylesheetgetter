/* global suite, test */

//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'assert' provides assertion methods from node
// import { test1, test2, test3, test4 } from './test';
// const expected = `class Test1 extends React.Component {
//     constructor(props) {
//         super(props);
//     }
//     render() {
//         return (
//             <View style={{height:100,width:100,backgroundColor:'#f00'}}>
//                 <Text style={{ textSize:12 , fontFamily: 'ScalaSansOT',fontSize: 12,letterSpacing: this.somestate ? 12: 13 }}>
//                     {this.constructor.name}
//                 </Text>
//             </View>
//         );
//     }}`;
const assert = require('assert');
// const beautifystyles = require('ast');
// beautifystyles.convertCode()

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
// const vscode = require('vscode');
// const myExtension = require('../extension');

// Defines a Mocha test suite to group tests of similar kind together
suite('Extension Tests', function() {
  // Defines a Mocha unit test
  test('testcase1 converted', function() {
    // console.log(beautifystyles.convertCode(test1));
    assert.equal(-1, [1, 2, 3].indexOf(5));
    assert.equal(-1, [1, 2, 3].indexOf(0));
  });
});
