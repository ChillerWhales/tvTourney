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

	otherTestUser: {
		username: 'otherTestUser',
		email: "othertestemail@gmail.com",
		password: '123qwe'
	},

	testLeague: {
		name: "leagueName",
		show: "tvShow",
		roster_limit: 10
	},

	testCharacter: {
		name: "testCharacterName"
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
						//user object can be accessed in callback
						callback(res.body);
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
	},

	destroyObject: function(schema, object, callback) {
		schema.destroy({where: object})
		.then(function(destroyed) {
			callback();
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
		utils.destroyUser(User, utils.testUser, function() {
			utils.destroyUser(User, utils.otherTestUser, done);
		});
	});

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
				utils.logInAgent(agent, utils.testUser, function(user) {
					done();
				});
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
			utils.logInAgent(agent, utils.testUser, function(user) {
				done();
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

	describe("League draft / roster", function() {
		var agent = utils.createAgent();
		var leagueId;
		var userId;
		var characterId;
		//used to make sure that trying to draft the same character twice doesnt create a new object in the database
		var firstDraftId;

		before(function(done) {
			utils.signUpUser(utils.testUser, function() {
				utils.logInAgent(agent, utils.testUser, function(user) {
					userId = user.id;
					agent.post('/league')
					.send(utils.testLeague)
					.expect(201)
					.end(function(err, res) {
						leagueId = res.body.id;
						agent.post("/league/" + leagueId + "/characters")
							.send(utils.testCharacter)
							.expect(201)
							.end(function (err, res) {
								characterId = res.body.id;
								done();
							});
					});
				});
			});
		})

		after(function(done) {
			League.find({where: {id: leagueId}}).then(function(foundLeague) {
				foundLeague.destroy().then(function() {
					done();
				})
			})
		});

		describe("roster POST - draft player", function() {
			it("should return the drafted player object", function(done) {
				agent.post("/league/" + leagueId + "/roster")
					.send({
						userId: userId,
						characterId: characterId
					})
					.expect(201)
					.expect(function(res) {
						res.body.id.should.exist;
						res.body.league_id.should.equal(leagueId);
						res.body.user_id.should.equal(userId);
						res.body.league_character_id.should.equal(characterId);
					})
					.end(function(err, res) {
						firstDraftId = res.body.id;
						utils.errOrDone(err, res, done);
					})
			});

			it("should not allow a user to draft the same player twice", function(done) {
				agent.post("/league/" + leagueId + "/roster")
					.send({
						userId: userId,
						characterId: characterId
					})
					.expect(200)
					.expect(function(res) {
						/*make sure its the same id as the first test - this creates a dependency between
						tests that doesnt need to be there, but I think its ok for now*/
						res.body.id.should.equal(firstDraftId);
						res.body.league_id.should.equal(leagueId);
						res.body.user_id.should.equal(userId);
						res.body.league_character_id.should.equal(characterId);
					})
					.end(function(err, res) {
						utils.errOrDone(err, res, done);
					})
			})
		});

		describe("roster GET - get users roster", function() {
			it("should return the users roster as an array", function(done) {
				agent.get("/league/" + leagueId + "/user/" + userId + "/roster")
					.expect(200)
					.expect(function(res) {
						res.body[0].id.should.equal(firstDraftId);
						res.body[0].league_id.should.equal(leagueId);
						res.body[0].user_id.should.equal(userId);
						res.body[0].league_character_id.should.equal(characterId);
					})
					.end(function(err, res) {
						utils.errOrDone(err, res, done);
					})
			});

			//not implemented in routehandler yet
			it("should only allow users to view the rosters of players in the same league as them", function(done) {
				var otherAgent = utils.createAgent();

				utils.signUpUser(utils.otherTestUser, function() {
					utils.logInAgent(agent, utils.otherTestUser, function(user) {
						agent.get("/league/" + leagueId + "/user/" + userId + "/roster")
							.expect(401)
							.end(function(err, res) {
								utils.errOrDone(err, res, done);
							})
						});
					});
				});

			});
		});
	// });

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
	});

	describe("User leagues", function() {

		describe(" After invited to user", function() {
			var agent = utils.createAgent();
			
			var testLeague = {
				name: "leagueName",
				show: "tvShow",
				roster_limit: 10
			};	
			
			var testInvitee = {
				username: 'invitedUser'
			};

			var fakeUser = {
				username: "fakeuser",
				email: "fake@fake.com",
				password: "fakepassword"
			};

			var userNoLeagues = {
				username: "noLeagues",
				email: "no@leagues.com",
				password: "noleagues"
			};

			var newLeague = {};

			before(function(done) {
				utils.signUpUser(utils.testUser);
				utils.signUpUser(fakeUser);
				utils.signUpUser(userNoLeagues);
				utils.logInAgent(agent, utils.testUser, function() {
					agent.post('/league')
						.send(testLeague)
						.expect(201)
						.end(function(err, res) {
							newLeague = res.body;
							done();
						})
				});
			});

			after(function(done) {
				utils.destroyUser(User, fakeUser, function () {
					utils.destroyUser(User, userNoLeagues, function () {
						utils.destroyObject(League, testLeague, function(){
							done();
						});
					});
				});
			});

			describe("Check GET /user/leagues", function() {
				it('Should return a leagues array empty', function(done) {

					utils.logOutAgent(agent, function (){
						//logout the fakeUser
						utils.logInAgent(agent, fakeUser, function() {
							agent.get("/user/leagues")
							.expect(200)
							.end(function (err, res) {
								var user = res.body
								user.should.have.property('leagues');
								user.leagues.should.have.a.length(0);
								done();
							});
						});
					});
				});


				it('Should return a leagues array with length one', function(done) {
					utils.logOutAgent(agent, function (){
						//logout the fakeUser
						utils.logInAgent(agent, utils.testUser, function() {
							agent.post("/league/" + newLeague.id + "/invite")
								.send({username: fakeUser.username})
								.expect(201)
								.end(function (err, res) {
									//logout testUser
									utils.logOutAgent(agent, function (){
										//logout the fakeUser
										utils.logInAgent(agent, fakeUser, function() {
											agent.get("/user/leagues")
											.expect(200)
											.end(function (err, res) {
												var user = res.body
												user.should.have.property('leagues');
												user.leagues.should.have.a.length(1);
												done();
											});
										});
									});
								});
							});
					});
				});

			});

			describe("Check GET /league/:id/users", function() {
				it('Should return a users array', function(done) {
					agent.get("/league/" + newLeague.id + "/users")
					.expect(200)
					.end(function (err, res) {
						var users = res.body;
						users.should.have.a.length(2);
						users[0].should.have.property('username');
						users[0].should.have.property('user_leagues');
						users[0].user_leagues[0].should.have.property('current_score');
						users[0].user_leagues[0].current_score.should.equal(0);
						done();
					});
				});

				it('Should return a 500 if there are not a session', function(done) {
					utils.logOutAgent(agent,  function (){
						agent.get("/league/" + newLeague.id + "/users")
						.expect(500)
						.end(function (err, res) {
							done();
						});
					});
				});

				it('Should return a 401 if the user doesnt belong to league', function(done) {
					utils.logInAgent(agent, userNoLeagues, function (){
						agent.get("/league/" + newLeague.id + "/users")
						.expect(401)
						.end(function (err, res) {
							done();
						});
					});
				});

			});
		});
	});


	describe("league invites", function() {
		
		var agent = utils.createAgent();
		
		var testLeague = {
			name: "leagueName",
			show: "tvShow",
			roster_limit: 10
		}	


		var fakeUser = {
			username: "fakeUser",
			email: "fakeUser@mail.com",
			password: "fakeUser"
		}
		
		var testInvitee = {
			username: 'invitedUser'
		}

		var testInviter = {
			username: "testInviter",
			email: "testInviter@mail.com",
			password: "testinvite"
		}

		var invitee1 = {
			username: "invitee",
		}

		var invitee2 = {
			username: "invitee",
		}

		var newLeague = {};

		before(function(done) {
			utils.signUpUser(testInvitee, function(){
				utils.signUpUser(utils.testUser, function () {
					utils.logInAgent(agent, utils.testUser, function() {
						agent.post('/league')
							.send(testLeague)
							.end(function(err, res) {
								newLeague = res.body;
								done();
							})
					});
				});
			});
		});


		after(function(done) {
			utils.destroyUser(User, fakeUser, function() {
				utils.destroyUser(User, testInvitee, function(){
					utils.destroyObject(League, testLeague, function(){
						done();
					});
				});
			});
		});

		describe("League Invite POST", function() {
		// 	// invite two fake users
		// 	// count users in league
			it('should respond with 201 if user is invited successfully', function(done) {
				agent.post("/league/" + newLeague.id + "/invite")
					.send({username: testInvitee.username})
					.expect(201)
					.end(function(err, res) {
						utils.errOrDone(err, res, done);
					});
			});


			it('should respond with status 500 if username is not exist', function(done) {
				agent.post("/league/" + newLeague.id + "/invite")
					.send(invitee1)
					.expect(500)
					.end(function (err, res) {
						done();
					});
			});
	

			it('should respond with 403 if user is not league owner', function(done) {
				var agent2 = utils.createAgent();
				utils.signUpUser(fakeUser, function() {
					utils.logInAgent(agent2, fakeUser, function() {
						agent2.post("/league/" + newLeague.id + "/invite")
							.send({username: 'unknown'})
							.expect(403)
							.end(function(err, res) {
								utils.errOrDone(err, res, done);
							});
					});
				})
			});


		});
	}); 
});//end test
