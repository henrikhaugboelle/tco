console.log("raspberry-server");

var Server = require('./server'),
	communication = require('./dgramlocal'),
	communication = require('dgram');

var server = new Server(communication);

server.listenForHeartbeat();
server.startHeartbeat();