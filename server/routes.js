var auth = require('./authentication');

function setup(app, routeHandlers, deleteHandlers) {
	app.route('/')
		.get(routeHandlers.homeGET);
	app.route('/signup')
		.post(routeHandlers.signupPOST);
	app.route('/login')
		.post(routeHandlers.loginPOST);
	app.route('/logout')
		.get(routeHandlers.logoutGET);
  app.route('/league')
    .all(auth)
    .post(routeHandlers.leagueCreatePOST);
  app.route('/league/:leagueId')
    .all(auth)
    .get(routeHandlers.leagueGET);
  app.route('/league/:leagueId/users')
    .all(auth)
    .get(routeHandlers.leagueUsersGET);
	app.route('/league/:id/events')
    .all(auth)
    .get(routeHandlers.eventGET)
    .post(routeHandlers.eventPOST);
  app.route('/league/:leagueId/characters')
    .get(routeHandlers.leagueCharactersGET)
    .post(routeHandlers.leagueCharactersPOST);
  app.route('/league/:leagueId/invite')
    .post(routeHandlers.leagueInvitePOST);
  app.route('league/:leagueId/roster')
    .all(auth)
    .post(routeHandlers.rosterPOST);
  app.route('league/:leagueId/user/:userId/roster')
    .all(auth)
    .get(routeHandlers.rosterGET);
  app.route('/user/leagues')
    .get(routeHandlers.userLeaguesGET);
  app.route('/league/:leagueId/triggerevent')
    .post(routeHandlers.triggerEventCharacterPOST)
    .get(routeHandlers.triggerEventCharacterGET);
  //deletion routes
  
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
