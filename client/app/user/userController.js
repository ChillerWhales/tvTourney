angular.module('app.user', [])
.controller('userController', function ($scope, $state, User) {
  console.log("controller created");
  var user = {};
  $scope.signup = function () {
    console.log('test');
    user = {
      email: $scope.emailInput,
      username: $scope.usernameInput,
      password: $scope.passwordInput
    };
    User.signup(user, function(created){
      if (created) {
        $state.go('login');
      }
    });
  };

  $scope.login = function () {
    user = {
      username: $scope.usernameInput,
      password: $scope.passwordInput
    };
    User.login(user, function(success){
      if (success) {
        $state.go('leagues.list');
      }
    });
  };

  $scope.logout = User.logout;
  $scope.getUserInfo = User.getUserInfo

})
.factory('User', function($http) {

  var currentUser = {};

  var signup = function(user, callback) {
    $http({
      method: 'POST',
      url: '/signup',
      data: user,
    })
    .success(function (res) {
      callback(true, res);
    })
    .error(function (err) {
      callback(false, err);
    });
  };

  var login = function(user, callback) {
    $http({
      method: 'POST',
      url: '/login',
      data: user,
    })
    .success(function (res) {
      //store the current user on login so id and username can be used in http calls
      currentUser = res;
      callback(true, res);
    })
    .error(function (err) {
      callback(false, err);
    });
  };

  var logout = function(callback) {
    var callback = callback || function() { };
    $http({
      method: 'GET',
      url: '/logout',
    })
    .success(function (res) {
      //delete information about currentUser on logout
      currentUser = {};
      callback(true, res);
    })
    .error(function (err) {
      callback(false, err);
    });
  }

  var getUserInfo = function() {
    return currentUser;
  }

  return {
    signup: signup,
    login: login,
    logout: logout,
    getUserInfo: getUserInfo
  }
});