angular.module('app.leagues.new', ['new.event.create'])
.factory('League', function($http){
  return {
    postLeague: function(league, callback) {
      $http.post('/league', league)
        .success(function(league){
          console.log('successfully posted new league');
          // get league id from league
          callback(false, league);
        })
        .error(function(err){
          console.log(err);
          callback(true, err);
        });
    },
    getLeagueId: function() {
      return league.league_id;
    }
  };

})
.controller('newLeagueController', function ($scope, $location) { // 
  $scope.step = 1;
  $scope.league = {};
  $scope.character = {};
  $scope.characters = [];

  $scope.go = function(path) {
    $location.path(path);
  };

  $scope.nextStep = function(step) {
    $scope.step = step;
  };
  $scope.setLeague = function(league){
    $scope.league = league;
  };
  $scope.setCharacter = function(character){
    $scope.character = character;
  };
  $scope.appendCharacters = function(character){
    $scope.characters.push(character);
  };
  $scope.removeCharacter = function(index){
    $scope.characters.splice(index,1);
  };
  $scope.getCharacterByIndex = function(index){
    return $scope.characters[index];
  };
  $scope.checkIfCharacters = function(){
    if ($scope.characters.length) {
      $scope.nextStep(3);
    }
  };
})

.controller('createLeagueCtrl', function ($scope, League) {
  
  $scope.league = {};
  $scope.saveLeagueInfo = function() {

    League.postLeague($scope.league, function(err, newLeague) {
      if (newLeague) {
        $scope.nextStep(2);
        $scope.setLeague(newLeague);
      }
    });
  };
})

/* 
'setCharactersCtrl' - manages characters addition, display and deletion 
- currently used on leage creation step2
*/
.controller('setCharactersCtrl', function ($scope, Character) {
  //get league.id from scope 
  $scope.character = {};
  $scope.addCharacter = function(){
    Character.saveCharacter($scope.league.id, $scope.character.name, function(err, character){
      if(character) {
        $scope.setCharacter(character);
        console.log(character);
        $scope.appendCharacters(character);
        $scope.character = {};
      }
    });
  };

  $scope.deleteCharacter = function($index){
    console.log("in deleteCharacter $index is ", $index);
    // var currentCharacter = $scope.characters[$index]

    var currentCharacter = $scope.getCharacterByIndex($index);
    console.log('currentCharacter is : ', currentCharacter);

    Character.deleteCharacter(currentCharacter.league_id, currentCharacter.id, function(err, result){
      if (result) { // count GT 0 
        console.log("on success clinet - characters deleted " ,result);
        $scope.removeCharacter($index);
      }
    });
  };


})

.controller('scoreSettingCtrl', function ($scope) {
})

.controller('inviteFriendsCtrl', function ($scope, invite) {
  $scope.invitedUsers = invite.getInvitedUsers();

  $scope.inviteUser = function() {
    invite.inviteUser($scope.league.id, $scope.username);
    $scope.username = "";
  }
})


.factory('invite', function($http) {
  //should be an empty array once route works
  var invitedUsers = [{username:"richie"}, {username:"antonio"}];

  var inviteUser = function(leagueId, username) {

    $http.post('/league/' + leagueId + '/invite', {'username': username})
      .success(function(invitedUser){
        invitedUsers.push(invitedUser);
      })
      .error(function(err){
        console.log('error:', err);
      });
  }

  var getInvitedUsers = function() {
    return invitedUsers;
  }

  return {
    inviteUser: inviteUser,
    getInvitedUsers: getInvitedUsers
  }
})

.factory('Character', function($http) {
  var saveCharacter = function(leagueId, characterName, callback){
    $http({
      method: 'POST',
      url: '/league/'+leagueId+'/characters',
      data: {name: characterName}
    })
    .success(function(character){
      console.log('created a character' , character);
      callback(false, character);
    })
    .error(function(err){
      console.log(err);
      callback(true, err);
    });
  };
  
  var deleteCharacter = function(leagueId, characterId, callback){
    $http({
      method: 'DELETE',
      url: '/league/'+leagueId+'/characters/'+characterId
    })
    .success(function(){
      console.log('deleted a character');
      callback(false, 'success');
    })
    .error(function(err){
      console.log(err);
      callback(true, err);
    });
  };
  
  return {
    saveCharacter: saveCharacter,
    deleteCharacter: deleteCharacter
  };

}) // end factrory - Character

