const vscode = require('vscode');

// Git command wrappers
const gitGetBranchList = require('../modules/git/gitGetBranchList');
const gitGetCurrentBranch = require('../modules/git/gitGetCurrentBranch');
const gitCheckout = require('../modules/git/gitCheckout');
const gitCreateStash = require('../modules/git/gitCreateStash');
const gitPopStash = require('../modules/git/gitPopStash');

function checkout() {
    let currentBranch = '';
    // Check if the current workspace is a git repository and also get the current branch
    try {
        currentBranch = gitGetCurrentBranch();
    }
    catch (e) {
        vscode.window.showErrorMessage('The current workspace is not a git repository.');
        return;
    }

    // Get the list of branches in current repo and show user a quick pick list
    const branchList = gitGetBranchList().filter(branchName => branchName != currentBranch);

    const quicPickItems = branchList.map(branchName => "$(source-control) " + branchName);
    const quickPickOptions = {
        placeHolder: "Select a branch to checkout"
    };

    vscode.window.showQuickPick(quicPickItems, quickPickOptions).then(branchName => {
        // Remove the source-control icon from the branch name
        branchName = branchName.replace('$(source-control) ', '');

        if (!branchName) {
            return;
        }

        let currentBranch;

        // Get the current branch
        try {
            currentBranch = gitGetCurrentBranch();
        }
        catch (e) {
            vscode.window.showErrorMessage('Failed to get the current branch.');
            return;
        }

        // Stash the current changes
        try {
            gitCreateStash(`checkoutstash-${currentBranch}`, true);
        }
        catch (e) {
            // If there are no changes to stash, show a message and continue
            if (e.message == 'No local changes to save') {
                vscode.window.showInformationMessage('No local changes to stash.');
            }
            else {
                vscode.window.showErrorMessage('Failed to stash the current changes.');
                return;
            }
        }

        // Checkout the selected branch
        try {
            gitCheckout(branchName);
        }
        catch (e) {
            vscode.window.showErrorMessage('Failed to checkout the selected branch.');
            return;
        }

        // Pop the stash on the new branch
        try {
            gitPopStash(`checkoutstash-${branchName}`);
        }
        catch (e) {
            if (e.message == `No stash found`) {
                vscode.window.showInformationMessage('No stash to pop on the new branch.');
            }
            else {
                vscode.window.showErrorMessage('Failed to pop the stash on the new branch.');
                return;
            }
        }
    });
}

module.exports = checkout;