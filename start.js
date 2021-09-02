var forever = require('forever-monitor');

var child = new (forever.Monitor)('index.js', {
  spinSleepTime: 5000
});

child.start();