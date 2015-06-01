var Sequelize = require('sequelize');
var db = require('./db');

/**
  * GENERATE USERS
**/


var users = [
  {
    username: 'Mónica',
    email: 'monica@gmail.com',
    password: '123456'
  },
  {
    username: 'Kuldeep',
    email: 'kuldeep@gmail.com',
    password: '123456'
  },
  {
    username: 'Richi',
    email: 'richi@gmail.com',
    password: '123456'
  },
  {
    username: 'Jack',
    email: 'jack@gmail.com',
    password: '123456'
  },
  {
    username: 'Antonio',
    email: 'antonio@gmail.com',
    password: '123456'
  },
  ];

for(var i = 0, size = users.length; i < size; i++) {
  var user = users[i];
  (function(user) {
    db.User.findOrCreate({
      where: user
    })
    .then(function(newUser) {
      if (newUser) {
        console.log("User ", user.username, " created successfully");
      } else {
        console.log("User ", user.username, " error when tryed to create it");
      }
    });
  })(user);
}

/**
* Create League
**/

db.User.find({
  where: {
    username: 'Mónica'
  }
})
.then(function (user) {
  var newLeague = {
    name: 'ChillerWhales',
    show: 'Game of Thrones',
    owner: user.id,
    roster_limit: 2
  };
  db.League.findOrCreate({
    where: newLeague
  })
  .then(function(league){
    /**
      * Create Characters
    **/
    if (league) {
      console.log('League ' + league.name + 'created successfully');
      var id = league.id
      var characters = [
        {
          name: 'Character 1',
          league_id: id
        },
        {
          name: 'Character 2',
          league_id: id
        },
        {
          name: 'Character 3',
          league_id: id
        },
        {
          name: 'Character 4',
          league_id: id
        },
        {
          name: 'Character 5',
          league_id: id
        },
        {
          name: 'Character 6',
          league_id: id
        },
        {
          name: 'Character 7',
          league_id: id
        }
      ];

      for(var i = 0, size = characters.length; i < size; i++) {
        var character = characters[i];
        (function (character) {
          db.LeagueCharacter.findOrCreate({
            where: character
          })
          .then(function (row) {
            if (row) {
              console.log('Character ' + row.name + 'created successfully')
            }else{
              console.log('Error ' + character.name);
            }
          });
        })(character);
      }
    }else {
      console.log('Error to create league');
    }
  });
});






