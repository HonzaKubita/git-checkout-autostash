const vscode = require('vscode');

function getCurrentVsCodeFolder() {
    // Get the currently opened folder
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        vscode.window.showErrorMessage('No workspace folder is opened.');
        return;
    }

    const currentFolder = workspaceFolders[0].uri.fsPath;

    return currentFolder;
}

module.exports = getCurrentVsCodeFolder;