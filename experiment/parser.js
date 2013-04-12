if (typeof module != 'undefined') {
	var _ = require('./../raspberry-server/node_modules/underscore');
};

var Parser = function() {
	Parser.prototype.constructor.apply(this, arguments);
};

Parser.prototype.constructor = function() { };

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

if (typeof module != 'undefined' && module.exports) module.exports = Parser;