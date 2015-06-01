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
.controller('newLeagueController', function ($scope) { // 
  $scope.step = 1;
  $scope.league = {};
  $scope.character = {};
  $scope.characters = [];

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
  $scope.checkIfChracters = function(){
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
    Character.saveCharacter($scope.league.id,function(err, character){
      if(character) {
        $scope.setCharacter(character);
        $scope.appendCharacters(character);
        $scope.character = {};
      }
    });
  };
})

.controller('scoreSettingCtrl', function ($scope) {
})
.controller('inviteFriendsCtrl', function ($scope) {
})

.factory('Character', function($http) {
  var saveCharacter = function(leagueId, callback){
    $http({
      method: 'POST',
      url: '/league/'+leagueId+'/characters',
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
  
  return {
    saveCharacter: saveCharacter
  };
})