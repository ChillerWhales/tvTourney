var Sequelize = require("sequelize");

module.exports = function(sequelize, tableConfig) {
	tableConfig.hooks = {
		afterCreate: function(characterEvent, options, fn) {
			// sequelize.league_character.find()
			sequelize.models.league_event.find({
				where: {id: characterEvent.league_event_id}
			}).then(function(event) {
				// console.log("event is:", event);
				// console.log("character event is:", characterEvent);
				//score is in event.dataValues.score_up
				//in characterEvent.dataValues we have id, league_id, league_character_id, league_event_id
				console.log(characterEvent.dataValues.league_id);
				console.log(characterEvent.dataValues.league_character_id);
				sequelize.models.user_roster.find({
					where: {
						league_id: characterEvent.dataValues.league_id,
						league_character_id: characterEvent.dataValues.league_character_id
					}
				}).then(function(userRosters) {
					console.log("Affected rows:", userRosters);
					fn(null, characterEvent);
				})
			})
		}
	}
	return sequelize.define('character_event', {
	}, tableConfig);
} 