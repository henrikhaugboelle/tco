if (typeof module != 'undefined') {
	var _ = require('underscore');
};

var Ranger = function() {
	Ranger.prototype.constructor.apply(this, arguments);
};

Ranger.prototype.constructor = function(options) {
	this.min = options.min;
	this.max = options.max;
};

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

if (typeof module != 'undefined' && module.exports) module.exports = Ranger;