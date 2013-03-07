var news = [
   "Borussia Dortmund wins German championship",
   "Tornado warning for the Bay Area",
   "More rain for the weekend",
   "Android tablets take over the world",
   "iPad2 sold out",
   "Nation's rappers down to last two samples"
];

var dgram = require('dgram'); 
var server = dgram.createSocket("udp4"); 
server.bind();
server.setBroadcast(true)
server.setMulticastTTL(128);
// server.addMembership('230.185.192.108'); 
server.addMembership('10.25.229.227'); 

setInterval(broadcastNew, 3000);

function broadcastNew() {
    var message = new Buffer(news[Math.floor(Math.random()*news.length)]);
    server.send(message, 0, message.length, 8088, "230.185.192.108");
    console.log("Sent " + message + " to the wire...");
    //server.close();
}

// var PORT = 33333;
// // var HOST = '127.0.0.1';
// // HOST = '192.168.49.216';

// var dgram = require('dgram');
// var server = dgram.createSocket('udp4');

// server.on('listening', function () {
//     var address = server.address();
//     console.log('UDP Server listening on ' + address.address + ":" + address.port);
//     server.setBroadcast(true);
// 	server.setMulticastTTL(128);
// });

// server.on('message', function (message, remote) {
//     console.log(remote.address + ':' + remote.port +' - ' + message);

// });

// server.bind(PORT);