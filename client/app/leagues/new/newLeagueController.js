angular.module('app.leagues.new', ['new.event.create', 'new.character', 'new.invite'])
.factory('League', function($http){
  return {
    postLeague: function(league, callback) {
      $http.post('/league', league)
        .success(function(league){
          console.log('successfully posted new league');
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
});



