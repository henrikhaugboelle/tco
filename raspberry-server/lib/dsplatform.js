// require and instantiate networkcommunication,
// serialframming and the relevant signalconverter
var NetworkCommunication = require('./networkcommunication'),
	SerialFramming = require('./serialframming'),
	SignalConverter = require('./converters/signalconverter'),

	converter = new SignalConverter(),
	serial = new SerialFramming(),
	network = new NetworkCommunication();

// initialize the serial and network listeners
serial.listen();
network.listen();

// when a message is received from a client, push
// it to the signalconverter
network.on('clientMessage', function(message, remote) {
	converter.push(message.toString().split(','));
});

// when the signalconverter has finished a calculation,
// this callbacks is executed. sends the result to all
// the clients in the network
converter.emit(function(values) {
	network.sendMessageToClients(values.join(','));
});

// when receiving a message from the IO-unit through
// the xbee, send it to the unit elected server
serial.on('message', function(values) {
	network.sendMessageToServer(values.join(","));
});

// when receiving a message from the server, send
// it to the IO-unit through the xbee serial connection
network.on('serverMessage', function(message, remote) {
	serial.write((message+"").split(','));
});

// start the converter and emit a message, if this
// current unit is elected server
network.on('promoted', function() {
	converter.start();
	console.log("I am server now (" + network.ip + ")");
});

// stop the converter and emit a message, if this 
// current unit is no longer server
network.on('demoted', function() {
	converter.stop();
	console.log("I am not server anymore (" + network.ip + ")");
});

// emit a message when a new unit is added to the network
network.on('added', function(ip) {
	console.log("A unit was added (" + ip + ")");
});

// emit a message when a unit is removed from the network
network.on('removed', function(ip) {
	console.log("A unit was removed (" + ip + ")");
});
