var Sensor = function() {
	Sensor.prototype.constructor.apply(this, arguments);
};

Sensor.prototype.constructor = function(options) {
	options = options || {};

	this.sequence = options.sequence;
	this.repeat = options.repeat || true;
	this.speed = options.speed || 50;

	this.shouldStop = false;
	this.running = false;

	this.ranger = options.ranger;
	this.distortor = options.distortor;
};

Sensor.prototype.setSequence = function(sequence) {
	this.sequence = sequence;
};

Sensor.prototype.setRepeat = function(repeat) {
	this.repeat = repeat;
};

Sensor.prototype.setSpeed = function(speed) {
	this.speed = speed;
};

Sensor.prototype.getValues = function() {
	return this.values;
};

Sensor.prototype.start = function() {
	if (!this.running) {
		this.transition(0);
		this.running = true;
	}
};

Sensor.prototype.stop = function() {
	this.shouldStop = true;
};

Sensor.prototype.transition = function(index) {
	if (this.sequence.length >= (index + 2)) {
		var self = this;
		var present = 0;

		var start = this.sequence[index];
		var end = this.sequence[index+1];
		var time = end.time;
		var ticks = time / self.speed;

		var incs = [];
		var vals = [];

		for (var i = 0; i < end.values.length; i++) {
			incs[i] = (end.values[i] - start.values[i]) / ticks;
			vals[i] = start.values[i];
		}

		this.interval = setInterval(function() {
			// console.log("sensor loop");
			for (var i = 0; i < end.values.length; i++) {
				vals[i] = Math.round(vals[i] + incs[i]);

				if (self.distortor) {
					vals[i] = self.distortor.distort(vals[i]);
				}

				if (self.ranger) {
					vals[i] = self.ranger.range(vals[i]);
				}
			}

			self.values = vals;

			// for (var c in self.callbacks) {
			// 	self.callbacks[c].call(self, vals[0], vals[1], vals[2]);
			// }

			present += self.speed;

			if (present >= time) {
				clearInterval(self.interval);
				self.transition(++index);
			}
		}, self.speed);
	} else {
		if (this.repeat) {
			if (this.shouldStop) {
				this.running = false;
			} else {
				this.transition(0);
			}
		} else {
			this.running = false;
		}

		this.shouldStop = false;
	}
};
