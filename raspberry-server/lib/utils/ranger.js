// ensure that the module can be used both in node.js
// and browser environment
if (typeof module != 'undefined') {
	var _ = require('underscore');
};

// makes a number stay in a given range. the range
// which the numbers should stay within, is given
// as options to the constructor.

// example:
// range is 0-255, the input given is 278, it will return 255
var Ranger = function() {
	Ranger.prototype.constructor.apply(this, arguments);
};

// takes an object of options as parameter. the options
// must specify the minimum and maximum of the desired
// range.
Ranger.prototype.constructor = function(options) {
	this.min = options.min;
	this.max = options.max;
};

// makes sure, that any given input value is with in
// the range specified by the options.
Ranger.prototype.range = function(value) {
	if (_.isArray(value)) {
		for (var i in value) {
			value[i] = this.range(value[i]);
		}
	} else {
		if (value < this.min) {
			value = this.min;
		} else if (value > this.max) {
			value = this.max;
		}
	}

	return value;
};

// ensure that the module can be used both in node.js
// and browser environment
if (typeof module != 'undefined' && module.exports) module.exports = Ranger;