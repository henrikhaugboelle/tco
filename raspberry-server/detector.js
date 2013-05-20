var NetworkCommunication = require('./lib/networkcommunication'),
	network = new NetworkCommunication();

network.listen();

network.on('promoted', function() {
	console.log("I am server now (" + network.ip + ")");
});

network.on('demoted', function() {
	console.log("I am not server anymore (" + network.ip + ")");
});

network.on('added', function(ip) {
	console.log("A unit was added (" + ip + ")");
});

network.on('removed', function(ip) {
	console.log("A unit was removed (" + ip + ")");
});
