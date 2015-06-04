angular.module('app.leagues.show', [])
.controller('showLeagueController', function ($scope, $stateParams, ShowLeague, $location, $window, $state) {
  $scope.league = {};
  $scope.events = [];
  $scope.characters = [];
  $scope.showEvents = false;
  $scope.showCharacters = false;
  $scope.indexUser;
  $scope.indexSelect;
  $scope.showTool = false;
  $scope.showUserRoster = true;

  var currentUserId = JSON.parse(localStorage.getItem('user')).id;

  $scope.isOwner = function() {
    if(currentUserId === $scope.league.owner) {
      return true;
    }
    return false;
  };

  $scope.triggerEvent = function() {
    console.log($scope.charSelection);
  }

  $scope.toggleTool = function() {
    $scope.showTool = !$scope.showTool;
  };

  $scope.toggleEvents = function() {
    $scope.showEvents = !$scope.showEvents;
  };

  $scope.toggleCharacters = function() {
    $scope.showCharacters = !$scope.showCharacters;
  };
  // if roster exists
    // $scope.drafted = true
  // else 
    //$scope.drafted = false;

  $scope.showRoster = function(index, userId) {
    $scope.indexSelect = index;

    ShowLeague.getUserRoster($scope.league.id, $scope.users[index].id, function (err, response){
      $scope.users[index].roster = response;
    });
  }

  $scope.getLeague = function (){
    ShowLeague.getLeague($stateParams.id, function (err, response) {
      if (!err) {
        $scope.league = response;
        
        ShowLeague.getUsers($scope.league.id, function (err, response){
          $scope.users = response;
        });

        ShowLeague.getUserRoster($scope.league.id, currentUserId, function (err, response){
          console.log('get user roster response:', response);
          // console.log('character roster name', response[0].league_character.name)
          console.log('character roster length', response.length)
          $scope.rosterLength = response.length;
        });

      }
      else {
        console.log(err)
      }
    });
  } ;

  $scope.selectUser = function (index) {
    $scope.indexUser = index;
  };

  $scope.getEvents = function() {
    ShowLeague.getEvents($stateParams.id).success(function(data) {
      $scope.events = data;
    }).error(function(err) {
      console.log(err);
    });
  };

  $scope.getCharacters = function() {
    ShowLeague.getCharacters($stateParams.id).success(function(data) {
      $scope.characters = data;
    }).error(function(err) {
      console.log(err);
    });
  };

  $scope.getLeague();
  $scope.getEvents();
  $scope.getCharacters();
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

  var getEvents = function(league_id) {
    return $http({
      method: 'GET',
      url: '/league/' + league_id + '/events'
    }).success(function(resp) {
      return resp;
    }).error(function(err) {
      return err;
    });
  }

  var getCharacters = function(league_id) {
    return $http({
      method: 'GET',
      url: '/league/' + league_id + '/characters'
    }).success(function(resp) {
      return resp;
    }).error(function(err) {
      return err;
    });
  }

  var getUserRoster = function(leagueId, userId, callback) {
    console.log('leagueId', leagueId);
    console.log('userId', userId);
    $http({
      method: 'GET',
      url: '/league/' + leagueId + '/user/' + userId + '/roster',
    })
    .success(function (res) {
      callback(false, res);
    })
    .error(function (err) {
      callback(true, err);
    });
  };

  var triggerEvent = function() {

  };

  return {
    getLeague: getLeague,
    getUsers: getUsers,
    getEvents: getEvents,
    getCharacters: getCharacters,
    getUserRoster: getUserRoster,
    triggerEvent: triggerEvent
  };
});