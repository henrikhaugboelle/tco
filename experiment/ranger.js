
var Ranger = function() {
	Ranger.prototype.constructor.apply(this, arguments);
};

Ranger.prototype.constructor = function(options) {
	this.min = options.min;
	this.max = options.max;
};

Ranger.prototype.range = function(value) {
	if (value < this.min) {
		return this.min;
	} else if (value > this.max) {
		return this.max;
	} else {
		return value;
	}
};
