angular.module('app.leagues.list', [])
.controller('listLeagueController', function ($scope, ListLeague) { 
  $scope.leagues = [];
  $scope.getLeagues = function() {
    console.log('CALL GET LEAGUES');
    /*uses our getLeagues handler function to GET request on server
    for the list of leagues the user is associated with.*/
    ListLeague.getLeagues(function (err, user) {
      if (err) {

      }else {
        $scope.leagues = user.leagues;
      }
    });
  }

  $scope.getLeagues();
})
//factory for handling get and post request to server for league creation activity
.factory('ListLeague', function($http) {
  var getLeagues = function(callback) {
    $http({
      method: 'GET',
      url: '/user/leagues'
    })
    .success(function (response) {
      console.log(response);
      callback(false, response);
    })
    .error(function (err) {
      callback(true, err);
    });
  };
  return {
    getLeagues : getLeagues
  }
});