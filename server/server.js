var express = require('express');
var app = express();
var should = require('should');
//middleware that automatically logs responses, requests, and associated data
// var logger = require('morgan');
var routes = require('./routes');
var fs = require('fs');
var parser = require('body-parser');
var routeHandlers = require('./routeHandlers');
var session = require('express-session');
var cors = require('cors');
var deleteHandlers = require('./deleteHandlers');
//contains a setup function that adds web sockets to the server
var socketSetup = require('./socketSetup')

// authentication and encryption middleware//
var passport =  require('passport');


//what does flag do?
//setup log file
// var expressLogFile = fs.createWriteStream('./logs/express.log', {flags: 'a'});

//configuration
//log requests/responses to file
// app.use(logger('combined', {stream: expressLogFile}));




/** 
 * allows the server to automatically process urlencoded stuff into a javscript object
 * if we decided to pass JSON to the server instead we'll need to change this to parser.JSON()
 */
app.use(parser.json());
app.use(parser.urlencoded({extended: true}));

//set up sessions
app.use(session({
	secret: 'chillestWhales',
	resave: false,
	saveUninitialized: false
}));


//serves the client
app.use(express.static(__dirname + '/../client/'));

//allows cors
app.use(cors());

//start server functions and export
var start = function() {
	//attachs all the routes to the server
	routes.setup(app, routeHandlers, deleteHandlers);
	//if deployed to heroku will use heroku port, otherwise on local machine will use port 3000
	var port = process.env.port || 3000;
	var server = app.listen(port);
	//layers socket.io ontop of the express server
	socketSetup(server);
	console.log("Express server listening on %d in %s mode", port, app.settings.env)
}

exports.start = start;
exports.app = app;