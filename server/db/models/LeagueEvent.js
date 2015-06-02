var Sequelize = require("sequelize");

module.exports = function(sequelize, tableConfig) {
	return sequelize.define('league_event', {
	//don't define this column, sequelize relationship builds it automatically
    // league_id: Sequelize.INTEGER,
    description: Sequelize.STRING,
    score_up: Sequelize.INTEGER
	}, tableConfig);
}