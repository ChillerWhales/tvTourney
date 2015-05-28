function setup(app, routeHandlers) {
	app.route('/')
		.get(routeHandlers.homeGet);
		//.post(POSTHANDLERFUNCTION)
}

exports.setup = setup;
