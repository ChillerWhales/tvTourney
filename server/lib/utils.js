var db = require('../db');

exports.findUserId = function(reqSessionToken, callback) {
  db.User.findOne({where: {username: reqSessionToken}}).then(function(user){
    callback(user);
  })
};