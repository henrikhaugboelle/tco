console.log("raspberry-server");

var NetworkNode = require('./lib/networknode'),
	nn = new NetworkNode();

nn.listen();

// from client to server and server calculations to clients
// nn.on('clientMessage', function(message, remote) {
// 	converter.push(message.toString().split(','));
// });

// converter.emit(function(values) {
// 	nn.sendMessageToClients(values.join(','));
// });

// // serial to server and server to serial
// serial.on('message', function(values) {
// 	nn.sendMessageToServer(values.join(","));
// });

// nn.on('serverMessage', function(message, remote) {
// 	serial.write((message+"").split(','));
// });

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
