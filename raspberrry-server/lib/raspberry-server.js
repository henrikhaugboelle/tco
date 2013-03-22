console.log("raspberry-server");

var Server = require('./server'),
	communication = require('./dgramlocal'),
	communication = require('dgram');

var server = new Server(communication);

server.listen();

var threshold = 10;
var received = [];

server.on('clientMessage', function(message, remote) {
	console.log("message from client: " + remote.address + ":" + remote.port + " = " + message);
	
	received.push(message);

	if (received.length === threshold) {
		var sum = 0;
		while (received.length > 0) {
			sum += parseInt(received.pop(), 10);
		}

		server.sendMessageToClients(sum);
	}
});

server.on('serverMessage', function(message, remote) {
	console.log(">> message from server: " + remote.address + ":" + remote.port + " = " + message);
});

server.on('promoted', function() {
	console.log("I am server now (" + server.ip + ")");
});

server.on('demoted', function() {
	console.log("I am not server anymore (" + server.ip + ")");
});

server.on('added', function(ip) {
	console.log("A server was added (" + ip + ")");
});

server.on('removed', function(ip) {
	console.log("A server was removed (" + ip + ")");
});

setInterval(function() {
	var number = Math.floor(Math.random()*11);
	server.sendMessageToServer(number);
}, 1000);