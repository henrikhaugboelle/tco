console.log("raspberry-server");

function pad(num) {
    var s = num+"";
    while (s.length < 3) s = "0" + s;
    return s;
}

var NetworkNode = require('./networknode'),
	Serial = require('./serial');


var AverageConverter = require('./../../experiment/converter-average'),
	FirstConverter = require('./../../experiment/converter-first'),
	PrototypeConverter = require('./../../experiment/converter-prototype');

var serial = new Serial();
serial.listen();

var nn = new NetworkNode();
nn.listen();

var converter = new PrototypeConverter();
converter.start();

// from client to server and server calculations to clients
nn.on('clientMessage', function(message, remote) {
	// console.log("message from client: " + remote.address + ":" + remote.port + " = " + message);
	
	//console.log("receiving values: " + message);
	var displayValues = message.toString().split(',');
	for (var d in displayValues) displayValues[d] = pad(displayValues[d]);
	//console.log("     <<<                                 " + displayValues.join(', '));

	converter.push(message.toString().split(','));
});

converter.emit(function(values) {
	// just for output
	var displayValues = values.join(',').split(',');
	for (var d in displayValues) displayValues[d] = pad(displayValues[d]);
	//console.log(" >>>     " + displayValues.join(', '));
	// just for output end

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
