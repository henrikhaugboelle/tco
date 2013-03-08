var dgram = require('dgram');
var socket = dgram.createSocket('udp4');
 
var testMessage = "[hello world] pid: " + process.pid + " nounce: ";
var broadcastAddress = '255.255.0.0';
var broadcastPort = 41234;
 
socket.bind(broadcastPort, '0.0.0.0');
socket.setBroadcast(true);

var x = 0;
setInterval(function () {
	x++;
	var msg = testMessage + x;
	socket.send(new Buffer(msg), 
			0, 
			msg.length, 
			broadcastPort, 
			broadcastAddress, 
			function (err) {
				if (err) console.log(err);
				
				console.log("Message sent " + x);
			}
	);
}, 1000);