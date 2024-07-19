const { execSync } = require('child_process');
const getCurrentVsCodeFolder = require('../getCurrentVsCodeFolder');

function gitGetCurrentBranch() {
    // Run the git branch command
    const output = execSync('git --no-pager branch', { cwd: getCurrentVsCodeFolder() }).toString();

    // Split the output into lines and remove leading/trailing whitespace
    const branches = output.split('\n').map(line => line.trim()).filter(line => line.length > 0);

    // Remove the leading '*' from the current branch name
    const cleanedBranches = branches.map(branch => branch.replace(/^\* /, ''));

    return cleanedBranches;
}

module.exports = gitGetCurrentBranch;