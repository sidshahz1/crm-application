var kue = require('kue-scheduler');
var queue = kue.createQueue({
    restore: true
});

module.exports = queue;