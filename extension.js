// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const extension = require('./core');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    'extension.stylesheetget',
    function() {
      // The code you place here will be executed every time your command is executed
      const lineCount = vscode.window.activeTextEditor.document.lineCount;
      let code = vscode.window.activeTextEditor.document.getText();
      const convertedCode = extension.codeConvert(code);
      if (convertedCode === 'Oops!! error parsing the tree') {
        // show error notification
        vscode.window.showErrorMessage('Oops!! error parsing the tree');
      } else {
        console.log(convertedCode);
        // console.log('============extension ends========================');
        vscode.window.activeTextEditor.edit(editBuilder => {
          editBuilder.replace(
            new vscode.Range(0, 0, lineCount, 0),
            convertedCode
          );
        });
      }
    }
  );

  context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}
exports.deactivate = deactivate;
