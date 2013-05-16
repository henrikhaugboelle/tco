if (typeof module != 'undefined') {
	var _ = require('underscore'),
		Ranger = require('./../utils/ranger'),
		Parser = require('./../utils/parser'),
		Smoother = require('./../utils/smoother'),
		Compressor = require('./../utils/compressor'),
		
		Converter = require('./converter');

	_.mixin({
		inherit: require('./../misc/underscore.inherit')
	});
};

var ranger = new Ranger({ min: 0, max: 255 });

var PrototypeConverter = _.inherit(Converter, {
	time: 200,
	items: 0,

	state: {
		magnitude: [0, 0, 0, 0, 0]
	},

	calculate: function() {
		var result = [];

		var acc_min = [255, 255, 255],
			acc_max = [0, 0, 0];

		while (this.value_sets.length > 0) {
			var value_set = this.value_sets.pop();
			

			for (var i = 0; i < 3; i++) {
				value_set[i] = parseInt(value_set[i]);
				if (value_set[i] < acc_min[i]) acc_min[i] = value_set[i];
				if (value_set[i] > acc_max[i]) acc_max[i] = value_set[i];
			}
		}

		var acc_dif = [0, 0, 0];

		for (var i = 0; i < 3; i++) {
			if (acc_max[i] > 0 && acc_min[i] < 255) {
				acc_dif[i] = acc_max[i] - acc_min[i];
			}
		}

		acc_dif = acc_max;

		console.log(acc_dif);

		var prev_magnitude = this.state.magnitude;
		var prev_magnitude_sum = 0;

		for (var i = 0; i < prev_magnitude.length; i++) {
			prev_magnitude_sum = prev_magnitude_sum + prev_magnitude[i];
		}
		
		var m = magnitude = parseInt((acc_dif[0] + acc_dif[1] + acc_dif[2]));
		console.log(m);
		prev_magnitude_sum = prev_magnitude_sum / prev_magnitude.length;

		var vibration = magnitude;
		// var vibration = magnitude + (prev_magnitude[prev_magnitude.length-1] - magnitude) / 8;

		if (prev_magnitude_sum > magnitude) {
			magnitude = magnitude + (prev_magnitude_sum - magnitude) / 2;
		} else {
			magnitude = magnitude + (prev_magnitude_sum - magnitude) / 4;
		}

		this.state.magnitude.shift();
		this.state.magnitude.push(magnitude);

		//result = [255, 0, 0, parseInt(magnitude), parseInt(vibration)];

		magnitude = ranger.range(magnitude);
		vibration = ranger.range(vibration);

		if (vibration > 30) {
			vibration += 80;
		} else {
			vibration = 0;
		}

		result = [parseInt(magnitude), parseInt(vibration)];
					
		this.invoke(result || []);
	}

});

if (typeof module != 'undefined' && module.exports) module.exports = PrototypeConverter;