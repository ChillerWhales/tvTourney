var logger = require('bristol');

module.exports = {
	homeGet: function(req, res) {
		res.send("Hello world");
		logger.info("Hello world delivered to client");
	}
}