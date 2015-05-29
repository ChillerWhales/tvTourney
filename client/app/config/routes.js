angular.module('app.routes', ['ui.router'])
.config(function($stateProvider){
  $stateProvider
    .state('signup', {
      url: "/signup"
    }) 
});