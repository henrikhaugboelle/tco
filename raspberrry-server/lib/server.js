var ipToInt = function(ip) {
	var d = ip.split('.');

	return ((((((+d[0])*256)+(+d[1]))*256)+(+d[2]))*256)+(+d[3]);
};

var Server = function Server(dgram) {
	var self = this;

	this.dgram = dgram;

	this.HEARTBEAT_ADDRESS = '255.255.255.255';
	this.HEARTBEAT_PORT = 41234;
	this.HEARTBEAT_INTERVAL = 50;
	this.TIMEOUT_INTERVAL = 200;

	this.nodes = {};

	this.tick = 0;

	this.isServer = false;
	this.server = null;

	this.heartbeat_socket = this.dgram.createSocket('udp4');
	this.heartbeat_socket.bind(this.HEARTBEAT_PORT, '0.0.0.0');

	// mac hack
	try {
		this.heartbeat_socket.setBroadcast(true)
	} catch (e) { }

	this.heartbeat_socket.on('listening', function() {
		self.heartbeat_socket.setBroadcast(true);
	});
};

Server.prototype.print = function() {
	for (var address in this.nodes) {
		if (this.server === address) {
			console.log(address + " <--");
		} else {
			console.log(address);
		}
	}
};

Server.prototype.listenForHeartbeat = function() {
	var self = this;

	// listen for heartbeats
	self.heartbeat_socket.on('message', function(message, remote) {
		if (self.nodes[remote.address] === undefined) {
			// console.log("node joined: "  + remote.address);

			self.nodes[remote.address] = self.tick;
			self.chooseServer();
		} else {
			self.nodes[remote.address] = self.tick;
		}
	});

	// check if servers still exists
	setInterval(function() {
		for (var address in self.nodes) {
			if (self.nodes[address] < self.tick) {
				// console.log("node removed: " + address);

				delete self.nodes[address];

				self.chooseServer();
			}
		}

		self.tick++;
	}, self.TIMEOUT_INTERVAL);
};

Server.prototype.chooseServer = function() {
	var self = this;
	var max = 0,
		addr = null;

	for (var address in self.nodes) {
		var ip = ipToInt(address);

		if (ip > max) {
			max = ip;
			addr = address;
		}
	}

	this.server = addr;

	this.print();
};

Server.prototype.startHeartbeat = function() {
	var self = this;

	// emit heartbeats
	setInterval(function() {
		var buf = new Buffer("heartbeat");
		self.heartbeat_socket.send(buf, 0, buf.length, self.HEARTBEAT_PORT, self.HEARTBEAT_ADDRESS, function(err) {
			if (err) console.log(err);
		});
	}, self.HEARTBEAT_INTERVAL);
};

module.exports = Server;