/*
 * File to test routings url and check that each url 
 * matchs with the correct controller
*/
angular.module('app.routes', ['ui.router'])
.config(function($stateProvider){
  $stateProvider
    .state('signup', {
      url: '/signup',
    }) 
    .state('login', {
      url: '/login'
    }) 
    .state('home', {
      url: '/'
    }) 
    .state('home.leagues', {
      url: ''
    }) 
    .state('home.leagues.show', {
      url: 'leagues/:id'
    })
    .state('home.leagues.new', {
      url: 'leagues/new'
    })
    .state('home.leagues.draft', {
      url: 'leagues/:id/draft'
    });
});