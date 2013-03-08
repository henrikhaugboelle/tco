console.log("raspberry-server");

var dgram = require('dgram'),
	cli = require('./cli');

var nodes = {};
var ticks = {};

var tick = 0;

// var communication = require('./communication');
// var algorithm = require('./algorithm');

var HEARTBEAT_ADDRESS = '255.255.255.255';
var HEARTBEAT_PORT = 41234;
var HEARTBEAT_INTERVAL = 500;
var TIMEOUT_INTERVAL = 2000;

var socket_heartbeat = dgram.createSocket('udp4');

socket_heartbeat.bind(HEARTBEAT_PORT, '0.0.0.0');

// mac hack
try {
	socket_heartbeat.setBroadcast(true)
} catch (e) {

}

socket_heartbeat.on('listening', function() {
	console.log("heartbeat listening start");
	socket_heartbeat.setBroadcast(true);
});

socket_heartbeat.on('message', function(message, remote) {
	console.log("heartbeat from: " + remote.address + ":" + remote.port);

	if (!nodes[remote.address]) {
		nodes[remote.address] = { 
			address: remote.address,
			port: remote.port
		};
	}

	ticks[remote.address] = tick;
});

setInterval(function() {
	console.log("removing dead nodes");

	for (var address in ticks) {
		console.log(address + ": " + ticks[address] + " tick: " + tick);
		if (ticks[address] < tick) {
			delete nodes[address];
			delete ticks[address];
		}
	}

	tick++;

}, TIMEOUT_INTERVAL);

setInterval(function() {
	var buf = new Buffer("heartbeat");
	socket_heartbeat.send(buf, 0, buf.length, HEARTBEAT_PORT, HEARTBEAT_ADDRESS, function(err) {
		if (err) console.log(err);
	});
}, HEARTBEAT_INTERVAL);