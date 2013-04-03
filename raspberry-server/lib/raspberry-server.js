console.log("raspberry-server");

var NetworkNode = require('./networknode'),
	Serial = require('./serial');


var Converter = require('./../../experiment/converter'),
	CalculateAverage = require('./../../experiment/calculate-average');

var serial = new Serial();
serial.listen();

var nn = new NetworkNode();
nn.listen();

var converter = new Converter({
	calculator: new CalculateAverage()
});

// from client to server and server calculations to clients
nn.on('clientMessage', function(message, remote) {
	// console.log("message from client: " + remote.address + ":" + remote.port + " = " + message);
	
	console.log("receiving values: " + message);
	converter.push(message.split(','));
});

converter.emit(function(values) {
	console.log("sending calculated values: " + values.join(','));
	nn.sendMessageToClients(values.join(','));
});


// serial to server and server to serial
serial.on('message', function(values) {
	nn.sendMessageToServer(values.join(","));
});

nn.on('serverMessage', function(message, remote) {
	// console.log(">> message from server: " + remote.address + ":" + remote.port + " = " + message);
	serial.write((message+"").split(','));
});

// discovery
nn.on('promoted', function() {
	console.log("I am server now (" + nn.ip + ")");
});

nn.on('demoted', function() {
	console.log("I am not server anymore (" + nn.ip + ")");
});

nn.on('added', function(ip) {
	console.log("A server was added (" + ip + ")");
});

nn.on('removed', function(ip) {
	console.log("A server was removed (" + ip + ")");
});
