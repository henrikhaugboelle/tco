// require the serialport library
var SerialPort = require('serialport').SerialPort;

// global variables for our special characters
var ESCAPE = 125,
	BOUNDARY = 126,
	ESCAPEINV = 93,
	BOUNDARYINV = 94;

// constructor for the serial class
// notice that the class initializes
// the serial connection
var Serial = function Serial() {
	var self = this;

	// variable used to prevent premature write
	// if the conncetion is not initialized, we
	// whould not write to it
	this.ready = false;

	// variable to store the callbacks for incoming
	// messages
	this.callbacks = {};

	// options for the serialport library
	this.path = '/dev/ttyAMA0';
	this.baudrate = 9600;
	this.dataBits = 8;
	this.parity = 'none';
	this.stopBits = 1;
	this.flowControl = false;

	// initializing the serialport library
	this.serial = new SerialPort(this.path, {
		baudrate: self.baudrate,
		dataBits: self.dataBits,
		parity: self.parity,
		stopBits: self.stopBits,
		flowControl: self.flowControl
	});

	// listen for the "connection open" event,
	// when emitted, set our ready variable to true
	this.serial.on('open', function() {
		self.ready = true;
	});

	// options for the incoming buffer
	// used when framming messages
	this.bufferSize = 255;
	this.index = 0;
	this.nextEscaped = false;

	// initialize our buffer
	this.buffer = new Buffer(this.bufferSize);
};

// initializes listening on the serial connection
Serial.prototype.listen = function() {
	var self = this;

	// wait until the connection is open to listen
	this.serial.on('open', function() {
		// callback for every chunk of data we receive
		self.serial.on('data', function(chunk) {
			var length = chunk.length,
				i = 0;

			// run through each piece of data, determine which kind 
			// of character it, and put it into the buffer. if the
			// characeter is a boundary character, emit the "message"
			// callbacks and "reset the buffer".
			while(i < length) {
				var input = chunk.readUInt8(i++);

				if (self.nextEscaped) {
					if (input === ESCAPEINV) {
						self.buffer[self.index++] = ESCAPE;
					} else if (input === BOUNDARYINV) {
						self.buffer[self.index++] = BOUNDARY;
					}

					self.nextEscaped = false;
				} else if (input === ESCAPE) {
					self.nextEscaped = true;
				} else if (input == BOUNDARY) {
					var tempBuffer = new Buffer(self.index);
					self.buffer.copy(tempBuffer, 0, 0, self.index);
					self.index = 0;

					var values = [];

					for (var x = 0; x < tempBuffer.length; x++) {
						values.push(tempBuffer.readUInt8(x));
					}					

					for (var x in (self.callbacks['message'] || [])) {
						self.callbacks['message'][x].call(self, values);
					}
				} else {
					self.buffer[self.index++] = input;
				}
			}
		});
	});
};

// write a message to the serial connection
Serial.prototype.write = function(values) {
	var self = this;

	// only write to the connection if it is open
	if (this.ready) {

		// write each character in the message. writes
		// escape characters when necessary
		while (values.length > 0) {
			var character = values.shift();

			if (character == ESCAPE) {
				this.serial.write(new Buffer(String.fromCharCode(ESCAPE), 'ascii'), function(err, results) {
					if (err) console.log(err);
				});
				this.serial.write(new Buffer(String.fromCharCode(ESCAPEINV), 'ascii'), function(err, results) {
					if (err) console.log(err);
				});
			} else if (character == BOUNDARY) {
				this.serial.write(new Buffer(String.fromCharCode(ESCAPE), 'ascii'), function(err, results) {
					if (err) console.log(err);
				});
				this.serial.write(new Buffer(String.fromCharCode(BOUNDARYINV), 'ascii'), function(err, results) {
					if (err) console.log(err);
				});
			} else {
				this.serial.write(new Buffer(String.fromCharCode(character), 'ascii'), function(err, results) {
					if (err) console.log(err);
				});
			}
		}

		// write the boundary character to the connection,
		// so that the IO-unit knows the message is complete
		this.serial.write(new Buffer(String.fromCharCode(BOUNDARY), 'ascii'), function(err, results) {
			if (err) console.log(err);
		});
	}
};

// register callbacks for the events emitted in the class
// the method is generic, and every namespace for callbacks
// can be used. but only the "message" event is emitted.
Serial.prototype.on = function(namespace, callback) {
	if (!this.callbacks[namespace]) {
		this.callbacks[namespace] = [];
	}

	this.callbacks[namespace].push(callback);
};

// export the module
module.exports = Serial;
