/**
 * Routing angular application
 * set State, url, templateUrl and controller
 */
angular.module('app.routes', ['ui.router'])
.config(
  function($stateProvider, $urlRouterProvider) {
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
        controller: 'leagueController',
        /**
         * kind of like middleware, the function inside resolve is treated as a promise. Angular will wait
         * for the promise to resolve to either true or false before proceeding with the routing 
         */
        resolve: {authenticate: authenticate}
      }) 
      .state('leagues.new', {
        url: 'leagues/new',
        templateUrl: 'app/leagues/new/new.html',
        controller: 'newLeagueController',
        resolve: {authenticate: authenticate}
      })
      .state('leagues.list', {
        url: 'leagues/list',
        templateUrl: 'app/leagues/list/list.html',
        controller: 'listLeagueController',
        resolve: {authenticate: authenticate}
      })
      .state('leagues.show', {
        url: 'leagues/:id/show',
        templateUrl: 'app/leagues/show/show.html',
        controller: 'showLeagueController',
        resolve: {authenticate: authenticate}
      })
      .state('leagues.draft', {
        url: 'leagues/:id/draft',
        templateUrl: 'app/leagues/draft/draft.html',
        controller: 'draftLeagueController',
        resolve: {authenticate: authenticate}
      });
      
      /** 
       * this is kind of complicated, if you want a more in-depth explanation
       * go here: http://stackoverflow.com/questions/22537311/angular-ui-router-login-authentication
       */
      function authenticate ($q, User, $state, $timeout) {
        if (User.isAuthenticated()) {
          //resolves promise successfully (I think this is basically the same as done())
          return $q.when()
        }
        else {
          /**
           * this is the interesting part, basically if you dont use $timeout then
           * you would never be able to resolve the promise as rejected because it would
           * leave the user stuck at their current route, but the way this executes is
           * the promise resolves as rejected, preventing the user from changing state to 
           * the protected route, and then the function inside $timeout executes afterwards,
           * redirecting them to the login state 
           */
          $timeout(function() {
            $state.go('login')
          }); 
          return $q.reject();
        }
      }
  });

