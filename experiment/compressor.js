if (typeof module != 'undefined') {
	var _ = require('./../raspberry-server/node_modules/underscore');
};

var Compressor = function() {
	Compressor.prototype.constructor.apply(this, arguments);
};

Compressor.prototype.constructor = function(options) {
	this.real_min = options.real_min;
	this.real_max = options.real_max - options.real_min;

	this.comp_min = options.comp_min;
	this.comp_max = options.comp_max - options.comp_min;
};

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

if (typeof module != 'undefined' && module.exports) module.exports = Compressor;