if (typeof module != 'undefined') {
	var _ = require('underscore');
};

var Smoother = function() {
	Smoother.prototype.constructor.apply(this, arguments);
};

Smoother.prototype.constructor = function(options) { 
	options = options || {};
	this.min = options.min;
	this.max = options.max;
	this.value = options.value;
	this.step_up = options.step_up;
	this.step_down = options.step_down;
};

Smoother.prototype.up = function() {
	this.value += (this.max - this.min) / this.step_up;
	this.value = this.value > this.max ? this.max : this.value;

	return this.value;
};

Smoother.prototype.down = function() {
	this.value -= (this.max - this.min) / this.step_down;
	this.value = this.value < this.min ? this.min : this.value;

	return this.value;
	
};


if (typeof module != 'undefined' && module.exports) module.exports = Smoother;