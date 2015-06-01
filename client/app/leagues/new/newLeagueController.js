angular.module('app.leagues.new', [
  'new.event.create'
])
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
        })
    },
    getLeagueId: function() {
      return league.league_id;
    }

  }

})
.controller('newLeagueController', function ($scope) {
  $scope.step = 3;
  $scope.league = {};
  $scope.nextStep = function(step) {
    $scope.step = step;
  };
  $scope.setLeague = function(league){
    $scope.league = league;
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
  }

})
.controller('setCharactersCtrl', function ($scope) {

})
.controller('scoreSettingCtrl', function ($scope) {
})
.controller('inviteFriendsCtrl', function ($scope) {

})