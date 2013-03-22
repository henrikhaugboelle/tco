console.log("raspberry-server");

var Server = require('./server'),
	communication = require('./dgramlocal'),
	communication = require('dgram');

var server = new Server(communication);

server.listenForHeartbeat();
server.listenForRawSignal();
server.listenForProcessedSignal();

server.startHeartbeat();

var threshold = 10;
var received = [];

server.onRawSignal(function(message, remote) {
	console.log("raw signal: " + remote.address + ":" + remote.port + " = " + message);
	
	received.push(message);
	
	if (received.length === threshold) {
		var sum = 0;
		while (received.length > 0) {
			sum += parseInt(received.pop(), 10);
		}

		server.sendProcessedSignal(sum);
	}
});

server.onProcessedSignal(function(message, remote) {
	console.log("processed signal: " + remote.address + ":" + remote.port + " = " + message);
});

setInterval(function() {
	var number = Math.floor(Math.random()*11);
	server.sendRawSignal(number);
}, 1000);