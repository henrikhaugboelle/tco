console.log("raspberry-server");

var NetworkNode = require('./networknode'),
	Serial = require('./serial'),

	AverageConverter = require('./converters/converter-average'),
	FirstConverter = require('./converters/converter-first'),
	FirstConverter = require('./converters/converter-second'),
	FirstConverter = require('./converters/converter-third'),
	FirstConverter = require('./converters/converter-walk'),
	FirstConverter = require('./converters/converter-color'),
	PrototypeConverter = require('./converters/converter-prototype'),

	converter = new ColorConverter(),
	serial = new Serial(),
	nn = new NetworkNode();

serial.listen();
nn.listen();

// from client to server and server calculations to clients
nn.on('clientMessage', function(message, remote) {
	converter.push(message.toString().split(','));
});

converter.emit(function(values) {
	nn.sendMessageToClients(values.join(','));
});

// serial to server and server to serial
serial.on('message', function(values) {
	nn.sendMessageToServer(values.join(","));
});

nn.on('serverMessage', function(message, remote) {
	serial.write((message+"").split(','));
});

// discovery
nn.on('promoted', function() {
	converter.start();
	console.log("I am server now (" + nn.ip + ")");
});

nn.on('demoted', function() {
	converter.stop();
	console.log("I am not server anymore (" + nn.ip + ")");
});

nn.on('added', function(ip) {
	console.log("A server was added (" + ip + ")");
});

nn.on('removed', function(ip) {
	console.log("A server was removed (" + ip + ")");
});