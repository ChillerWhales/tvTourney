angular.module('app.user', [])
.controller('userController', function ($scope, $state, User) {
  
  $scope.user = {};

  $scope.signup = function() {
    $state.go('login');
  };

})
.factory('User', function($http) {

  return {}
});