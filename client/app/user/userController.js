angular.module('app.user', [])
.controller('userController', function ($scope, $state, User) {
  var user = {};

  $scope.signup = function () {
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
        $scope.$emit('setUserState', true);
        $state.go('leagues.list');
      }
    });
  };

  $scope.logout = function() {
    User.logout(function (success) {
      $scope.$emit('setUserState', false);
      $state.go('login');
    });
  };

  $scope.home = function() {
    $state.go('leagues.list');
  };

  $scope.getUserInfo = User.getUserInfo

})
.factory('User', function($http) {
  //checks localstorage to see if user info exists
  var isAuthenticated = function() {
    return localStorage.getItem('user') ? true : false;
  }

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
      localStorage.setItem('user', JSON.stringify({
        id: res.id,
        username: res.username
      }));
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
      //delete user from localstorage
      localStorage.removeItem('user');
      callback(true, res);
    })
    .error(function (err) {
      callback(false, err);
    });
  }

  var getUserInfo = function() {
    return JSON.parse(localStorage.getItem('user'));
  }

  return {
    isAuthenticated: isAuthenticated,
    signup: signup,
    login: login,
    logout: logout,
    getUserInfo: getUserInfo
  }
});