const { execSync } = require('child_process');
const getCurrentVsCodeFolder = require('../getCurrentVsCodeFolder');

function gitCreateBranch(branchName, sourceBranch = null) {
    const command = `git checkout -b ${branchName} ${sourceBranch ? sourceBranch : ''}`;

    const stdout = execSync(command, { cwd: getCurrentVsCodeFolder() }).toString();

    console.log(stdout);

    return stdout;
}

module.exports = gitCreateBranch;