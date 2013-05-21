// ensure that the module can be used both in node.js
// and browser environment
if (typeof module != 'undefined') {
	var _ = require('underscore');
};

// class used to convert floats to integers
var Parser = function() {
	Parser.prototype.constructor.apply(this, arguments);
};

Parser.prototype.constructor = function() { };

// converts floats to integers. both single numbers
// and arrays of integers, can be given as input.
Parser.prototype.parse = function(value) {
	if (_.isArray(value)) {
		for (var i in value) {
			value[i] = this.parse(value[i]);
		}
	} else {
		value = parseInt(value, 10);
	}

	return value;
};

// ensure that the module can be used both in node.js
// and browser environment
if (typeof module != 'undefined' && module.exports) module.exports = Parser;