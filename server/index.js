var config = require('./config');
var db = require('./db');
var server = require('./server');

/*makes it so we can output api logs to a file using logger.info(log)
bristol must be required on each script that uses it, but settings
dont need to be redefined, they're set in this file and kept for
the whole app*/

// var logger = require('bristol');
// logger.addTarget('file', {file: config.logger.api});

console.log('Starting logger...');
// logger.info('Starting logger...');

console.log('logger started. Connecting to database...');
// logger.info('logger started. Connecting to database...');
//database connect goes here

console.log('Successfully connected to database. Starting webserver.');
// logger.info('Successfully connected to database. Starting webserver.');

server.start();

console.log('Successfully started webserver. Waiting for incoming connections...');
// logger.info('Successfully started webserver. Waiting for incoming connections...');