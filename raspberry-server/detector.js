// Standalone program used for debugging.
// When started, it monitors the network
// for units and emits a message when it
// discovers one.

// require and instantiate network communication
var NetworkCommunication = require('./lib/networkcommunication'),
	network = new NetworkCommunication();

// initialize network commucation
network.listen();

// emit a message if this unit is elected server
network.on('promoted', function() {
	console.log("I am server now (" + network.ip + ")");
});

// emit a message if this unit is no longer server
network.on('demoted', function() {
	console.log("I am not server anymore (" + network.ip + ")");
});

// emit a message when a new unit is added to the network
network.on('added', function(ip) {
	console.log("A unit was added (" + ip + ")");
});

// emit a message when a unit is removed from the network
network.on('removed', function(ip) {
	console.log("A unit was removed (" + ip + ")");
});
