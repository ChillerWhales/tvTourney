var db = require('../db');

exports.findUserId = function(reqSessionToken) {
  db.User.findOne({where: {username: reqSessionToken}}).then(function(user){
    return user.id;
  })
};