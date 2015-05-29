var logger = require('bristol');
var db = require('./db');

module.exports = {
	homeGET: function(req, res) {
		res.send("Hello world");
		logger.info("Hello world delivered to client");
	},

	signupPOST: function(req, res) {
		//get form data
		var params = req.body;
		//check if user existss
		db.User.findOne({where: {username: params.username}}).then(function(user) {
			//if user doesnt exist, create user
			if (!user) {
				db.User.create({
					username: params.username,
					email: params.email,
					password: params.password
				//after creating user, return it to client
				}).then(function(newUser) {
					logger.info("User created successfully");
					res.status(201).json(newUser);
				})
			}
			//if user already exists, tell client
			else if (user) {
				logger.info("User tried to register with a taken username")
				res.status(400).send("Username already exists!");
			}
			//error out (should never happen)
			else {
				logger.info("Error while trying to create user");
				res.status(500).send("Check your code bro");
			}
		})
	}
}