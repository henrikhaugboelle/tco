var dgram = require('dgram');
var socket = dgram.createSocket('udp4');
 
var testMessage = "[hello world] pid: " + process.pid + " nounce: ";
var broadcastAddress = '255.255.255.255';
var broadcastPort = 41234;
 
socket.bind(broadcastPort, '0.0.0.0');

socket.on('listening', function() {
	socket.setBroadcast(true);
});

socket.on('error', function() {
	console.log("error");
});
socket.on('close', function() {
	console.log("close");
});

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