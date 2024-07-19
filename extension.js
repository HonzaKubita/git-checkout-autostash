const vscode = require('vscode');
const checkout = require('./commands/checkout');

function activate(context) {
    console.log('Extension "checkoutstash" is now active!');

    let checkoutCommand = vscode.commands.registerCommand('checkoutstash.checkout', checkout);

    context.subscriptions.push(checkoutCommand);
}

// This method is called when your extension is deactivated
function deactivate() { }

module.exports = {
    activate,
    deactivate
}
