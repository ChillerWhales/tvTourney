angular.module('app.leagues.list', [])
.controller('listController', function ($scope, listHandler) { 
  $scope.leagues = [];
  $scope.getLeagues = function() {
    /*uses our getLeagues handler function to GET request on server
    for the list of leagues the user is associated with.*/
    leagueHandler.getLeagues()
      .then(function(data) {
        data.each(function(league) {
          $scope.leagues.push(league);
        });
      })
  }
  $scope.getLeagues();
})
//factory for handling get and post request to server for league creation activity
.factory('listHandler', function($http) {
  var getLeagues = function() {
    return $http({
      method: 'GET',
      url: '/leagues'
    }).then(function(resp) {
      //haven't tested what the response data looks like yet subject to change
      return resp.data;
    });
  };
  return {
    'getLeagues' : getLeagues
  }
});