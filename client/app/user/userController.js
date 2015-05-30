angular.module('app.user', [])
.controller('userController', function ($scope, $state, User) {
  
  $scope.user = {};

  $scope.signup = function () {
    User.signup($scope.user, function(created){
      if (created) {
        $state.go('login');
      }
    });
  };

  $scope.login = function () {
    User.login($scope.user, function(success){
      if (success) {
        $state.go('leagues');
      }
    });
  };

})
.factory('User', function($http) {

  var signup = function(user, callback) {
    $http({
      method: 'POST',
      url: '/signup',
      data: user 
    })
    .success(function (resp) {
      callback(true);
    })
    .error(function (err) {
      callback(false);
    });
  };

  var login = function(user, callback) {
    $http({
      method: 'POST',
      url: '/login',
      data: user 
    })
    .success(function (resp) {
      callback(true);
    })
    .error(function (err) {
      callback(false);
    });
  };

  return {
    signup: signup,
    login: login
  }
});