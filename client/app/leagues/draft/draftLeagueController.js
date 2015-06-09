angular.module('app.leagues.draft', [])
.controller('draftLeagueController', function ($scope, DraftLeague, $stateParams, ShowLeague, User) { 
  $scope.leagueId = $stateParams.id;
  $scope.roster = [];

  $scope.queryRoster = function() {
      ShowLeague.getUserRoster($scope.leagueId, User.getUserInfo().id, function(created, roster) {
        for (var i = 0; i < roster.length; i++) {
          $scope.roster.push(roster[i].league_character);
        }
    });
  }
  // $scope.roster = DraftLeague.getRoster();
  DraftLeague.queryCharacters(function(response) {
    $scope.characters = response;
  });

  $scope.draftCharacter = function() {
    DraftLeague.draftCharacter({
      characterId: this.character.id,
      name: this.character.name
    }, function(draftedCharacter) {
      $scope.roster.push(draftedCharacter);
    })
  }

  $scope.queryRoster();
})

.factory('DraftLeague', function($http, $stateParams, $state) {

  var characters = [];

  var getCharacters = function() {
    return characters;
  }

  var queryCharacters = function(callback) {
    $http({
      method: 'GET',
      url: '/league/' + $stateParams.id + '/characters'
    })
    .success(function (response) {
      callback(response);
    })
    .error(function (err) {
      console.log(err);
    });
  }

  var draftCharacter = function(characterToDraft, callback) {
    $http({
      method: "POST",
      url: '/league/' + $stateParams.id + '/roster',
      data: {characterId: characterToDraft.characterId}
    })
      .success(function(draftedCharacter) {
        draftedCharacter.name = characterToDraft.name;
        callback(draftedCharacter);
      })
  }

  return {
    getCharacters: getCharacters,
    queryCharacters: queryCharacters,
    draftCharacter: draftCharacter
  }

});