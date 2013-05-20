var NetworkCommunication = require('./networkcommunication'),
	SerialFramming = require('./serialframming'),
	SignalConverter = require('./converters/signalconverter'),

	converter = new SignalConverter(),
	serial = new SerialFramming(),
	network = new NetworkCommunication();

serial.listen();
network.listen();

// from client to server and server calculations to clients
network.on('clientMessage', function(message, remote) {
	converter.push(message.toString().split(','));
});

converter.emit(function(values) {
	network.sendMessageToClients(values.join(','));
});

// serial to server and server to serial
serial.on('message', function(values) {
	network.sendMessageToServer(values.join(","));
});

network.on('serverMessage', function(message, remote) {
	serial.write((message+"").split(','));
});

// discovery
network.on('promoted', function() {
	converter.start();
	console.log("I am server now (" + network.ip + ")");
});

network.on('demoted', function() {
	converter.stop();
	console.log("I am not server anymore (" + network.ip + ")");
});

network.on('added', function(ip) {
	console.log("A server was added (" + ip + ")");
});

network.on('removed', function(ip) {
	console.log("A server was removed (" + ip + ")");
});
