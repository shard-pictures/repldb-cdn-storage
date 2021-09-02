const AutoGitUpdate = require('auto-git-update');

const update_config = {
    repository: 'https://github.com/shard-pictures/repldb-cdn-storage',
    tempLocation: '/home/runner/tmp/',
    ignoreFiles: [],
    executeOnComplete: 'node /home/runner/index.js',
    exitOnComplete: true
}

const updater = new AutoGitUpdate(update_config);

updater.forceUpdate(); //Should be running autoUpdate but this package is somehow broken and refuses to check versions properly lmao, it keeps on thinking the version is 1.0