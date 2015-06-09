angular.module('new.invite', [])
.controller('inviteFriendsCtrl', function ($scope, invite, $location) {
  $scope.invitedUsers = [];

  $scope.inviteUser = function() {
    invite.inviteUser($scope.league.id, $scope.username, function(invitedUser) {
      $scope.invitedUsers.push(invitedUser);
      $scope.username = "";
    });
  }
  $scope.saveInvite = function() {
    if ($scope.invitedUsers.length){
      $location.path('/leagues/list');
    }
  }
})


.factory('invite', function($http) {
  var inviteUser = function(leagueId, username, callback) {
    $http.post('/league/' + leagueId + '/invite', {'username': username})
      .success(function(invitedUser){
        callback(invitedUser);
      })
      .error(function(err){
        console.log('error:', err);
      });
  }

  var getInvitedUsers = function() {
    return $scope.invitedUsers;
  }

  return {
    inviteUser: inviteUser
  }
});