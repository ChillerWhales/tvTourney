angular.module('app.leagues.show', [])
.controller('showLeagueController', function ($scope, $stateParams, ShowLeague) {
  $scope.league = {};

  $scope.getLeague = function (){
    ShowLeague.getLeague($stateParams.id, function (err, response) {
      if (!err) {
        $scope.league = response;
      }
    });
  };

})
.factory('ShowLeague', function ($http) {

  var getLeague = function(id, callback) {
    $http({
      method: 'GET',
      url: '/league/' + id,
    })
    .success(function (res) {
      callback(false, res);
    })
    .error(function (err) {
      callback(true, err);
    });
  };

  return {
    getLeague: getLeague
  };
});