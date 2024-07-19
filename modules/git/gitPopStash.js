const { execSync } = require('child_process');
const getCurrentVsCodeFolder = require('../getCurrentVsCodeFolder');

function gitPopStash(stashName) {
    console.log(`Popping stash "${stashName}"`);

    // Get the list of stashes
    const stdoutGitStashList = execSync('git --no-pager stash list --format="%gs"', { cwd: getCurrentVsCodeFolder() }).toString();

    // Split the output into lines
    const stashesStrings = stdoutGitStashList.split('\n').filter(line => line.trim() !== '');

    // Create a mapping of index to stash message
    const stashes = stashesStrings.map((message, index) => {
        // Remove the "On <branch>: " prefix
        const formattedMessage = message.replace(/On \w+: /, '');
        return {
            index,
            message: formattedMessage,
        };
    });

    console.log(stashes);

    // Find the index of the stash we want to pop
    const stashIndex = stashes.findIndex(stash => stash.message === stashName);

    // If the stash was not found, throw an error
    if (stashIndex === -1) {
        throw new Error(`Stash "${stashName}" not found`);
    }

    // Pop the stash
    execSync(`git stash pop stash@{${stashIndex}}`, { cwd: getCurrentVsCodeFolder() });
}

module.exports = gitPopStash;