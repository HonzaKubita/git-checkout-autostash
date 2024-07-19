const { execSync } = require('child_process');
const getCurrentVsCodeFolder = require('../getCurrentVsCodeFolder');

function gitCreateStash(stashName, includeUntracked) {
    const command = `git stash push -m "${stashName}" ${includeUntracked ? '-u' : ''}`;

    const stdout = execSync(command, { cwd: getCurrentVsCodeFolder() }).toString();

    if (stdout.includes('No local changes to save')) {
        throw new Error('No local changes to save');
    }

    console.log(`Stashed changes as "${stashName}"`);
}

module.exports = gitCreateStash;