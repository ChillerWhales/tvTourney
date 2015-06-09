var logger = require('bristol');
var db = require('./db');
var utils = require('./lib/utils');

module.exports = {
  leagueDELETE: function(req, res) {
    utils.findLeagueById(req.params.leagueId, function(league) {
      if(!league) {
        logger.info("League doesn't exist!");
        res.status(400).send("Invalid league ID!");
      }
      else {
        utils.findUserId(req.session.token, function(user) {
          if(user.id === league.owner) {
            db.League.destroy({where: {
              id: req.params.leagueId
            }}).then(function() {
              res.status(201).json(league);
            });
          }
          else {
            logger.info("User does not have authorization to delete league");
            res.status(401).send("You don't have authorization to delete!");
          }
        });
      }
    });
  },

  leagueCharactersDELETE: function(req, res) {
    if(!req.params.characterId) {
      logger.info("leagueCharactersDELETE attempted without character ID");
      res.status(403).send("yo - where's your character_id");
    }

    utils.findUserId(req.session.token, function(user) {
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
          res.status(400).send("You must be owner of the league to delete characters");
        } 
      }); //  end findUserId
    });//  end findLeagueById
  },

  leagueEventsDELETE: function(req, res) {
    utils.findLeagueById(req.params.id, function(league) {
      if(!league) {
        logger.info("Invalid league ID!");
        res.status(400).send("A league doesn't exist under your league ID");
      } 
      else {
        utils.findUserId(req.session.token, function(user) {
          if(user.id === league.owner) {
            db.LeagueEvent.findOne({
              where: {
                id: req.params.eventId,
                league_id: req.params.id
              }
            }).then(function(leagueEvent) {
              if(leagueEvent) {
                db.LeagueEvent.destroy({where: {
                  id: leagueEvent.id,
                  league_id: leagueEvent.league_id
                  }
                }).then(function() {
                  res.status(201).json(leagueEvent);
                });
              }
              else {
                logger.info("League event does not exist");
                res.status(400).send("Invalid League_event ID!");
              }
            });
          }
          else {
            logger.info("User does not have authorization to delete event");
            res.status(403).send("You must be the owner of the league to delete events")
          }
        }) 
      }
    });
  }
}