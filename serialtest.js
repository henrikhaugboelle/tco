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
var bufferSize = 10;
var buffer = new Buffer(bufferSize);
var index = 0;
var nextEscaped = false;
serial.on('data', function(chuck){
	var length = chuck.length;
	var i = 0;
	if(nextEscaped){
		nextEscaped = false;
		var escaped = chuck.readUInt8(i++);
		if(escaped == 93){
			buffer[index++] = 125;
		}else if(escaped == 94){
			buffer[index++] = 126;
		}
	}
	while(i<length){

		var input = chuck.readUInt8(i++);
	
		if(input==126){
			var tempBuffer = new Buffer(index);
			buffer.copy(tempBuffer, 0, 0, index);
			callback.call(this, tempBuffer);
			index = 0;
		}else if(input==125){
			if(i == length){
				nextEscaped = true;
			}else{
				var escaped = chuck.readUInt8(i++);
				if(escaped == 93){
					buffer[index]=125;
				}else if(escaped == 94){
					buffer[index]=126;
				}
				index++;
			}						
		}else{
			buffer[index]=input;
			index++;
		}
		
		
			
	}
//	console.log(chuck.length);
//	sys.puts(chuck);
});

stdin.on('data', function(chunk){
	serial.write(chunk);
});


repl.start("=>");

