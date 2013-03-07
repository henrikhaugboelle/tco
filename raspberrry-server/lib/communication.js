var _ = require('underscore'),
	cli = require('./cli'),
	dgram = require('dgram');

var server;
var client;

var args;

var defaults = {
	server_ip: '127.0.0.1', // 10.25.229.223
	client_ip: '127.0.0.1',
	client_port: 3000,
	type: 'udp4'
};

var actions = {
	bind: function() {
		
	},
	message: function(msg) {
		console.log("send a message: " + msg);

		var message = new Buffer(msg);
		server.send(message, 0, message.length, 3000, "192.168.0.10", function(err, bytes) {
			if (err) console.log(err);
		});
	}
};

cli.on('arguments', function(_args) {
	args = _.defaults(_args, defaults);

	// console.log(args);

	server = dgram.createSocket(args.type);
	server.bind();
	server.setBroadcast(true);
	server.setMulticastTTL(128);
	server.addMembership("192.168.0.10");

	// server.on('message', function(msg, rinfo) {
	// 	console.log("socket message");
	// 	console.log(arguments);
	// 	console.log(msg.toString());
	// });

	server.on('listening', function() {
		console.log("server start listening on " + server.address().address + ":" + server.address().port);
	});

	server.on('close', function() {
		console.log("server stop listening on " + server.address().address + ":" + server.address().port);
	});

	server.on('error', function(err) {
		console.log("server error");
	});

	// client = dgram.createSocket(args.type);
	// // client.bind(args.port, args.server_ip);
	// // client.bind(args.port, args.client_ip);
	// // client.bind(args.port);
	// client.setBroadcast(true);
	// client.setMulticastTTL(128);
	// // client.addMembership('127.0.0.1', '127.0.0.1');

	// client.on('message', function(msg, rinfo) {
	// 	console.log("client message");
	// 	console.log(arguments);
	// 	console.log(msg.toString());
	// });

	// client.on('listening', function() {
	// 	console.log("client start listening on " + client.address().address + ":" + client.address().port);
	// });

	// client.on('close', function() {
	// 	console.log("client stop listening on " + client.address().address + ":" + client.address().port);
	// });

	// client.on('error', function(err) {
	// 	console.log("client error");
	// });
});

cli.on('input', function(input) {
	// cli.log("input: " + input);

	if (input == 'close' || input == 'quit' || input == 'exit' || input == 'stop') {
		cli.stop();
	}

	var parts = input.split(':');

	if (parts.length > 1) {
		var action = parts[0];
		var arg = parts.slice(1).join(':');

		if (actions[action]) {
			actions[action].call(actions[action], arg);
		} else {
			console.log("action is not implemented: " + action);
		}
	}
});

cli.start();

