/*
 * Without backend server we need to run the following command
 * python -m SimpleHTTPServer 
 * to load templateURL from app.routes
**/
angular.module('app', [
  'app.routes',
  'app.user',
  'app.leagues'
]);