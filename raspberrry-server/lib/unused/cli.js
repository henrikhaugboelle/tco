process.stdin.resume();
process.stdin.setEncoding("utf8");

var Cli = function() {
	this.callbacks = {
		arguments: [],
		input: []
	};
};

Cli.prototype.start = function(message) {
	var self = this;

	var rawArgs = Array.prototype.slice.call(process.argv, 2);
	var objArgs = {};

	for (var x in rawArgs) {
		if (rawArgs[x].indexOf("--") === 0) {
			var key = rawArgs[x].replace('--', '');
			var next = parseInt(x)+1;

			if (next < rawArgs.length && rawArgs[next].indexOf("--") !== 0) {
				objArgs[key] = rawArgs[next];
			} else {
				objArgs[key] = null;
			}
		}
	}

	console.log(message || "Cli started");

	for (var x in self.callbacks.arguments) {
		var callback = self.callbacks.arguments[x];
		callback.call(self, objArgs);
	}

	process.stdin.on('data', function(data) {
		for (var x in self.callbacks.input) {
			var callback = self.callbacks.input[x];
			var text = data.replace(/\n/g, '');

			callback.call(self, text);
		}
	});
};

Cli.prototype.on = function(namespace, callback) {
	if (this.callbacks[namespace]) {
		this.callbacks[namespace].push(callback);
	}
};

Cli.prototype.log = Cli.prototype.write = function(message) {
	console.log(message);
};

Cli.prototype.stop = function(message) {
	console.log(message || "Cli stopped");

	process.exit();
};

module.exports = new Cli();