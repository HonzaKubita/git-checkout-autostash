const { execSync } = require('child_process');
const getCurrentVsCodeFolder = require('../getCurrentVsCodeFolder');

function gitGetCurrentBranch() {
    const command = 'git branch --show-current';

    const stdout = execSync(command, { cwd: getCurrentVsCodeFolder() }).toString();

    return stdout.trim();
}

module.exports = gitGetCurrentBranch;