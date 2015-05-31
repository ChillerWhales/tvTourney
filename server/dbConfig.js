var Sequelize = require("sequelize");


//no password
var connect = function(dbPath) {
	var sequelize = new Sequelize('database', 'root', '', {
		host:'localhost',
		dialect: 'sqlite',

		//not sure exactly what this does, copying config documentation
		pool: {
			max: 5,
			min: 0,
			idle: 10000
		},

		storage: dbPath
	});

	return sequelize;
}

var createSchemas = function(dbConnection, construct) {
	var tableConfig = {
		underscored: true,
		timestamps: true,
		freezeTableName: false
	}

	var User = require('./db/models/User')(dbConnection, tableConfig);
	var League = require('./db/models/League')(dbConnection, tableConfig);
	var LeagueCharacter = require('./db/models/LeagueCharacter')(dbConnection, tableConfig);
	var LeagueEvent = require('./db/models/LeagueEvent')(dbConnection, tableConfig);
	var UserLeague = require('./db/models/UserLeague')(dbConnection, tableConfig);
	var UserRoster = require('./db/models/UserRoster')(dbConnection, tableConfig);
	var CharacterEvent = require('./db/models/CharacterEvent')(dbConnection, tableConfig);

	// associations - define relationships between tables here
	LeagueCharacter.belongsTo(League)
	League.hasMany(LeagueCharacter)

	//Basically check if tables exists, if not, creates it
	if (construct) {
		User.sync();
		UserLeague.sync();
		UserRoster.sync();
		League.sync();
		LeagueCharacter.sync();
		LeagueEvent.sync();
		CharacterEvent.sync();
	}

	return {
		User: User,
		League: League,
		LeagueCharacter: LeagueCharacter,
		LeagueEvent: LeagueEvent,
		UserLeague: UserLeague,
		UserRoster: UserRoster,
		CharacterEvent: CharacterEvent
	}
}

exports.connect = connect;
exports.createSchemas = createSchemas;


