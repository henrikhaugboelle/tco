
var Dgram = function() {
	Dgram.prototype.constructor.apply(this, arguments);
};

Dgram.prototype.constructor = function(options) {
	this.network = options.network;
	this.ip = options.ip;

	this.broadcast = false;
	this.port = null;
	this.address = '0.0.0.0';

	this.callbacks = {}
};

// bind to port and address
Dgram.prototype.bind = function(port, address) {
	// port and address to listen for connections to
	this.port = port;
	this.address = address;

	this.network.add(this);

	for (var x in this.callbacks.listening || []) {
		this.callbacks.listening[x].call(this);
	}
};

Dgram.prototype.close = function() {
	this.network.remove(this);

	this.callbacks.length = 0;
};

// packages must be send to broadcast address
Dgram.prototype.setBroadcast = function(broadcast) {
	this.broadcast = !!broadcast;
};

Dgram.prototype.on = function(event, callback) {
	(this.callbacks[event] || (this.callbacks[event] = [])).push(callback);
};

Dgram.prototype.send = function(buffer, offset, length, port, address, callback) {
	var msg = buffer.toString().substr(offset, length);

	for (var x in this.network.sockets) {
		var socket = this.network.sockets[x];

		if (socket.port === port) {
			if (socket.ip === address || this.broadcast === true && this.address === '0.0.0.0') {
				for (var m in socket.callbacks.message || []) {
					socket.callbacks.message[m].call(this, msg, { address: this.ip });
				}
			}
		}
	}

	if (callback) callback.call(this);
};

///

var DgramWrapper = function() {
	DgramWrapper.prototype.constructor.apply(this, arguments);
};

DgramWrapper.prototype.constructor = function(options) {
	this.network = options.network;
	this.ip = options.ip;
};

DgramWrapper.prototype.createSocket = function(type) {
	return new Dgram({
		network: this.network,
		ip: this.ip
	});
};

///

var Network = function() {
	Network.prototype.constructor.apply(this, arguments);
};

Network.prototype.constructor = function() {
	this.sockets = [];
};

Network.prototype.add = function(socket) {
	this.sockets.push(socket);
};

Network.prototype.remove = function(socket) {
	for (var x in this.sockets) {
		if (socket.ip === this.sockets[x].ip) {
			this.sockets.splice(x, 1);
		}
	}
};

Network.prototype.count = function() {
	return this.sockets.length;
};

///

var Dependencies = function() {
	Dependencies.prototype.constructor.apply(this, arguments);
};

Dependencies.prototype.constructor = function() {
	this.network = new Network();
	this.dgram = function(ip) {
		return new DgramWrapper({ network: this.network, ip: ip });
	}
};

module.exports = {
	Dependencies: Dependencies
};