var db = require('../db');

exports.findUserId = function(reqSessionToken, callback) {
	if (!reqSessionToken) {
		return null;
	}

  db.User.findOne({where: {username: reqSessionToken}}).then(function(user){
    callback(user);
  });
};


exports.findLeagueById = function(leagueId, callback) {
  db.League.findOne({where: {id: leagueId}})
  .then(function(league){
    callback(league);
  });
};
