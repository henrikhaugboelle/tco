
var DgramSocket = function() {
	DgramSocket.prototype.constructor.apply(this, arguments);
};

DgramSocket.prototype.constructor = function() {
	
};

var Dgram = {};

Dgram.createSocket = function(type) {
	return new DgramSocket({
		type: type
	});
};

module.exports = Dgram;