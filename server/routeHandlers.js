var logger = require('bristol');
var db = require('./db');
var utils = require('./lib/utils');
var url = require('url');

module.exports = {
	homeGET: function(req, res) {
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
				req.session.token = user.username;
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
	leagueCreatePOST: function(req, res) {
		//Inputs: league name, show, roster limit
		var params = req.body;
		utils.findUserId(req.session.token, function(user) {

			var ownerId = user.id;
			if (ownerId) {
				db.League.findOrCreate({
					where: {
						name: params.name,
						show: params.show,
						owner: ownerId,
						roster_limit: params.roster_limit
					}
				}).then(function(newLeague, created) {
					logger.info("New league successfully created");
					//have to send the 0 index because findOrCreate returns an array
					res.status(201).json(newLeague[0]);
				});
			} else if (ownerId === undefined) {
				logger.info("League was not successfully created");
				res.status(400).send("League was not created.");
			}
		});
	},
	/*this code expects that the req will have the id of the league event so it
	can confirm that the user is indeed the owner of the the league specified.*/
	eventGET: function(req, res) {
		utils.findUserId(req.session.token, function(user) {
			var ownerId = user.id;
				//checks if user is the current owner of the league.
			db.League.findOne({where: {id : req.params.id, owner: ownerId}}).then(function(result) {
				//checks to see if the league under that id's owner is the same as our session user.
				if(result) {
					logger.info("User is the owner of the league. Create events!");
					db.LeagueEvent.findAll({
						where: {
							league_id: req.params.id
						}
					}).then(function(result) {
						res.status(200).json(result);
						res.end();
					});
				}
				else {
					logger.info("User does not have access creating events on this league");
					res.status(403).send("User doesn't have access to this page.");
					res.end();
				}
			});
		});
	},
	/*creates individual events that the user writes*/
	eventPOST: function(req, res) {
		//gets form data
		var params = req.body;
		utils.findUserId(req.session.token, function(user) {
			var ownerId = user.id;
			//expects league_id, description, score
			db.League.findOne({where: {id: params.league_id, owner: ownerId}}).then(function(result) {
				if(!result) {
					logger.info("user is not the owner of the league");
					res.status(403).send("User doesn't have access to this page")
				}
				else if(!params.league_id || !params.description || !params.score) {
					logger.info("Invalid form inputs");
					res.status(400).send("Invalid inputs");
				}
				else {
					db.LeagueEvent.create({
						league_id : params.league_id,
						description : params.description,
						//doesnt account for the fact that score could be negative. all scores will be in score_up
						score_up : params.score
					}).then(function(newLeagueEvent) {
						logger.info("Added event successfully");
						res.status(201).json(newLeagueEvent);
					});
				}
			});
		});
	},
	testAuthGET: function(req, res) {
		//user should only make it here if they pass authentication
		res.status(200).send("You're authenticated!");
	},

	/*
	leaugesCharactersGET: This returns a JSON of characters for the requested league ID token
	leaugesCharactersPOST: This will insert the array of characters in the table (for the league id)
	 */
	leagueCharactersPOST: function(req, res) {
		// Receive leagueId as leagueId from req params and character  (name) and creates one record
		// create records for league id --> return 201 and obj containing created row
		
		if(!req.params.leagueId) {
			logger.info("leagueCharactersPOST attempted without leagueId");
			res.status(403).send("yo - where's your league_id");
		}
		var params = req.body;
		db.LeagueCharacter.create({
			league_id: req.params.leagueId,
			name: params.name
		})
		.then(function(character) {
			res.status(201).json(character);
		});
	},

	leagueCharactersGET: function(req, res) {
		// if leagueid present -- fetch list of characters for the given leagueId
		db.LeagueCharacter.findAll({
			where: {
				league_id: req.params.leagueId
			}
		})
		.then(function(characters){
			if(characters) {
				res.write(characters);
				res.end();
			} else {
				logger.info("No characters exist for league : " + leagueId);
				res.status(403).send("No characters exist for league : " + leagueId);
				res.end();
			}
		});
	},

	leagueInvitePOST: function(req, res) {
		var params = req.body;

		utils.findUserId(req.session.token, function(user) {
		var ownerId = user.id;

			db.League.findOne({where: {id: req.params.leagueId, owner: ownerId}}).then(function(league){
				if (league) {
					db.User.findOne({where: {username: params.username}}).then(function(user){
						if(user) {
							user.addLeague(league);
						}
					})
					.then(function() {
						logger.info("Added new users to league successfully");
						//not sure what to send back
						res.status(201).send("You have added this user to your league!");
					});									
				} else {
					logger.info("League with that owner and id does not exist");
					res.status(400).send("You must be the league owner to invite players");
				}
			});
		});
	},

	userLeaguesGET: function(req, res) {
		var username = req.session.token;
		db.User.findOne({
			where: {
				username: username
			},
			include: [
    		{ 
    			model: db.League
    		}
    	] 
		}).then(function (user) {
			if (user) {
				res.status(200).json(user);
			}else {
				res.status(401);
			}
		});
	},

	//doesnt check if user is owner - fix that
	triggerEventCharacterPOST: function(req, res) {
		var params = req.body;
		console.log("got here");
		db.CharacterEvent.create({
			league_id: parseInt(req.params.leagueId),
			league_character_id: params.characterId,
			league_event_id: params.eventId
		}).then(function(triggeredEvent) {
			if (triggeredEvent) {
				logger.info("Triggered an event on a character");
				res.status(201).json(triggeredEvent);
			}
			else {
				logger.info("Event was not triggered");
				res.status(500).send("Event was not triggered");
			}
		})
	},

	triggerEventCharacterGET: function(req, res) {
		db.CharacterEvent.findAll(
			{where: {league_id: req.params.leagueId}}
		).then(function(triggeredEvents) {
			if (triggeredEvents) {
				logger.info("Retrieved the following events:", triggeredEvents);
				res.status(200).json(triggeredEvents);
			}
			else {
				logger.info("Unable to retrieve triggered events");
				res.status(500).send("Unable to retrieve triggered events");
			}
		})
	}
		
}; // end module
