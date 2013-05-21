// constructor method for the class
var Converter = function() {
	Converter.prototype.constructor.apply(this, arguments);
};

// constructor for the class. takes an object of options
// and sets the class varibles accordingly or to their defaults.
Converter.prototype.constructor = function(options) {
	var self = this;

	options = options || {};
	// if the time option is set, the calculate method
	// will be called with this interval (in ms)
	this.time = options.time || this.time || undefined;
	// if the items option is set, the calculate method
	// will be called each time the value_sets array
	// reaches the length of the items variable
	this.items = options.items || this.items || undefined;

	// array to store the callbacks
	this.callbacks = [];
	// array to store the incoming value sets
	this.value_sets = [];

	// to check if the converter is started
	this.running = false;
};

// starts the converter. if the time options is set,
// a interval calling the calculate method is initialized
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

// stops the converter. the time interval calling 
// the calculate method is cleared
Converter.prototype.stop = function() {
	clearInterval(this.interval);
	this.running = false;
};

// the invoke method should be called with the result
// of the calculation from within the calculate method.

// todo: can potentially be replaced by the calculate
// method just returning its result instead.
Converter.prototype.invoke = function(result) {
	for (var x in this.callbacks) {
		this.callbacks[x].call(this, result);
	}
};

// method to push a value set onto the value sets array.
// used to pass the values to the converter instance.
// if the items option is set, then the method will call the
// calculate method when the value sets array reaches the
// desire length.
Converter.prototype.push = function(value_set) {
	this.value_sets.push(value_set);

	if (this.running && this.items && this.value_sets.length > this.items) {
		this.calculate();
	}
};

// method to assign a callback to receive the
// results of the calculations
Converter.prototype.emit = function(callback) {
	this.callbacks.push(callback);
};

// dummy method for the calculate method. this 
// method should be implemented by all prototypes.
Converter.prototype.calculate = function() {
	this.invoke([]);
}

// ensure that the module can be used both in node.js
// and browser environment
if (typeof module != 'undefined' && module.exports) module.exports = Converter;