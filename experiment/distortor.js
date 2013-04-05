
var Distortor = function() {
	Distortor.prototype.constructor.apply(this, arguments);
};

Distortor.prototype.constructor = function(options) {
	options = options || {};

	this.setSpectrum(options.spectrum || 10);
};

Distortor.prototype.setSpectrum = function(spectrum) {
	this.spectrum = spectrum;
	this.half = Math.round(this.spectrum / 2);
};

Distortor.prototype.distort = function(value) {
	return value + Math.floor((Math.random() * this.spectrum) + 1) - this.half;
};

if (typeof module != 'undefined' && module.exports) module.exports = Distortor;