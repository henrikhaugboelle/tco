var dgram = require('dgram');
var socket = dgram.createSocket('udp4');
 
var testMessage = "[hello world] pid: " + process.pid;
var broadcastAddress = '255.255.255.255';
var broadcastPort = 41234;
 
socket.bind(broadcastPort);
//socket.setBroadcast(true);
 
socket.on("message", function ( data, rinfo ) {
	console.log("Message received from ", rinfo.address, " : ", data.toString());
});