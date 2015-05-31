/* server must be running when you executes the tests 
	run the test with "mocha apiSpecs.js" */
var serverHost = 'http://localhost:3000';
var should = require('should');
var assert = require('assert');
var supertest = require('supertest');
var request = supertest(serverHost);
var Sequelize = require('sequelize');
var db = require('../dbConfig');

describe('API', function() {

	/*establish a direct connection to the database so that cleanup
	can be performed after running tests. For example, after creating
	a testuser, this connection can be used to dive directly into the
	database and delete hat user*/
	// var sequelize = new Sequelize('database', 'root', '', {
	// 	host:'localhost',
	// 	dialect: 'sqlite',

	// 	pool: {
	// 		max: 5,
	// 		min: 0,
	// 		idle: 10000
	// 	},

	// 	//queries wont be console logged
	// 	logging: false,

	// 	storage: '../db/db.sqlite'
	// });
	var sequelize = db.connect('../db/db.sqlite');
	var schemas = db.createSchemas(sequelize,false);
	var User = schemas.User;
	var League = schemas.League;

	describe('user management', function() {

		//user tests will try to create
		var testUser = {
				username: 'testUser',
				email: "testemail@gmail.com",
				password: '123qwe'
			}

		//cleanup - deletes inserted user from database after all user management tests are complete
		after(function(done) {
			/* define the schema for the user model so that sequelize can
			construct the queries properly - this is not DRY with the 
			database models, can refactor this later for them to share
			models from the same file */

			//find and destroy user
			User.find({where: {username: testUser.username}})
				.then(function(foundUser) {
					foundUser.destroy().then(function() {
						done();
					});
				});
		});

		describe('signup and login/logout', function() {
			it('signup should respond with the users object', function(done) {
				request.post('/signup')
					.send(testUser)
					//makes sure status code is correct
					.expect(201)
					//makes sure properties are correct
					.expect(function(res) {
						res.body.id.should.exist;
						res.body.username.should.equal(testUser.username);
						res.body.email.should.equal(testUser.email);
						res.body.password.should.equal(testUser.password);
					})
					.end(function(err, res) {
						if (err) {
							done(err);
						}
						else {
							done();
						}
						/*if there was a get method we could test to see if the user was created
						it would go here, but there is no GET equivalent of signup since we dont
						have a "view profile" equivalent */
					})
			});

			it('signup should respond with status code 400 if username already exists', function(done) {
				request.post('/signup')
					.send(testUser)
					.expect(400)
					.end(function (err, res) {
						if (err) {
							done(err);
						}
						else {
							done();
						}
				});
			});

			it('login should respond with status code 200 if username/password is correct', function(done) {
				request.post('/login')
					.send(testUser)
					.expect(200)
					.end(function(err, res) {
						if (err) {
							done(err);
						}
						else {
							done();
						}
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
						if (err) {
							done(err);
						}
						else {
							done();
						}
					});
			});

			//should be a logout test here, as well as sessions tests, but too much work for MVP
		});

		describe('authentication', function() {

			it('should respond with a 401 if user attempts to access protected route while not logged in', function(done) {
				request.get('/testauth')
				.expect(401)
				.end(function(err, res) {
					if (err) {
						done(err);
					}
					else {
						done();
					}
				});
			});

			it('should respond with a 200 if user attempts to access protected route while logged in', function(done) {
				var agent = supertest.agent(serverHost);
				//login and capture cookie before attempting route
				agent.post('/login')
					.send(testUser)
					.expect(200)
					.end(function(err, res) {
						if (err) {
							done(err);
						}
						agent.get('/testauth').expect(200)
							.end(function(err, res) {
								if (err) {
									done(err);
								}
								else {
									done();
								}
							});
					});
			});
		});
	});

	describe("/league/", function() {
			var agent = supertest.agent(serverHost);
		
		//the object that is missing information

		//user login before running tests

		//cleanup - deletes inserted league from database
		var testUser = {
				username: 'testUser',
				email: "testemail@gmail.com",
				password: '123qwe'
		}

		before(function(done) {
			//login and capture cookie before attempting route
			agent.post('/signup')
				.send(testUser)
				.expect(201)
				.end(function(err, res) {
					if (err) {
						done(err);
					}
					agent.post('/login')
						.send(testUser)
						.expect(200)
						.end(function(err, res) {
							if (err) {
								done(err);
							}
							agent.get('/testauth').expect(200)
								.end(function(err, res) {
									if (err) {
										done(err);
									}
									else {
										done();
									}
								});
						});
		});
	});

	after(function(done) {

			//find and destroy user
			User.find({where: {username: testUser.username}})
				.then(function(foundUser) {
					foundUser.destroy().then(function() {
						done();
					});
				});
		});	

		//the new league tests will try to create
		var testLeague = {
				name: "leagueName",
				show: "tvShow",
				// owner: 02,
				roster_limit: 10
			}

		after(function(done) {

			var League = sequelize.define("league", {
			  name: Sequelize.STRING,
			  show: Sequelize.STRING,
			  owner: Sequelize.INTEGER,
			  roster_limit: Sequelize.INTEGER
			}); 

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
				//makes sure status code is correct
				.expect(200)
				//makes sure properties are correct
				.expect(function(res) {
					res.body.id.should.exist;
					res.body.name.should.equal(testLeague.name);
					res.body.show.should.equal(testLeague.show);
					res.body.owner.should.exist;
					res.body.roster_limit.should.equal(testLeague.roster_limit);
				})
				.end(function(err, res) {
					if (err) {
						done(err);
					}
					else {
						done();
					}
				})
		});

		it('should respond with status code 400 new league is not created', function(done) {

			agent.get('/logout')
				.send(testUser)
				.expect(200)
				.end(function(err, res) {
					if (err) {
						done(err);
					}
					else {
						done();
						agent.post('/league/')
							.send(testLeague)
							.expect(400)
							.end(function (err, res) {
								if (err) {
									done(err);
								}
								else {
									done();
								}
					 		});
				}
			});
		});
	});
});