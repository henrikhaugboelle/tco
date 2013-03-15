var HEARTBEAT_ADDRESS = '255.255.255.255';
var HEARTBEAT_PORT = 41234;
var HEARTBEAT_INTERVAL = 500;
var TIMEOUT_INTERVAL = 2000;

var Server = function Server(dgram) {
	this.dgram = dgram;

	this.heartbeat_socket = this.dgram.createSocket('udp4');
	this.heartbeat_socket.bind(HEARTBEAT_PORT, '0.0.0.0');

	this.nodes = {};
	this.ticks = {};

	this.tick = 0;
};

Server.prototype.listenForHeartbeat = function() {
	var self = this;

	// mac hack
	try {
		self.heartbeat_socket.setBroadcast(true)
	} catch (e) { }

	self.heartbeat_socket.on('listening', function() {
		self.heartbeat_socket.setBroadcast(true);
	});

	self.heartbeat_socket.on('message', function(message, remote) {
		if (!self.nodes[remote.address]) {
			console.log("node joined: "  + remote.address + ":" + remote.port);
			self.nodes[remote.address] = { 
				address: remote.address,
				port: remote.port
			};
		}

		self.ticks[remote.address] = self.tick;
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
		self.heartbeat_socket.send(buf, 0, buf.length, HEARTBEAT_PORT, HEARTBEAT_ADDRESS, function(err) {
			if (err) console.log(err);
		});
	}, HEARTBEAT_INTERVAL);
};

module.exports = Server;