var Sequelize = require('sequelize');

module.exports = function(sequelize, tableConfig) {
	return sequelize.define('league_event', {
    description: Sequelize.STRING,
    score_up: Sequelize.INTEGER
	}, tableConfig);
}