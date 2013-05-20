var Converter = function() {
	Converter.prototype.constructor.apply(this, arguments);
};

Converter.prototype.constructor = function(options) {
	var self = this;

	options = options || {};
	this.time = options.time || undefined;
	this.items = options.items || undefined;

	this.callbacks = [];
	this.value_sets = [];

	this.running = false;
};

Converter.prototype.start = function() {
	var self = this;

	this.running = true;

	if (this.time) {
		this.interval = setInterval(function() {
			// console.log("converter loop");
			self.calculate();
		}, this.time);
	}
};

Converter.prototype.stop = function() {
	clearInterval(this.interval);
	this.running = false;
};

Converter.prototype.invoke = function(result) {
	for (var x in this.callbacks) {
		this.callbacks[x].call(this, result);
	}
};

Converter.prototype.push = function(value_set) {
	this.value_sets.push(value_set);

	if (this.items && this.value_sets.length > this.items) {
		this.calculate();
	}
};

Converter.prototype.emit = function(callback) {
	this.callbacks.push(callback);
};

Converter.prototype.calculate = function() {
	this.invoke([]);
}

if (typeof module != 'undefined' && module.exports) module.exports = Converter;