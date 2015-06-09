var logger = require('bristol');
var db = require('./db');

//authentication function that will protect routes
module.exports = function(req, res, next) {

	//slightly more advanced, queries database to make sure user exists
	if (req.session.token) {
		db.User.find({where: {username: req.session.token}}).then(function(foundUser) {
			if (foundUser) {
				next();
			}
			else {
				res.status(401).send('Not logged in!');
			}
		});
	}
	else {
		res.status(401).send('Not logged in!');
	}
}
