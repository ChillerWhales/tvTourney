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
				.expect(200)
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
});