angular.module('app.leagues', [
  'ui.router',
  'app.leagues.show',
  'app.leagues.new',
  'app.leagues.list',
  'app.leagues.draft'
])
.controller('leagueController', function ($scope) { 
});
