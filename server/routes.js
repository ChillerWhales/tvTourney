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
    .post(routeHandlers.leagueCreatePOST);

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
