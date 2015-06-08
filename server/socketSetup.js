var logger = require('bristol');
var sockets = require('socket.io');

var leagues = {};

//express server object is passed to this function and it attaches websockets + all the event listeners and handlers
module.exports = function(server) {
	//this is what actually attaches socket.io to the express server
	io = sockets(server);
	io.on('connection', function(socket) {
		//when a connection is established, the client is notified
		socket.emit('success', 'Connected successfully!');
		logger.info("New socket connection established!");

		/*Once the client is notified of a successful connection, it will tell the server which league it is on
		and all users viewing the same league will be added to a socket.io "room" so that socket.io can emit to them all simultaneously*/
		socket.on('joinLeague', function(joinRequest) {
			logger.info("User joined socket room for league: ", joinRequest.leagueId)
			socket.join(joinRequest.leagueId);
		});

		/* When a client notifies the server that an event that has been triggered, the server passes that message along to all
		clients that are looking at the same league which the event was triggered on */
		socket.on('triggerEvent', function(triggeredEvent) {
			logger.info(triggeredEvent, "was emitted to league: ", triggeredEvent.leagueId);
			io.to(triggeredEvent.leagueId).emit('triggerEvent', triggeredEvent);
		})
	});

}