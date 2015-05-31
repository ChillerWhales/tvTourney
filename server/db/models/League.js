var Sequelize = require("sequelize");

module.exports = function(sequelize, tableConfig) {
	return sequelize.define('league', {
	  name: Sequelize.STRING,
	  show: Sequelize.STRING,
	  owner: Sequelize.INTEGER,
	  roster_limit: Sequelize.INTEGER
	}, tableConfig); 
}