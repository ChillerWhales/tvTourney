var logger = require('bristol');
var sockets = require('socket.io');

var leagues = {};

//socket object is passed to this function and it adds all the event listeners and handlers
module.exports = function(server) {
	//this is what actually attaches socket.io to the express server
	io = sockets(server);
	io.on('connection', function(socket) {
		socket.emit('success', 'Connected successfully!');
		console.log("New socket connection established!");
		logger.info("New socket connection established!");
		
		socket.on('joinLeague', function(joinRequest) {
			console.log(joinRequest.leagueId);
			console.log("User joined socket room for league: ", joinRequest.leagueId)
			logger.info("User joined socket room for league: ", joinRequest.leagueId)
			socket.join(joinRequest.leagueId);
		});

		socket.on('triggerEvent', function(triggeredEvent) {
			console.log(triggeredEvent, "was emitted to league: ", triggeredEvent.leagueId);
			logger.info(triggeredEvent, "was emitted to league: ", triggeredEvent.leagueId);
			io.to(triggeredEvent.leagueId).emit('triggerEvent', triggeredEvent);
		})
	});

}