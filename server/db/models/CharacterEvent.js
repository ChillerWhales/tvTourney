var Sequelize = require("sequelize");

module.exports = function(sequelize, tableConfig) {
	return sequelize.define('character_event', {
		// league_id: Sequelize.STRING,
		// character_id: Sequelize.STRING,
		// event_id: Sequelize.STRING
	}, tableConfig);
} 