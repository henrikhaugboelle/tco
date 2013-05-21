// ensure that the module can be used both in node.js
// and browser environment
if (typeof module != 'undefined') {
	var _ = require('underscore');
};

// smoother class makes it possible to create
// a fading effect over a range of calculations.

// the class calculates how much the number should
// increase or decrease relatively to the given options.
var Smoother = function() {
	Smoother.prototype.constructor.apply(this, arguments);
};

// takes an object of options as parameter. the options
// includes the minimum and maximum of the range the numbers
// should increase and decrease within, the current value
// of the number and how many times the up and down methods
// must be called to have reached the max and minimum of the
// value respectively.
Smoother.prototype.constructor = function(options) { 
	options = options || {};
	this.min = options.min;
	this.max = options.max;
	this.value = options.value;
	this.step_up = options.step_up;
	this.step_down = options.step_down;
};

// increases the value relatively to the current options and returns it
Smoother.prototype.up = function() {
	this.value += (this.max - this.min) / this.step_up;
	this.value = this.value > this.max ? this.max : this.value;

	return this.value;
};

// decreases the value relatively to the current options and returns it
Smoother.prototype.down = function() {
	this.value -= (this.max - this.min) / this.step_down;
	this.value = this.value < this.min ? this.min : this.value;

	return this.value;
	
};

// ensure that the module can be used both in node.js
// and browser environment
if (typeof module != 'undefined' && module.exports) module.exports = Smoother;