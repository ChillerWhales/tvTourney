angular.module('app.leagues.draft', [])
.controller('draftLeagueController', function ($scope, DraftLeague) { 
  console.log("yo");
  DraftLeague.queryCharacters(function(response) {
    $scope.characters = response;
  });
  // $scope.characters = DraftLeague.getCharacters();
  // $scope.characters = DraftLeague.characters;
})

.factory('DraftLeague', function($http, $stateParams) {

  var characters = [];
  var roster = [];

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
      // callback(false, response);
      console.log(response);
      characters = response;
      callback(response);
      return(response);
    })
    .error(function (err) {
      // callback(true, err);
      console.log(err);
    });
  }

  var getRoster = function() {
    return roster;
  }

  return {
    characters: characters,
    getCharacters: getCharacters,
    queryCharacters: queryCharacters,
    getRoster: getRoster
  }

});