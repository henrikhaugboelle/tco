var DgramLocal = function() {

};

DgramLocal.prototype.createSocket = function() {
	console.log("createSocket");
};

DgramLocal.prototype.bind = function() {
	console.log("bind");
};

DgramLocal.prototype.on = function() {
	console.log("on");
};

DgramLocal.prototype.setBroadcast = function() {
	console.log("setBroadcast");
};

DgramLocal.prototype.send = function() {
	console.log("send");
};

var DatagramLocal = {};

DatagramLocal.createSocket = function() {
	return new DgramLocal();
};

module.exports = DatagramLocal;