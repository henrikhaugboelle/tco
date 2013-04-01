console.log("raspberry-server");

var NetworkNode = require('./networknode'),
	Serial = require('./serial');

var serial = new Serial();

serial.listen();

serial.on('message', function(values) {
	console.log(values);
});

//var interval = setInterval(function() {
//	console.log("sending 1 and 2");
//	serial.write([49, 50]);
//}, 1000);

var nn = new NetworkNode();

nn.listen();

var threshold = 10;
var received = [];

serial.on('message', function(values) {
	nn.sendMessageToServer(values.join(","));
});

nn.on('clientMessage', function(message, remote) {
	console.log("message from client: " + remote.address + ":" + remote.port + " = " + message);
	
nn.sendMessageToClients(message);
	//received.push(message);

	//if (received.length === threshold) {
	//	var sum = 0;
	//	while (received.length > 0) {
	//		sum += parseInt(received.pop(), 10);
	//	}

	//	nn.sendMessageToClients(sum);
	//}
});

nn.on('serverMessage', function(message, remote) {
	console.log(">> message from server: " + remote.address + ":" + remote.port + " = " + message);
	serial.write((message+"").split(','));
});

nn.on('promoted', function() {
	console.log("I am server now (" + nn.ip + ")");
});

nn.on('demoted', function() {
	console.log("I am not server anymore (" + nn.ip + ")");
});

nn.on('added', function(ip) {
	console.log("A server was added (" + ip + ")");
});

nn.on('removed', function(ip) {
	console.log("A server was removed (" + ip + ")");
});

//setInterval(function() {
//	var number = Math.floor(Math.random()*11);
//	nn.sendMessageToServer(number);
//}, 1000);

setInterval(function() {
	console.log("...");
	nn.sendMessageToClients("50");
}, 1000);
