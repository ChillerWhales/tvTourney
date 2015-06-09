var Sequelize = require('sequelize');
var dbConfig = require('./dbConfig')

var sequelize = dbConfig.connect('./db/db.sqlite');
var schemas = dbConfig.createSchemas(sequelize, true);

/** 
 * export so any part of application that interacts with the database 
 * can simply require this file and call db.User, db.UserRoster etc etc 
 */
exports.User = schemas.User;
exports.UserLeague = schemas.UserLeague;
exports.UserRoster = schemas.UserRoster;
exports.League = schemas.League;
exports.LeagueCharacter = schemas.LeagueCharacter;
exports.LeagueEvent = schemas.LeagueEvent;
exports.CharacterEvent = schemas.CharacterEvent;



