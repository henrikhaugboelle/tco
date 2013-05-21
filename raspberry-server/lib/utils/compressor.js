// ensure that the module can be used both in node.js
// and browser environment
if (typeof module != 'undefined') {
	var _ = require('underscore');
};

// the compresser converts a number from within one range,
// to be within another range. the method works by calculating
// where the value is within the real range (percentage vise)
// and then transforms to be in the same position within
// the compress range (from the calculated percentage)

// an example:
// the real range is: 0-255, the value is 150
// the compres range: 100-255, the value is now 191.176

var Compressor = function() {
	Compressor.prototype.constructor.apply(this, arguments);
};

// constructor sets the options
Compressor.prototype.constructor = function(options) {
	this.real_min = options.real_min;
	this.real_max = options.real_max - options.real_min;

	this.comp_min = options.comp_min;
	this.comp_max = options.comp_max - options.comp_min;
};

// compresses the input as described in the class
// description. works on both single numbers and
// arrays of numbers
Compressor.prototype.compress = function(value) {
	if (_.isArray(value)) {
		for (var i in value) {
			value[i] = this.compress(value[i]);
		}
	} else {
		var percent = (value - this.real_min) / this.real_max;
		value = this.comp_max * percent + this.comp_min;
	}

	return value;
};

// ensure that the module can be used both in node.js
// and browser environment
if (typeof module != 'undefined' && module.exports) module.exports = Compressor;