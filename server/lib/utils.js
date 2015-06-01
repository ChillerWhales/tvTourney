var db = require('../db');

exports.findUserId = function(reqSessionToken, callback) {
	if (!reqSessionToken) {
		return null;
	}

  db.User.findOne({where: {username: reqSessionToken}}).then(function(user){
    callback(user);
  })
};