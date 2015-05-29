/*
 * Routing angular application
 * set State, url, templateUrl and controller
*/
angular.module('app.routes', ['ui.router'])
.config(function($stateProvider){
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
    .state('leagues.show', {
      url: 'leagues/:id/show',
      templateUrl: 'app/leagues/show/show.html',
      controller: 'showLeagueController'
    })
    .state('leagues.draft', {
      url: 'leagues/:id/draft',
      templateUrl: 'app/leagues/draft/draft.html',
      controller: 'draftLeagueController'
    });
});