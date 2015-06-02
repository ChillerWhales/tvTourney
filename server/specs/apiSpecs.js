/* server must be running when you executes the tests 
	run the test with "mocha apiSpecs.js" */
var serverHost = 'http://localhost:3000';
var should = require('should');
var assert = require('assert');
var supertest = require('supertest');
var request = supertest(serverHost);
var Sequelize = require('sequelize');
var db = require('../dbConfig');

var utils = {
	testUser: {
				username: 'testUser',
				email: "testemail@gmail.com",
				password: '123qwe'
	},

	errOrDone: function(err, res, done) {
		if (err) {
			done(err);
		}
		else {
			done();
		}
	},

	createAgent: function(server) {
		var server = server || serverHost
		return supertest.agent(server);
	},

	signUpUser: function(credentials, callback) {
		request.post('/signup')
			.send(credentials)
			.end(function(err, res) {
				if (callback) {
					if (err) {
						callback(err);
					}
					else {
						callback();
					}
				}
			});
	},

	logInAgent: function(agent, credentials, callback) {
		agent.post('/login')
			.send(credentials)
			.end(function(err, res) {
				if (callback) {
					if (err) {
						callback(err);
					}
					else {
						callback();
					}
				}
			});
	},

	logOutAgent: function(agent, callback) {
		agent.get('/logout')
			.end(function(err, res) {
				if (callback) {
					if (err) {
						callback(err);
					}
					else {
						callback();
					}
				}
			});
	},

	destroyUser: function(schema, credentials, callback) {
		schema.find({where: {username: this.testUser.username}})
			.then(function(foundUser) {
				if (foundUser) {
					foundUser.destroy().then(function() {
						callback();
					});
				}
				else {
					callback();
				}
			});
	}
}

describe('API', function() {
	//connect to the database
	var sequelize = db.connect('../db/db.sqlite');
	//pass the the second parameter as false so that the function does not execute sync()
	var schemas = db.createSchemas(sequelize,false);
	//schemas that will be used to execute queries
	var User = schemas.User;
	var League = schemas.League;
	var LeagueEvent = schemas.LeagueEvent
	var LeagueCharacter = schemas.LeagueCharacter;
	var CharacterEvent = schemas.CharacterEvent;

	//deletes inserted user from database after all tests are complete
	after(function(done) {
		utils.destroyUser(User,utils.testUser, done);
	})

	describe('user management', function() {

		describe('signup and login/logout', function() {
			it('signup should respond with the users object', function(done) {
				request.post('/signup')
					.send(utils.testUser)
					//makes sure status code is correct
					.expect(201)
					//makes sure properties are correct
					.expect(function(res) {
						res.body.id.should.exist;
						res.body.username.should.equal(utils.testUser.username);
						res.body.email.should.equal(utils.testUser.email);
						res.body.password.should.equal(utils.testUser.password);
					})
					.end(function(err, res) {
						utils.errOrDone(err, res, done);
					});
			});

			it('signup should respond with status code 400 if username already exists', function(done) {
				request.post('/signup')
					.send(utils.testUser)
					.expect(400)
					.end(function (err, res) {
						utils.errOrDone(err, res, done);
				});
			});

			it('login should respond with status code 200 if username/password is correct', function(done) {
				request.post('/login')
					.send(utils.testUser)
					.expect(200)
					.end(function(err, res) {
						utils.errOrDone(err, res, done);
					});
			});

			it('login should respond with status code 401 if username/password is incorrect', function(done) {
				var wrongTestUser = {
					username: "doesntexist",
					password: "wrongpassword"
				}

				request.post('/login')
					.send(wrongTestUser)
					.expect(401)
					.end(function(err, res) {
						utils.errOrDone(err, res, done);
					});
			});
		});

		describe('authentication', function() {
			var agent = utils.createAgent();
			before(function(done) {
				utils.signUpUser(utils.testUser);
				utils.logInAgent(agent, utils.testUser, done);
			});

			it('should respond with a 401 if user attempts to access protected route while not logged in', function(done) {
				request.get('/testauth')
				.expect(401)
				.end(function(err, res) {
					utils.errOrDone(err, res, done);
				});
			});

			it('should respond with a 200 if user attempts to access protected route while logged in', function(done) {
				agent.get('/testauth').expect(200)
					.end(function(err, res) {
						utils.errOrDone(err, res, done);
					});
			});
		});
	}); //closes user management describe

	describe("/league/", function() {
		var agent = utils.createAgent();

		var testLeague = {
			name: "leagueName",
			show: "tvShow",
			roster_limit: 10
		}	

		before(function(done) {
			utils.signUpUser(utils.testUser);
			utils.logInAgent(agent, utils.testUser, done);
		})

		after(function(done) {
			//find and destroy league
			League.find({where: {name: testLeague.name}})
				.then(function(foundLeague) {
					foundLeague.destroy().then(function() {
						done();
					});
				});
		});

		it("should respond with the new league object", function(done) {
			agent.post("/league/")
				.send(testLeague)
				.expect(201)
				.expect(function(res) {
					res.body.id.should.exist;
					res.body.name.should.equal(testLeague.name);
					res.body.show.should.equal(testLeague.show);
					res.body.owner.should.exist;
					res.body.roster_limit.should.equal(testLeague.roster_limit);
				})
				.end(function(err, res) {
					utils.errOrDone(err, res, done);
				})
		});

		it('should respond with status code 400 if user is logged out', function(done) {
			utils.logOutAgent(agent, function() {
				agent.post("/league")
					.send(testLeague)
					.expect(401)
					.end(function (err, res) {
						utils.errOrDone(err, res, done);
			 		});
	 		});
		});
	});

	describe("/league/leagueId", function() {
		var agent = utils.createAgent();
		var leagueId;

		var testLeague = {
			name: "leagueName",
			show: "tvShow",
			roster_limit: 10
		}	

		before(function(done) {
			utils.signUpUser(utils.testUser);
			utils.logInAgent(agent, utils.testUser, function() {
				agent.post("/league/")
				.send(testLeague)
				.expect(201)
				.end(function(err, res) {
					leagueId = res.body.id;
					done();
				})
			});
		})

		after(function(done) {
			//find and destroy league
			League.find({where: {name: testLeague.name}})
				.then(function(foundLeague) {
					foundLeague.destroy().then(function() {
						done();
					});
				});
		});

		it('get request should respond with league information', function(done) {
			agent.get("/league/" + leagueId)
					.expect(200)
					.expect(function(res) {
						res.body.id.should.equal(leagueId);
						res.body.name.should.equal(testLeague.name);
						res.body.show.should.equal(testLeague.show);
						res.body.owner.should.exist;
						res.body.roster_limit.should.equal(testLeague.roster_limit);
					})
					.end(function (err, res) {
						utils.errOrDone(err, res, done);
		 			});
		})

		it('should respond with 401 if user is not part of the league', function(done) {
			var agent = utils.createAgent();

			var otherTestUser = {
				username: 'otherTestUser',
				email: "testemail@gmail.com",
				password: '123qwe'
			}
			utils.signUpUser(otherTestUser, function() {
				utils.logInAgent(agent, otherTestUser, function() {
					agent.get("/league/" + leagueId)
					.expect(401)
					.end(function (err, res) {
						utils.errOrDone(err, res, done);
		 			});
				})
			});
		})
	})

	describe("league characters", function() {
		
		var agent = utils.createAgent();
		
		var testLeague = {
			name: "leagueName",
			show: "tvShow",
			roster_limit: 10
		}	

		var testCharacter = {
			name: "testCharacterName",
			league_id: 5
		}

		var fakeUser = {
			username: "fakeuser",
			email: "fake@fake.com",
			password: "fakepassword"
		}

		before(function(done) {
			utils.signUpUser(utils.testUser);
			utils.logInAgent(agent, utils.testUser, function() {
				agent.post('/league')
					.send(testLeague)
					.expect(201)
					.end(function(err, res) {
						testCharacter.league_id = res.body.id;
						done();
					})
			});
		});

		after(function(done) {
			// TBD 
			done();
		});

		describe("League Character POST", function() {
			it('should respond with character object when successful', function(done) {
				agent.post("/league/" + testCharacter.league_id + "/characters")
					.send(testCharacter)
					.expect(201)
					.expect(function(res) {
						res.body.id.should.exist;
						res.body.name.should.equal(testCharacter.name);
					})
					.end(function (err, res) {
						utils.errOrDone(err, res, done);
					});
			});
		});
	}); //end of league Characters test

	describe("league events", function() {
			var agent = utils.createAgent();
			var testLeague = {
				name: "leagueName",
				show: "tvShow",
				roster_limit: 10
			}	

			var testEvent = {
				description: "testdescription",
				score: 5
			}

			var fakeUser = {
				username: "fakeuser",
				email: "fake@fake.com",
				password: "fakepassword"
			}

			before(function(done) {
				utils.signUpUser(utils.testUser);
				utils.logInAgent(agent, utils.testUser, function() {
					agent.post('/league')
						.send(testLeague)
						.expect(201)
						.end(function(err, res) {
							testEvent.league_id = res.body.id;
							done();
						})
				});
			});

			after(function(done) {
		     //find and destroy league
		    League.find({where: {name: testLeague.name}})
		    	.then(function(foundLeague) {
		     		foundLeague.destroy();
		    });

		    User.find({where: {username: fakeUser.username}})
		    	.then(function(foundUser) {
		    		foundUser.destroy();
		    });

		    LeagueEvent.find({where: {description: testEvent.description}})
		      .then(function(foundEvent) {
		      	foundEvent.destroy().then(function() {
		     		done();
		    		});
		    });
		  });

			describe("League Event POST", function () {
				it('should respond with event object when successful', function(done) {
					agent.post("/league/" + testEvent.league_id + "/events")
						.send(testEvent)
						.expect(201)
						.expect(function(res) {
							res.body.id.should.exist;
							res.body.description.should.equal(testEvent.description);
							res.body.score_up.should.equal(testEvent.score);
						})
						.end(function (err, res) {
							utils.errOrDone(err, res, done);
						});
				});

				it('should respond with 400 if inputs are invalid', function(done) {
					agent.post("/league/" + testEvent.league_id + "/events")
						.send({
							league_id: testEvent.league_id,
							notdescription: "hehehehehhe",
							notscore: "huehuehue"
						})
						.expect(400)
						.end(function (err, res) {
							utils.errOrDone(err, res, done);
						});
				});

				it('should respond with 403 if league_id don"t match with user_id', function(done) {
					var agent2 = utils.createAgent();
					utils.signUpUser(fakeUser, function() {
						utils.logInAgent(agent2, fakeUser, function() {
							agent2.post("/league/" + testEvent.league_id + "/events")
								.send(testEvent)
								.expect(403)
								.end(function(err, res) {
									utils.errOrDone(err, res, done);
								});
						});
					})
				}); 

				it('should respond with 401 if user is not logged in', function(done) {
					var agent3 = utils.createAgent();
					//creates new agent but doesn't log it in
					agent3.post("/league/" + testEvent.league_id + "/events")
						.send(testEvent)
						.expect(401)
						.end(function(err, res) {
							utils.errOrDone(err, res, done);
						});			
				});

			});

			describe("League Event GET", function() {
				
				it('should respond with an array of objects containing events', function(done) {
					agent.get("/league/" + testEvent.league_id + "/events")
						.expect(200)
						.expect(function(res) {
							Array.isArray(res.body).should.equal(true);
						})
						.end(function(err, res) {
							utils.errOrDone(err, res, done);
						});
				});

				it('should return the events that belong to the league', function(done) {
					agent.get("/league/" + testEvent.league_id + "/events")
						.expect(200)
						.expect(function(res) {
							res.body[0].league_id.should.equal(testEvent.league_id);
							res.body[0].description.should.equal(testEvent.description);
							res.body[0].score_up.should.equal(testEvent.score);
						})
						.end(function(err, res) {
							utils.errOrDone(err, res, done);
						});
				});
				//the get function in routeHandler is checking that user is the owner! 
				//not if user is part of the league! Need to refactor when the tables for
				//league-users is done.
				it('should return 403 if user not part of league', function(done) {
					var agent2 = utils.createAgent();
					utils.signUpUser(fakeUser, function() {
						utils.logInAgent(agent2, fakeUser, function() {
							agent2.get("/league/" + testEvent.league_id + "/events")
								.expect(403)
								.end(function(err, res) {
									utils.errOrDone(err, res, done);
								});
						});
					})
				});
			});
	}); //end of league events test

	describe('triggering events on characters', function() {
		var agent = utils.createAgent();

		var leagueId;
		var characterId;
		var eventId;
		var firstTriggeredEventId;

		var testLeague = {
			name: "leagueName",
			show: "tvShow",
			roster_limit: 10
			}	
		var testCharacter = {
			name: "testCharacterName",
		}

		var testEvent = {
			description: "testdescription",
			score: 5,
		}

		var fakeUser = {
			username: "fakeuser",
			email: "fake@fake.com",
			password: "fakepassword"
		}


		before(function(done) {
			utils.signUpUser(utils.testUser);
			utils.signUpUser(fakeUser);
			utils.logInAgent(agent, utils.testUser, function() {
				agent.post("/league")
					.send(testLeague)
					.expect(201)
					.expect(function(res) {
						testEvent.league_id = res.body.id;
					})
					.end(function (err, res) {
						//use the returned leagues id to post a character
						leagueId = res.body.id;
						agent.post("/league/" + leagueId + "/characters")
						.send(testCharacter)
						.expect(201)
						.expect(function(res) {
							res.body.id.should.exist;
							res.body.name.should.equal(testCharacter.name);
							characterId = res.body.id;
						})
						.end(function (err, res) {
							agent.post("/league/" + testEvent.league_id + "/events")
								.send(testEvent)
								.expect(201)
								.expect(function(res) {
									eventId = res.body.id;
									res.body.id.should.exist;
									res.body.description.should.equal(testEvent.description);
									res.body.score_up.should.equal(testEvent.score);
								})
								.end(function (err, res) {
									utils.errOrDone(err, res, done);
								});
						});
					});
			})
		});	
		after(function(done) {
			/*I think a lot of this code is redundant, I think if the laegue is destroyed, then sequelize
			will automatically destroy any rows in other tables that depend on it*/
			League.find({where: {id: leagueId}}).then(function(foundLeague) {
				foundLeague.destroy().then(function () {
					LeagueEvent.find({where: {id: eventId}}).then(function(foundEvent) {
						foundEvent.destroy().then(function () {
							LeagueCharacter.find({where: {id: characterId}}).then(function(foundCharacter) {
								foundCharacter.destroy().then(function() {
									CharacterEvent.findAll({where: {league_id: leagueId}}).then(function(foundTriggeredEvents) {
										done();
									})
								});
							})
						})
					})
				})
			})
		})
		it('should return the triggered event object' , function(done) {
			agent.post("/league/" + leagueId + "/triggerevent")
				.send({
					characterId: characterId,
					eventId: eventId
				})
				.expect(201)
				.expect(function(res) {
					res.body.id.should.exist;
					res.body.league_id.should.equal(leagueId);
					res.body.league_character_id.should.equal(characterId);
					res.body.league_event_id.should.equal(eventId);
				})
				.end(function(err, res) {
					firstTriggeredEventId = res.body.id;
					utils.errOrDone(err, res, done);
				})
		});

		it('should retrieve all triggered event objects', function(done) {
			var secondTriggeredEventId;
			agent.post("/league/" + leagueId + "/triggerevent")
				.send({
					characterId: characterId,
					eventId: eventId
				})
				.end(function(err, res) {
					triggeredEventId = res.body.id;
					agent.get("/league/" + leagueId + "/triggerevent")
						.expect(200)
						.expect(function(res) {
						})
						.end(function(err, res) {
							res.body[0].id.should.equal(firstTriggeredEventId);
							res.body[0].league_id.should.equal(leagueId);
							res.body[0].league_character_id.should.equal(characterId);
							res.body[0].league_event_id.should.equal(eventId);
							res.body[1].id.should.equal(triggeredEventId);
							res.body[1].league_id.should.equal(leagueId);
							res.body[1].league_character_id.should.equal(characterId);
							res.body[1].league_event_id.should.equal(eventId);
							utils.errOrDone(err, res, done);
						})
				})
		})
	})
})
 //end test
