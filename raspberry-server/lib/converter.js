var Converter = function() {
	Converter.prototype.constructor.apply(this, arguments);
};

Converter.prototype.constructor = function() {
	this.callbacks = [];
	this.value_sets = [];

	// this.state = [];

	this.WATCH_INTERVAL = 200;

	this.watch();
};

Converter.prototype.watch = function() {
	setInterval(function() {
		this.calculate();
	}, this.WATCH_INTERVAL);
};

Converter.prototype.calculate = function() {
	var temp = [];

	var number_of_sets = this.value_sets.length;

	temp = this.value_sets.pop();
	while (this.value_sets.length > 0) {
		var value_set = this.value_sets.pop();

		for (var i in value_set) {
			temp[i] += value_set[i];
		}
	}

	for (var i in temp) {
		temp[i] = Math.round(temp[i] / number_of_sets);
	}

	for (var x in this.callbacks) {
		this.callbacks[x].call(this, temp);
	}
};

Converter.prototype.push = function(value_set) {
	this.value_sets.push(value_set);
};

Converter.prototype.emit = function(callback) {
	this.callbacks.push(callback);
};

modules.export = Converter;