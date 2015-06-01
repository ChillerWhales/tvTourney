var auth = require('./authentication');

function setup(app, routeHandlers) {
	app.route('/')
		.get(routeHandlers.homeGET);
	app.route('/signup')
		.post(routeHandlers.signupPOST);
	app.route('/login')
		.post(routeHandlers.loginPOST);
	app.route('/logout')
		.get(routeHandlers.logoutGET);
  app.route('/league/')
    .all(auth)
    .post(routeHandlers.leagueCreatePOST);
	app.route('/league/:id/events')
    .all(auth)
    .get(routeHandlers.eventGET)
    .post(routeHandlers.eventPOST);
  app.route('/league/:leagueId/characters')
  .get(routeHandlers.leagueCharactersGET)
  .post(routeHandlers.leagueCharactersPOST);
<<<<<<< HEAD
  app.route('/league/:id/invite')
    .post(routeHandlers.leagueInvitePOST);
=======
>>>>>>> e7c0867510d2ac1bfa231eaa8efcf7f038d0a5ba
  app.route('/user/leagues')
    .get(routeHandlers.userLeaguesGET);
  /*adding auth here protects the route from unauthenticated users
  if user is authenticated, auth will call next and the next routehandler
  will catch the requeset and process it, otherwise the user will receive
  a 401 */
  app.route('/testauth')
    //basically route-specific middleware
    .all(auth)
    .get(routeHandlers.testAuthGET);
}

exports.setup = setup;
