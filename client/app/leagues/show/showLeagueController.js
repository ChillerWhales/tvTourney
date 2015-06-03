angular.module('app.leagues.show', [])
.controller('showLeagueController', function ($scope, $stateParams, ShowLeague) {
  $scope.league = {};

  $scope.indexUser;

  $scope.getLeague = function() {
    ShowLeague.getLeague($stateParams.id, function(err, response) {
      if (!err) {
        console.log("League not found!");
      }
      else {
        console.log(response);
      }
    });
  }

  $scope.getLeague = function (){
    ShowLeague.getLeague($stateParams.id, function (err, response) {
      if (!err) {
        console.log(response);
        $scope.league = response;
      }
    //   $scope.league = {
    //       name: 'ChillerWhales',
    //       show: 'Game of Thrones',
    //       owner: 'Mónica',
    //       roster_limit: 2
    //     };
    //     ShowLeague.getUsers($stateParams.id, function (err, response) {
    //       if (!err) {

    //       }
    //       $scope.league.users = [
    //         {
    //           username: 'Jack',
    //           points: '24',
    //           roster: [
    //             {
    //               name: 'Character 1',
    //               points: 24
    //             }
    //           ]
    //         },
    //         {
    //           username: 'Richi',
    //           points: '20',
    //           roster: [
    //             {
    //               name: 'Character 3',
    //               points: 20
    //             },
    //             {
    //               name: 'Character 4',
    //               points: 4
    //             }
    //           ]
    //         },
    //         {
    //           username: 'Kuldeep',
    //           points: '20',
    //           roster: [
    //             {
    //               name: 'Character 2',
    //               points: 20
    //             }
    //           ]
    //         },
    //         {
    //           username: 'Mónica',
    //           points: '19',
    //           roster: [
    //             {
    //               name: 'Character 7',
    //               points: 19
    //             }
    //           ]
    //         },
    //         {
    //           username: 'Antonio',
    //           points: '17',
    //           roster: [
    //             {
    //               name: 'Character 6',
    //               points: 17
    //             }
    //           ]
    //         }
    //       ];
    //     });
    });
  };

  $scope.selectUser = function (index) {
    $scope.indexUser = index;
  };

  $scope.getLeague();

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

  var getUsers = function(id, callback) {
    $http({
      method: 'GET',
      url: '/league/' + id + '/users',
    })
    .success(function (res) {
      callback(false, res);
    })
    .error(function (err) {
      callback(true, err);
    });
  };

  return {
    getLeague: getLeague,
    getUsers: getUsers
  };
});