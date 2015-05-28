function setup(app, routeHandlers) {
	app.route('/')
		.get(routeHandlers.homeGET);
		// .post(POSTHANDLERFUNCTION)
}

exports.setup = setup;
