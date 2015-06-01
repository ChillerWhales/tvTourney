/*
 * Routing angular application
 * set State, url, templateUrl and controller
*/
angular.module('app.routes', ['ui.router'])
.config(function($stateProvider, $urlRouterProvider){
  $urlRouterProvider.otherwise("/login");
  $stateProvider
    .state('signup', {
      url: '/signup',
      templateUrl: 'app/user/signup.html',
      controller: 'userController'
    }) 
    .state('login', {
      url: '/login',
      templateUrl: 'app/user/login.html',
      controller: 'userController'
    }) 
    .state('leagues', {
      url: '/',
      templateUrl: 'app/leagues/leagues.html',
      controller: 'leagueController'
    }) 
    .state('leagues.new', {
      url: 'leagues/new',
      templateUrl: 'app/leagues/new/new.html',
      controller: 'newLeagueController'
    })
    .state('leagues.list', {
      url: 'leagues/list',
      templateUrl: 'app/leagues/list/list.html',
      controller: 'listLeagueController'
    })
    .state('leagues.show', {
      url: 'leagues/:id/show',
      templateUrl: 'app/leagues/show/show.html',
      controller: 'showLeagueController'
    });
});