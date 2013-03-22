console.log("raspberry-server");

var NetworkNode = require('./networknode');
var nn = new NetworkNode();


nn.listen();

var threshold = 10;
var received = [];

nn.on('clientMessage', function(message, remote) {
	console.log("message from client: " + remote.address + ":" + remote.port + " = " + message);
	
	received.push(message);

	if (received.length === threshold) {
		var sum = 0;
		while (received.length > 0) {
			sum += parseInt(received.pop(), 10);
		}

		nn.sendMessageToClients(sum);
	}
});

nn.on('serverMessage', function(message, remote) {
	console.log(">> message from server: " + remote.address + ":" + remote.port + " = " + message);
});

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

setInterval(function() {
	var number = Math.floor(Math.random()*11);
	nn.sendMessageToServer(number);
}, 1000);