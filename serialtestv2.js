var sys = require('sys'),
repl = require('repl'),
serialPort = require('serialport').SerialPort;
var stdin = process.openStdin();


var serial = new serialPort('/dev/ttyAMA0', {baudrate : 9600, dataBits : 8,
parity : 'none',
stopBits : 1,
flowControl : false
});

var callback = function(message){
	console.log(message);
	console.log(message.toString());
};
var bufferSize = 255;
var buffer = new Buffer(bufferSize);
var index = 0;
var nextEscaped = false;
var ESCAPE = 125;
var BOUNDARY = 126;
var ESCAPEINV = 93;
var BOUNDARYINV = 94;
serial.on('data', function(chuck){
	var length = chuck.length;
	var i = 0;
	while(i<length){

		var input = chuck.readUInt8(i++);

		if(nextEscaped){
			if(input == ESCAPEINV){
				buffer[index++] = ESCAPE;
			}else if(input == BOUNDARYINV){
				buffer[index++] = BOUNDARY;
			}
			// could be that input is not 93 or 94, which is an error
			nextEscaped = false;
		}
		else if(input == ESCAPE){
			nextEscaped = true;
		}
		else if(input == BOUNDARY){
			var tempBuffer = new Buffer(index);
			buffer.copy(tempBuffer, 0, 0, index);
			callback.call(this, tempBuffer);
			index = 0;
		}else{
			buffer[index++]=input;
		}
	}
//	console.log(chuck.length);
//	sys.puts(chuck);
});

stdin.on('data', function(chunk){
	serial.write(chunk);
});

// void writeSerial(QueueList <int> message){
//   while (!message.isEmpty ()){
//     int character = message.pop();
//     if(character == ESCAPE){
//       Serial.write(ESCAPE);
//       Serial.write(ESCAPEINV);
//     }
//     else if(character == BOUNDARY){
//       Serial.write(ESCAPE);
//       Serial.write(BOUNDARYINV);
//     }
//     else{
//       Serial.write(character);
//     }
//   }
//   Serial.write(BOUNDARY);
// }


repl.start("=>");

