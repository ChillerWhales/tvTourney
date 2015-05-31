angular.module('app.leagues.new', [])
.factory('postNewLeague', function($http){
  var league = {};
  return {
    saveLeagueAttr: function (leagueName, tvShow, weekDay, showTime, rosterLimit) {
      league.name = leagueName;
      league.show = tvShow;
      league.roster_limit = rosterLimit;
      league.week_day = weekDay;
      league.show_time = showTime;
    },
    postLeague: function() {
      $http({
        method: 'POST',
        url: '/league/',
        data: league,
      })
      .success(function (res) {
        callback(true, res);
      })
      .error(function (err) {
        callback(false, err);
      });
    }
  }
})
.controller('createLeagueCtrl', function ($scope, allLeagueAttr) {
  $scope.newLeague = {};
  $scope.saveLeagueInfo(leagueName, tvShow, weekDay, showTime, rosterLimit) {
    allLeagueAttr.saveLeagueAttr(leagueName, tvShow, weekDay, showTime, rosterLimit);
    // $scope.newLeague.name = leagueName;
    // $scope.newLeague.show = tvShow;
    // $scope.newLeague.weekday = weekDay;
    // $scope.newLeague.showTime = showTime;
    // $scope.newLeague.rosterLimit = rosterLimit
  }
})
.controller('setCharactersCtrl', function ($scope) {

})
.controller('scoreSettingCtrl', function ($scope) {
})
.controller('inviteFriendsCtrl', function ($scope) {

})