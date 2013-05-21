
// class used to distort a number. when the 
// class is initialized, one can set a options
// with the maximum range within the number
// must be distorted.
var Distortor = function() {
	Distortor.prototype.constructor.apply(this, arguments);
};

// takes an array as options
Distortor.prototype.constructor = function(options) {
	options = options || {};

	this.setSpectrum(options.spectrum || 10);
};

// set the range that the input should be distorted with
Distortor.prototype.setSpectrum = function(spectrum) {
	this.spectrum = spectrum;
	this.half = Math.round(this.spectrum / 2);
};

// distorts the input adding or substracting
// a random amount within the range set.
Distortor.prototype.distort = function(value) {
	return value + Math.floor((Math.random() * this.spectrum) + 1) - this.half;
};

// ensure that the module can be used both in node.js
// and browser environment
if (typeof module != 'undefined' && module.exports) module.exports = Distortor;
