var Sequelize = require("sequelize");

module.exports = function(sequelize, tableConfig) {
	return sequelize.define('user_league', {
    current_score: {
        type: Sequelize.INTEGER, 
        defaultValue: 0
      }
	}, tableConfig); 
}