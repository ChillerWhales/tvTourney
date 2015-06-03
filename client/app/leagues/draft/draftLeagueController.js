angular.module('app.leagues.draft', [])
.controller('draftLeagueController', function ($scope, DraftLeague) { 
  $scope.roster = DraftLeague.getRoster();
  DraftLeague.queryCharacters(function(response) {
    $scope.characters = response;
  });

  $scope.draftCharacter = function() {
    DraftLeague.draftCharacter({
      characterId: this.character.id,
      name: this.character.name
    })
  }
})

.factory('DraftLeague', function($http, $stateParams) {

  var characters = [];
  var roster = [];
  // var lastDraftedCharacter;

  var getCharacters = function() {
    return characters;
  }

  var queryCharacters = function(callback) {
    //httprequesto
    $http({
      method: 'GET',
      url: '/league/' + $stateParams.id + '/characters'
    })
    .success(function (response) {
      console.log(response);
      callback(response);
    })
    .error(function (err) {
      console.log(err);
    });
  }

  var draftCharacter = function(characterToDraft) {
    // lastDraftedCharacter = characterToDraft.name;
    $http({
      Method: "POST",
      url: '/league/' + $stateParams.id + '/roster'
    }, {characterId: characterToDraft.characterId})
      .success(function(draftedCharacter) {
        draftedCharacter.name = characterToDraft.name;
        roster.push(draftedCharacter);
        console.log(draftedCharacter);
      })
  }

  var getRoster = function() {
    return roster;
  }

  return {
    getCharacters: getCharacters,
    queryCharacters: queryCharacters,
    getRoster: getRoster,
    draftCharacter: draftCharacter
  }

});