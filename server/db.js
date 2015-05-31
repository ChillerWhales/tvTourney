var Sequelize = require("sequelize");
//no password
var sequelize = new Sequelize('database', 'root', '', {
	host:'localhost',
	dialect: 'sqlite',

	//not sure exactly what this does, copying config documentation
	pool: {
		max: 5,
		min: 0,
		idle: 10000
	},

	storage: './db/db.sqlite'
});

/* these define the schema for our tables - refactor later to be more
organized (perhaps separate files) and more dry because they are repeated
in the testing specs*/

var User = sequelize.define('user', {
  username: Sequelize.STRING,
  email: Sequelize.STRING,
  password: Sequelize.STRING
}); 

var UserLeague = sequelize.define('user_league', {
}); 

var UserRoster = sequelize.define('user_roster', {

}); 

var League = sequelize.define('league', {
  name: Sequelize.STRING,
  show: Sequelize.STRING,
  owner: Sequelize.INTEGER,
  roster_limit: Sequelize.INTEGER
}); 

var LeagueCharacter = sequelize.define('league_character', {

}); 

var LeagueEvent = sequelize.define('league_event', {
  
}); 

var CharacterEvent = sequelize.define('character_event', {

}); 

//define the relationships between the tables here

//Basically check if tables exists, if not, creates it
User.sync();
UserLeague.sync();
UserRoster.sync();
League.sync();
LeagueCharacter.sync();
LeagueEvent.sync();
CharacterEvent.sync();

/*export so any part of application that interacts with the database 
can simply require this file and call db.User, db.UserRoster etc etc */
exports.User = User;
exports.UserLeague = UserLeague;
exports.UserRoster = UserRoster;
exports.League = League;
exports.LeagueCharacter = LeagueCharacter;
exports.LeagueEvent = LeagueEvent;
exports.CharacterEvent = CharacterEvent;



