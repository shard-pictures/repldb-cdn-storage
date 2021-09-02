const AutoGitUpdate = require('auto-git-update');

const update_config = {
    repository: 'https://github.com/chegele/BackupPurger',
    tempLocation: '/home/runner/tmp/',
    ignoreFiles: [],
    executeOnComplete: 'node /home/runner/index.js',
    exitOnComplete: true
}

const updater = new AutoGitUpdate(update_config);

updater.autoUpdate();