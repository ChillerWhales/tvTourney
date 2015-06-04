var Sequelize = require("sequelize");

module.exports = function(sequelize, tableConfig) {
	tableConfig.hooks = {
		/*this might drive you nuts, but take a look at it. Its worth it. What it does is when an event is triggered
		on a character, it automatically triggers a cascade that causes the scoe in the user roster table to be incremented
		by the point value of the event */
		afterCreate: function(characterEvent, options, fn) {
			//lookup the event that is being triggered so we can get the point (score_up) value
			sequelize.models.league_event.find({
				where: {id: characterEvent.league_event_id}
			}).then(function(event) {
				//find all the entries in the user_roster table and increment them
				sequelize.models.user_roster.update(
					//increment by point value of event
					{current_score: sequelize.literal('current_score + ' + event.get('score_up'))},
					//increment the current score for the specific character in all users (in that league) roster by the event point value
					{where: {
						league_id: characterEvent.dataValues.league_id,
						league_character_id: characterEvent.dataValues.league_character_id
					}}).then(function(affectedRows) {
						//equivalent to done() or next()
						fn(null, affectedRows);
				})
			})
		}
	}
	return sequelize.define('character_event', {
	}, tableConfig);
} 