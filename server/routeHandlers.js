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
		//check if user exists
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
	},

	loginPOST: function(req, res) {
		var params = req.body;
		db.User.findOne({where: {username: params.username}}).then(function(user) {
			//if user doesnt exist, create user
			if (!user || user.password !== params.password) {
				logger.info("User attempted to login with invalid information");
				res.status(401).send("That username/password combination doesn't exist");
			}
			else if (user && user.password === params.password) {
				//create a sessions
				req.session.token = user.id;
				res.status(200).json(user);
				logger.info("User successfully logged in");
			}
		});
	},

	/*session will exist in each request, but calling destroy() causes
	the token property (which contains the users id) to be removed
	from the cookie, effectively logging the user out.*/
	logoutGET: function(req, res) {
		//do we need to check if the sessions exists before doing this?
		req.session.destroy(function() {
			logger.info("User was successfully logged out");
			res.status(200).send("User successfully logged out");
		});
	},

	/*this code expects that the req will have the id of the league event so it
	can confirm that the user is indeed the owner of the the league specified.*/
	eventGET: function(req, res) {
		//checks if user is the current owner of the league.
		db.League.findOne({where: {id : req.id, owner: req.session.user.id}}).then(function(result) {
			//checks to see if the league under that id's owner is the same as our session user.
			if(result) {
				logger.info("User is the owner of the league. Create events!");
				res.status(200).send("You have access for creating events on this league")
			}
			else {
				logger.info("User does not have access creating events on this league")
				res.status(403).send("User doesn't have access to this page.")
			}
		});
	}

	/*creates individual events that the user writes*/
	eventPost: function(req, res) {
		//gets form data
		var params = req.body;
		db.events.
	}









}