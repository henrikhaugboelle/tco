var dgram = require('dgram');
var socket = dgram.createSocket('udp4');
 
var testMessage = "[hello world] pid: " + process.pid;
var broadcastAddress = '255.255.255.255';
var broadcastPort = 41234;
 
socket.bind(broadcastPort, '0.0.0.0');
socket.setBroadcast(true);
setInterval(function () {
	socket.send(new Buffer(testMessage), 
			0, 
			testMessage.length, 
			broadcastPort, 
			broadcastAddress, 
			function (err) {
				if (err) console.log(err);
				
				console.log("Message sent");
			}
	);
}, 1000);