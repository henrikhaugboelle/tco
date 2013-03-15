

var HEARTBEAT_ADDRESS = '255.255.255.255';
var HEARTBEAT_PORT = 41234;
var HEARTBEAT_INTERVAL = 500;
var TIMEOUT_INTERVAL = 2000;

var Server = function Server(dgram) {
	this.dgram = dgram;
	
	this.socket = this.dgram.createSocket('udp4');
	this.socket.bind(HEARTBEAT_PORT, '0.0.0.0');

	this.nodes = {};
	this.ticks = {};

	this.tick = 0;
};

Server.prototype.listenForHeartbeat = function() {
	var self = this;

	// mac hack
	try {
		self.socket.setBroadcast(true)
	} catch (e) { }

	self.socket.on('listening', function() {
		self.socket.setBroadcast(true);
	});

	self.socket.on('message', function(message, remote) {
		if (!self.nodes[remote.address]) {
			console.log("node joined: "  + remote.address + ":" + remote.port);
			self.nodes[remote.address] = { 
				address: remote.address,
				port: remote.port
			};
		}
	});

	setInterval(function() {
		for (var address in self.ticks) {
			if (self.ticks[address] < self.tick) {
				console.log("node removed: " + address);
				delete self.nodes[address];
				delete self.ticks[address];
			}
		}

		self.tick++;
	}, TIMEOUT_INTERVAL);
};

Server.prototype.startHeartbeat = function() {
	var self = this;

	setInterval(function() {
		var buf = new Buffer("heartbeat");
		self.socket.send(buf, 0, buf.length, HEARTBEAT_PORT, HEARTBEAT_ADDRESS, function(err) {
			if (err) console.log(err);
		});
	}, HEARTBEAT_INTERVAL);
};

module.exports = Server;

// console.log("server");

// var dgram = require('dgram'),
// 	cli = require('./cli');

// var nodes = {};
// var ticks = {};

// var tick = 0;

// // var communication = require('./communication');
// // var algorithm = require('./algorithm');

// var HEARTBEAT_ADDRESS = '255.255.255.255';
// var HEARTBEAT_PORT = 41234;
// var HEARTBEAT_INTERVAL = 500;
// var TIMEOUT_INTERVAL = 2000;

// var socket_heartbeat = dgram.createSocket('udp4');

// socket_heartbeat.bind(HEARTBEAT_PORT, '0.0.0.0');

// // mac hack
// try {
// 	socket_heartbeat.setBroadcast(true)
// } catch (e) {

// }

// socket_heartbeat.on('listening', function() {
// 	console.log("heartbeat listening start");
// 	socket_heartbeat.setBroadcast(true);
// });

// socket_heartbeat.on('message', function(message, remote) {
// 	// console.log("heartbeat from: " + remote.address + ":" + remote.port);

// 	if (!nodes[remote.address]) {
// 		console.log("node joined: "  + remote.address + ":" + remote.port);
// 		nodes[remote.address] = { 
// 			address: remote.address,
// 			port: remote.port
// 		};
// 	}

// 	ticks[remote.address] = tick;
// });

// setInterval(function() {
// 	// console.log("removing dead nodes");

// 	for (var address in ticks) {
// 		// console.log(address +: " + ticks[address] + " tick: " + tick);
// 		if (ticks[address] < tick) {
// 			console.log("node removed: " + address);
// 			delete nodes[address];
// 			delete ticks[address];
// 		}
// 	}

// 	tick++;

// }, TIMEOUT_INTERVAL);

// setInterval(function() {
// 	var buf = new Buffer("heartbeat");
// 	socket_heartbeat.send(buf, 0, buf.length, HEARTBEAT_PORT, HEARTBEAT_ADDRESS, function(err) {
// 		if (err) console.log(err);
// 	});
// }, HEARTBEAT_INTERVAL);