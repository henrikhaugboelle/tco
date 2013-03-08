var PORT = 8088;
var HOST = '192.168.0.102';
var dgram = require('dgram');
var client = dgram.createSocket('udp4');

client.on('listening', function () {
    var address = client.address();
    console.log('UDP Client listening on ' + address.address + ":" + address.port);
    client.setBroadcast(true)
    client.setMulticastTTL(128); 
    client.addMembership('230.185.192.108');
});

client.on('message', function (message, remote) {   
    console.log('A: Epic Command Received. Preparing Relay.');
    console.log('B: From: ' + remote.address + ':' + remote.port +' - ' + message);
});

client.bind(PORT, HOST);

// var PORT = 33333;
// var HOST = '127.0.0.1';
// HOST = '10.25.229.223';

// var dgram = require('dgram');
// var message = new Buffer('My KungFu is Good!');

// var client = dgram.createSocket('udp4');
// client.bind();
// client.setBroadcast(true);
// client.setMulticastTTL(128);
// // client.addMembership(HOST);

// client.send(message, 0, message.length, PORT, HOST, function(err, bytes) {
//     if (err) throw err;
//     console.log('UDP message sent to ' + HOST +':'+ PORT);
//     client.close();
// });