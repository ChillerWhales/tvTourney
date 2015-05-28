var logger = require('bristol');
var db = require('./db');

module.exports = {
	homeGET: function(req, res) {
		res.send("Hello world");
		logger.info("Hello world delivered to client");
	},
}