// require the os and dgram libraries
var os = require('os'),
	dgram = require('dgram');

// utility function to convert a ip to a number 
// that we can do comparisons on
var ipToInt = function(ip) {
	var d = ip.split('.');

	return ((((((+d[0])*256)+(+d[1]))*256)+(+d[2]))*256)+(+d[3]);
};

// constructor of the network class. takes a object
// of options as parameter. 
var NetworkNode = function NetworkNode(options) {
	var self = this;


	// configure options and class variables
	options = options || {};

	this.dgram = options.dgram || dgram;

	this.HEARTBEAT_ADDRESS = options.heartbeat_address || '255.255.255.255';
	this.HEARTBEAT_PORT = options.heartbeat_port || 40000;
	this.HEARTBEAT_INTERVAL = options.heartbeat_interval || 50;
	this.HEARTBEAT_TIMEOUT_INTERVAL = options.heartbeat_timeout_interval || 200;

	this.SERVER_PORT = options.server_port || 41000;

	this.CLIENT_ADDRESS = options.client_address || '255.255.255.255';
	this.CLIENT_PORT = options.client_port || 42000;

	this.interval_check = null;
	this.interval_emit = null;

	this.callbacks = {};

	this.nodes = {};

	this.tick = 0;

	this.ip = null;

	this.server = null;
	this.local = null;

	// initialize sockets
	this.heartbeat_socket = this.dgram.createSocket('udp4');
	this.heartbeat_socket.bind(this.HEARTBEAT_PORT, '0.0.0.0');

	this.server_socket = this.dgram.createSocket('udp4');
	this.server_socket.bind(this.SERVER_PORT, '0.0.0.0');

	this.client_socket = this.dgram.createSocket('udp4');
	this.client_socket.bind(this.CLIENT_PORT, '0.0.0.0');

	// mac hack to make broadcasting work on mac.
	// an exception is thrown on linux platforms.
	try {
		this.heartbeat_socket.setBroadcast(true);
		this.client_socket.setBroadcast(true);
	} catch (e) { }

	// set the broadcast option, when sockets are initialized
	this.heartbeat_socket.on('listening', function() {
		self.heartbeat_socket.setBroadcast(true);
	});

	this.client_socket.on('listening', function() {
		self.client_socket.setBroadcast(true);
	});

	// if the options did not contain an ip, inspect
	// the os internet interfaces, to obtain the ip
	// given to the machine
	if (!options.ip) {
		// get own ip
		var interfaces = os.networkInterfaces();
		var addrs = [];

		for (var x in interfaces) {
			for (var i in interfaces[x]) {
				var address = interfaces[x][i];

				if (address.family == 'IPv4' && !address.internal) {
					addrs.push(address.address)
				}
			}
		}

		this.local = this.ip = addrs[0];
	} else {
		this.local = this.ip = options.ip;
	}
};

// utility function used for debugging.
// prints all the units that this current unit knows of.
NetworkNode.prototype.print = function() {
	for (var address in this.nodes) {
		if (this.server === address) {
			console.log(address + " <--");
		} else {
			console.log(address);
		}
	}

	console.log("");
};

// initialize listening for heartbeat, server, and client
// also initialize the units own heartbeat
NetworkNode.prototype.listen = function() {
	this.listenOnHeartbeat();
	this.listenOnServer();
	this.listenOnClient();

	this.startHeartbeat();
};

// remove the intervals and close the socket connections
NetworkNode.prototype.close = function() {
	clearInterval(this.interval_check);
	clearInterval(this.interval_emit);

	this.heartbeat_socket.close();
	this.server_socket.close();
	this.client_socket.close();
};

// listen for heartbeats from other units remove the units 
// form the unitlist, if they are not heartbeating anymore
NetworkNode.prototype.listenOnHeartbeat = function() {
	var self = this;

	// when a heartbeat is received, check if we 
	// know it already, if not, add it to the list,
	// emit the "added" event and start an election. 
	// increase the tick for the unit either way
	self.heartbeat_socket.on('message', function(message, remote) {
		if (self.nodes[remote.address] === undefined) {
			self.nodes[remote.address] = self.tick;

			for (var x in (self.callbacks['added'] || [])) {
				self.callbacks['added'][x].call(self, remote.address);
			}

			self.chooseServer();
		} else {
			self.nodes[remote.address] = self.tick;
		}
	});

	// in an interval, check if the units still exists.
	// if a unit does not exist anymore, remove it 
	// from the unitlist and emit the "removed" event.
	// if the removed unit was server, start an election.
	self.interval_check = setInterval(function() {
		for (var address in self.nodes) {
			if (self.nodes[address] < self.tick) {
				delete self.nodes[address];

				for (var x in (self.callbacks['removed'] || [])) {
					self.callbacks['removed'][x].call(self, address);
				}

				if (address === self.server) {
					self.chooseServer();
				}
			}
		}

		self.tick++;
	}, self.HEARTBEAT_TIMEOUT_INTERVAL);
};

// listen for messages from clients (only receives 
// messages if the unit is server)
NetworkNode.prototype.listenOnClient = function() {
	var self = this;

	self.server_socket.on('message', function(message, remote) {
		for (var x in (self.callbacks['clientMessage'] || [])) {
			self.callbacks['clientMessage'][x].call(self, message, remote);
		}
	});
};

// listen for messages from the server
NetworkNode.prototype.listenOnServer = function() {
	var self = this;

	self.client_socket.on('message', function(message, remote) {
		for (var x in (self.callbacks['serverMessage'] || [])) {
			self.callbacks['serverMessage'][x].call(self, message, remote);
		}
	});
};

// start the units heartbeating
NetworkNode.prototype.startHeartbeat = function() {
	var self = this;

	// emit heartbeats
	self.interval_emit = setInterval(function() {
		var buf = new Buffer("heartbeat");
		self.heartbeat_socket.send(buf, 0, buf.length, self.HEARTBEAT_PORT, self.HEARTBEAT_ADDRESS, function(err) {
			if (err) console.log(err);
		});
	}, self.HEARTBEAT_INTERVAL);
};

// check if this unit is server
NetworkNode.prototype.isServer = function() {
	return this.local === this.server;
};

// server election. runs through all the units
// in the unitlist and elects the one with the
// highest ip. also emits the promoted and 
// demoted events when necessary.
NetworkNode.prototype.chooseServer = function() {
	var self = this,
		max = 0,
		addr = null,
		oldIsServer = this.isServer();

	for (var address in self.nodes) {
		var ip = ipToInt(address);

		if (ip > max) {
			max = ip;
			addr = address;
		}
	}

	this.server = addr;

	// if this unit was not server before, but is now, then
	// emit the "promoted" event
	if (oldIsServer === false && this.isServer()) {
		for (var x in (self.callbacks['promoted'] || [])) {
			self.callbacks['promoted'][x].call(self);
		}
	// if this unit was server before, but is not now, then
	// emit the "demoted" event
	} else if (oldIsServer === true && !this.isServer()) {
		for (var x in (self.callbacks['demoted'] || [])) {
			self.callbacks['demoted'][x].call(self);
		}
	}
};

// method to send a message to the current server
NetworkNode.prototype.sendMessageToServer = function(message) {
	var buf = Buffer(message + "");
	this.server_socket.send(buf, 0, buf.length, this.SERVER_PORT, this.server, function(err) {
		if (err) console.log(err);
	});
};

// method to send a message to all clients
NetworkNode.prototype.sendMessageToClients = function(message) {
	var buf = Buffer(message + "");
	this.client_socket.send(buf, 0, buf.length, this.CLIENT_PORT, this.CLIENT_ADDRESS, function(err) {
		if (err) console.log(err);
	});
};

// generic method for registering callbacks for 
// the range of events emitted in the class.
NetworkNode.prototype.on = function(namespace, callback) {
	if (!this.callbacks[namespace]) {
		this.callbacks[namespace] = [];
	}

	this.callbacks[namespace].push(callback);
};

// export the module
module.exports = NetworkNode;
