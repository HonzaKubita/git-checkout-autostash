const vscode = require('vscode');

// Git command wrappers
const gitGetBranchList = require('../modules/git/gitGetBranchList');
const gitGetCurrentBranch = require('../modules/git/gitGetCurrentBranch');
const gitCheckout = require('../modules/git/gitCheckout');
const gitCreateStash = require('../modules/git/gitCreateStash');
const gitPopStash = require('../modules/git/gitPopStash');
const gitCreateBranch = require('../modules/git/gitCreateBranch');

async function checkout() {

    let currentBranch = '';
    let newBranch = '';
    // Check if the current workspace is a git repository and also get the current branch
    try {
        currentBranch = gitGetCurrentBranch();
    }
    catch (e) {
        vscode.window.showErrorMessage('The current workspace is not a git repository.');
        return;
    }

    // Get the list of branches in current repo and show user a quick pick list
    const branchList = gitGetBranchList();
    const quickPickBranches = branchList
        .filter(branchName => branchName != currentBranch)
        .map(branchName => "$(source-control) " + branchName);

    const quickPickActions = [
        "$(plus) Create new branch...",
        "$(plus) Create new branch from...",
    ];

    const quicPickItems = [
        ...quickPickActions,
        {
            label: 'Branches',
            kind: vscode.QuickPickItemKind.Separator
        },
        ...quickPickBranches
    ];

    // Show the quick pick list
    const pickedItem = await vscode.window.showQuickPick(
        quicPickItems,
        {   // Options
            placeHolder: "Select a branch to checkout"
        }
    );

    // If the user didn't select anything, return
    if (!pickedItem) {
        return;
    }

    // Handle the actions first
    if (pickedItem == "$(plus) Create new branch...") {
        const newBranchName = await vscode.window.showInputBox({
            placeHolder: 'Branch name',
            prompt: 'Please provide a new branch name'
        });

        if (!newBranchName) {
            return;
        }

        newBranch = newBranchName;

        try {
            gitCreateBranch(newBranchName);
        }
        catch (e) {
            vscode.window.showErrorMessage('Failed to create the new branch.');
            return;
        }
    }
    else if (pickedItem == "$(plus) Create new branch from...") {
        const baseBranchList = branchList.map(branchName => "$(source-control) " + branchName);
        const baseBranchName = await vscode.window.showQuickPick(
            baseBranchList,
            {   // Options
                placeHolder: "Select a branch to base the new branch on"
            }
        );

        if (!baseBranchName) {
            return;
        }

        const newBranchName = await vscode.window.showInputBox({
            placeHolder: 'Branch name',
            prompt: 'Please provide a new branch name'
        });

        if (!newBranchName) {
            return;
        }

        newBranch = newBranchName;

        try {
            gitCreateBranch(newBranchName, baseBranchName);
        }
        catch (e) {
            vscode.window.showErrorMessage('Failed to create the new branch.');
            return;
        }
    } else {
        newBranch = pickedItem.replace('$(source-control) ', '');
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
        gitCheckout(newBranch);
    }
    catch (e) {
        vscode.window.showErrorMessage('Failed to checkout the selected branch.');
        return;
    }

    // Pop the stash on the new branch
    try {
        gitPopStash(`checkoutstash-${newBranch}`);
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
}

module.exports = checkout;