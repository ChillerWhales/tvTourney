/*
 * Without backend server we need to run the following command
 * python -m SimpleHTTPServer 
 * to load templateURL from app.routes
**/
angular.module('app', [
  'app.routes',
  'app.user',
  'app.leagues'
])
.controller('appController', function($scope, User) {
  $scope.userState = false;

  $scope.$on('setUserState', function (event, value) {
    $scope.userState = value;
  });

  $scope.checkUser = function() {
    $scope.userState = localStorage.getItem('user') ? true : false;
  };

  $scope.checkUser();

  $scope.returnUser = function() {
    return JSON.parse(localStorage.getItem('user'));
  }
});