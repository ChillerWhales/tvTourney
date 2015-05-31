var Sequelize = require("sequelize");

module.exports = function(sequelize, tableConfig) {
	return sequelize.define('league_character', {
	  name: Sequelize.STRING,
	}, tableConfig); 
}