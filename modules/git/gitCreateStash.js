const { execSync } = require('child_process');
const getCurrentVsCodeFolder = require('../getCurrentVsCodeFolder');

function gitCreateStash(stashName, includeUntracked) {
    const command = `git stash push -m "${stashName}" ${includeUntracked ? '-u' : ''}`;

    execSync(command, { cwd: getCurrentVsCodeFolder() }).toString();

    console.log(`Stashed changes as "${stashName}"`);
}

module.exports = gitCreateStash;