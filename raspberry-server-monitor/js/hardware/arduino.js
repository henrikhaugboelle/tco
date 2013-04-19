var Arduino = function() {
	Arduino.prototype.constructor.apply(this, arguments);
};

Arduino.prototype.constructor = function(options) {
	options = options || {};

	this.speed = options.speed || 50;
	this.sensors = options.sensors || {};

	this.interval = null;
	this.callbacks = [];

	this.last_values = [0, 0, 0];
};

Arduino.prototype.addSensor = function(key, sensor) {
	this.sensors[key] = sensor;
};

Arduino.prototype.setSpeed = function(speed) {
	this.speed = speed;
};

Arduino.prototype.emit = function(callback) {
	this.callbacks.push(callback);
};

Arduino.prototype.start = function() {
	var self = this;
	this.interval = setInterval(function() {
		// console.log("arduino loop");
		var values = [];
		var raw_values = [];

		for (var key in self.sensors) {
			values = values.concat(self.sensors[key].getValues());
		}

		raw_values = values.join(',').split(',');

		for (var i in self.last_values) {
			values[i] = Math.abs(values[i] - self.last_values[i]);
		}

		for (var index in self.callbacks) {
			self.callbacks[index].call(self, values);
		}

		for (var i in self.last_values) {
			self.last_values[i] = raw_values[i];
		}
	}, this.speed);
};

Arduino.prototype.stop = function() {
	clearInterval(this.interval);
};