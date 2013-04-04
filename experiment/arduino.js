var Arduino = function() {
	Arduino.prototype.constructor.apply(this, arguments);
};

Arduino.prototype.constructor = function(options) {
	options = options || {};

	this.speed = options.speed || 50;
	this.sensors = options.sensors || {};

	this.interval = null;
	this.callbacks = [];
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
		var values = [];

		for (var key in self.sensors) {
			values = values.concat(self.sensors[key].getValues());
		}

		for (var index in self.callbacks) {
			self.callbacks[index].call(self, values);
		}

	}, this.speed);
};

Arduino.prototype.stop = function() {
	clearInterval(this.interval);
};