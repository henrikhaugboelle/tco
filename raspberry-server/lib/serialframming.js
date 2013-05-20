var SerialPort = require('serialport').SerialPort;

var ESCAPE = 125,
	BOUNDARY = 126,
	ESCAPEINV = 93,
	BOUNDARYINV = 94;

var Serial = function Serial() {
	var self = this;

	this.ready = false;

	this.callbacks = {};

	this.path = '/dev/ttyAMA0';
	this.baudrate = 9600;
	this.dataBits = 8;
	this.parity = 'none';
	this.stopBits = 1;
	this.flowControl = false;

	this.serial = new SerialPort(this.path, {
		baudrate: self.baudrate,
		dataBits: self.dataBits,
		parity: self.parity,
		stopBits: self.stopBits,
		flowControl: self.flowControl
	});

	this.serial.on('open', function() {
		self.ready = true;
	});

	this.bufferSize = 255;
	this.index = 0;
	this.nextEscaped = false;

	this.buffer = new Buffer(this.bufferSize);
};

Serial.prototype.listen = function() {
	var self = this;

	this.serial.on('open', function() {
		self.serial.on('data', function(chunk) {
			var length = chunk.length,
				i = 0;

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

Serial.prototype.write = function(values) {
	var self = this;

	if (this.ready) {
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

		this.serial.write(new Buffer(String.fromCharCode(BOUNDARY), 'ascii'), function(err, results) {
			if (err) console.log(err);
		});
	}
};

Serial.prototype.on = function(namespace, callback) {
	if (!this.callbacks[namespace]) {
		this.callbacks[namespace] = [];
	}

	this.callbacks[namespace].push(callback);
};

module.exports = Serial;