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

	console.log(values);

	if (this.ready) {
		while (values.length > 0) {
			var character = values.shift();

			if (character == ESCAPE) {
				console.log("escape");
				this.serial.write(String.fromCharCode(ESCAPE), function(err, results) {
					if (err) console.log(err);
				});
				this.serial.write(String.fromCharCode(ESCAPEINV), function(err, results) {
					if (err) console.log(err);
				});
			} else if (character == BOUNDARY) {
				console.log("boundary");
				this.serial.write(String.fromCharCode(ESCAPE), function(err, results) {
					if (err) console.log(err);
				});
				this.serial.write(String.fromCharCode(BOUNDARYINV), function(err, results) {
					if (err) console.log(err);
				});
			} else {
				console.log(String.fromCharCode(character));
				this.serial.write(String.fromCharCode(character), function(err, results) {
					if (err) console.log(err);
				});
			}
		}

		console.log(String.fromCharCode(BOUNDARY));
		this.serial.write(String.fromCharCode(BOUNDARY), function(err, results) {
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

// var sys = require('sys'),
// repl = require('repl'),
// serialPort = require('serialport').SerialPort;
// var stdin = process.openStdin();


// var serial = new serialPort('/dev/ttyAMA0', {baudrate : 9600, dataBits : 8,
// parity : 'none',
// stopBits : 1,
// flowControl : false
// });

// var callback = function(message){
// 	console.log(message);
// 	console.log(message.toString());
// };
// var bufferSize = 255;
// var buffer = new Buffer(bufferSize);
// var index = 0;
// var nextEscaped = false;
// var ESCAPE = 125;
// var BOUNDARY = 126;
// var ESCAPEINV = 93;
// var BOUNDARYINV = 94;
// serial.on('data', function(chuck){
// 	var length = chuck.length;
// 	var i = 0;
// 	while(i<length){

// 		var input = chuck.readUInt8(i++);

// 		if(nextEscaped){
// 			if(input == ESCAPEINV){
// 				buffer[index++] = ESCAPE;
// 			}else if(input == BOUNDARYINV){
// 				buffer[index++] = BOUNDARY;
// 			}
// 			// could be that input is not 93 or 94, which is an error
// 			nextEscaped = false;
// 		}
// 		else if(input == ESCAPE){
// 			nextEscaped = true;
// 		}
// 		else if(input == BOUNDARY){
// 			var tempBuffer = new Buffer(index);
// 			buffer.copy(tempBuffer, 0, 0, index);
// 			callback.call(this, tempBuffer);
// 			index = 0;
// 		}else{
// 			buffer[index++]=input;
// 		}
// 	}
// //	console.log(chuck.length);
// //	sys.puts(chuck);
// });

// stdin.on('data', function(chunk){
// 	serial.write(chunk);
// });

// // void writeSerial(QueueList <int> message){
// //   while (!message.isEmpty ()){
// //     int character = message.pop();
// //     if(character == ESCAPE){
// //       Serial.write(ESCAPE);
// //       Serial.write(ESCAPEINV);
// //     }
// //     else if(character == BOUNDARY){
// //       Serial.write(ESCAPE);
// //       Serial.write(BOUNDARYINV);
// //     }
// //     else{
// //       Serial.write(character);
// //     }
// //   }
// //   Serial.write(BOUNDARY);
// // }


// repl.start("=>");
