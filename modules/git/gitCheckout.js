const { execSync } = require('child_process');
const getCurrentVsCodeFolder = require('../getCurrentVsCodeFolder');

function gitCheckout(branchName) {
    const command = `git checkout ${branchName}`;

    const stdout = execSync(command, { cwd: getCurrentVsCodeFolder() }).toString();

    console.log(stdout);

    return stdout;
}

module.exports = gitCheckout;