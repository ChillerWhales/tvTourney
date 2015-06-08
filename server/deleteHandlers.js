var logger = require('bristol');
var db = require('./db');
var utils = require('./lib/utils');

module.exports = {

  leagueCharactersDELETE: function(req, res) {
    if(!req.params.characterId) {
      logger.info("leagueCharactersDELETE attempted without charaIdcter");
      res.status(403).send("yo - where's your character_id");
    }

    utils.findUserId(req.session.token, function(user){
      utils.findLeagueById(parseInt(req.params.leagueId), function(league){
        if(user.id === league.owner) {
    
          db.LeagueCharacter.destroy({
            where: {
              id: req.params.characterId
            }
          })
          .then(function(result) {
            res.status(201).json(result);
          });
        } else {
          // current user is not the owner of the league
          logger.info("character Delete - League owner and logged in user does not match");
          res.status(400).send("You must be owner of the league to add characters");
        } 
      }); //  end findUserId
    });//  end findLeagueById
  }
}