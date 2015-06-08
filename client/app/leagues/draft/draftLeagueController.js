angular.module('app.leagues.draft', [])
.controller('draftLeagueController', function ($scope, DraftLeague, $stateParams) { 
  $scope.leagueId = $stateParams.id;
  $scope.roster = DraftLeague.getRoster();

  DraftLeague.queryCharacters(function(response) {
    $scope.characters = response;
  });

  $scope.draftCharacter = function() {
    DraftLeague.draftCharacter({
      characterId: this.character.id,
      name: this.character.name
    })
  };
})

.factory('DraftLeague', function($http, $stateParams, $state) {

  var characters = [];
  var roster = [];

  var getCharacters = function() {
    return characters;
  };

  var queryCharacters = function(callback) {
    // http request
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
  };

  var draftCharacter = function(characterToDraft) {
    $http({
      method: 'POST',
      url: '/league/' + $stateParams.id + '/roster',
      data: {characterId: characterToDraft.characterId}
    })
    .success(function(draftedCharacter) {
      draftedCharacter.name = characterToDraft.name;
      roster.push(draftedCharacter);
    })
    .error(function(err) {
      console.log(err);
    });
  };

  var getRoster = function() {
    return roster;
  };

  return {
    getCharacters: getCharacters,
    queryCharacters: queryCharacters,
    getRoster: getRoster,
    draftCharacter: draftCharacter
  }

});