var Converter = function() {
	Converter.prototype.constructor.apply(this, arguments);
};

Converter.prototype.constructor = function(options) {
	this.calculator = options.calculator;

	this.callbacks = [];
	this.value_sets = [];

	// this.WATCH_INTERVAL = 50;
};

Converter.prototype.start = function() {
	var self = this;

	// setInterval(function() {
	// 	self.calculate();
	// }, this.WATCH_INTERVAL);
};

Converter.prototype.calculate = function() {
	var result = this.calculator.calculate(this);

	for (var x in this.callbacks) {
		this.callbacks[x].call(this, result);
	}
};

Converter.prototype.push = function(value_set) {
	this.value_sets.push(value_set);

	if (this.value_sets.length > 10) {
		this.calculate();
	}
};

Converter.prototype.emit = function(callback) {
	this.callbacks.push(callback);
};

if (typeof module != 'undefined' && module.exports) module.exports = Converter;