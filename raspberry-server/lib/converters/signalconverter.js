// ensure that the module can be used both in node.js
// and browser environment

// include the utility classes and the abstract signal converter
if (typeof module != 'undefined') {
	var _ = require('underscore'),
		Ranger = require('./../utils/ranger'),
		Parser = require('./../utils/parser'),
		Smoother = require('./../utils/smoother'),
		Compressor = require('./../utils/compressor'),
		
		AbstractSignalConverter = require('./abstractsignalconverter');

	_.mixin({
		inherit: require('./../misc/underscore.inherit')
	});
};

// instantiate utility classes with desired options
var ranger = new Ranger({ min: 0, max: 255 });
var ranger_1 = new Ranger({ min: 1, max: 255 });
var parser = new Parser();
var vibration_smoother = new Smoother({ min: 0, max: 155, step_up: 1, step_down: 20, value: 0 });

// instantiate rgb down smoothers
var r_down_smoother = new Smoother({ step_down: 8 });
var g_down_smoother = new Smoother({ step_down: 8 });
var b_down_smoother = new Smoother({ step_down: 8 });

// instantiate rgb up smoothers
var r_up_smoother = new Smoother({ step_up: 8 });
var g_up_smoother = new Smoother({ step_up: 8 });
var b_up_smoother = new Smoother({ step_up: 8 });

// inherit from the abstract signal converter class
var SignalConverter = _.inherit(AbstractSignalConverter, {
	// set the time option, the calculate method will be called every 100 ms
	time: 100,
	// set the items options to 0 - it will not be called
	items: 0,

	// used to store the previous calculations of the states
	states: [
		[0, 0, 0, 0, 0]
	],

	// used to store the full rgb values
	pure_rgb: [255, 0, 0],
	// used to store the decaying rgb values
	decay_rgb: [255, 0, 0],

	// determines if we are focusing on r, b, or g (0, 1, 3)
	color: 0,

	// threshold for determining touch
	touch: 100,
	// threshold for determining movement
	movement: 60,

	// variable used to differentiate between fade-down and long-time decay
	// in the inactive phase
	still_first: true,

	// overriding the calculate method
	calculate: function() {
		var result = [];

		// find the max values of the accelerometer and capacivity sensor
		var acc_max = [0, 0, 0];
		var cap_max = 0;
		
		var len = this.value_sets.length;

		while (this.value_sets.length > 0) {
			var value_set = this.value_sets.pop();
			
			for (var i = 0; i < 3; i++) {
				value_set[i] = parseInt(value_set[i]);
				if (value_set[i] > acc_max[i]) acc_max[i] = value_set[i];
			}

			value_set[3] = parseInt(value_set[3]);
			if (value_set[3] > cap_max) cap_max = value_set[3];
		}

		// add the max values from the three accelerometer axises
		var magnitude = parser.parse(acc_max[0] + acc_max[1] + acc_max[2]);
		var capacivity = cap_max;

		var states = [magnitude];

		// take the previous states into consideration,
		// this helps preventing sudden change in the values
		// if we should get some "jumps" from the hardware measures
		var prev_states = this.states;
		var prev_states_averages = [0];

		for (var s = 0; s < prev_states.length; s++) {
			for (var v = 0; v < prev_states[s].length; v++) {
				prev_states_averages[s] += parseInt(prev_states[s][v]);
			}
			prev_states_averages[s] = prev_states_averages[s] / prev_states[s].length;
			
			var damp = prev_states_averages[s] > states[s] ? 1.5 : 4;
			states[s] = states[s] + (prev_states_averages[s] - states[s]) / damp;
		
			this.states[s].shift();
			this.states[s].push(states[s]);
		}
		
		// if the accelerometer values is above the movement threshold
		// then enter the movement calculation phase
		if (states[0] > this.movement) {
			//console.log("movement");
			this.still_first = true;	

			// calculate how much the colors should changes, based
			// on the magnitude of the accelerometer values
			var step = Math.round(states[0] / 255 * 5);

			this.pure_rgb[this.color] = ranger.range(this.pure_rgb[this.color] - step);
			this.pure_rgb[(this.color+1) % 3] = ranger.range(this.pure_rgb[(this.color+1) % 3] + step);

			if (this.pure_rgb[this.color] == 0) {
				this.color++;
				if (this.color == 3) {
					this.color = 0;
				}
			}

			this.decay_rgb = this.pure_rgb.slice();

			result = [
				this.pure_rgb[0],
				this.pure_rgb[1],
				this.pure_rgb[2], 
				// also, fade up the vibration
				vibration_smoother.up()
			];

		// if the capacivity value is above the touch threshold
		// then enter the touch calculation phase
		} else if (capacivity > this.touch) {
			//console.log("touch");
			this.still_first = true;

			// smooth up the color values to their potential max
			// (this is done through more rounds of calculations)
			r_up_smoother.min = this.decay_rgb[0];
			r_up_smoother.max = this.pure_rgb[0];
			r_up_smoother.value = this.decay_rgb[0];

			g_up_smoother.min = this.decay_rgb[1];
			g_up_smoother.max = this.pure_rgb[1];
			g_up_smoother.value = this.decay_rgb[1];

			b_up_smoother.min = this.decay_rgb[2];
			b_up_smoother.max = this.pure_rgb[2];
			b_up_smoother.value = this.decay_rgb[2];

			this.decay_rgb[0] = r_up_smoother.up();
			this.decay_rgb[1] = g_up_smoother.up();
			this.decay_rgb[2] = b_up_smoother.up();

			result = [
				this.decay_rgb[0],
				this.decay_rgb[1],
				this.decay_rgb[2],
				vibration_smoother.down()
			];

		// if there is no movement or touch detected, then enter
		// the inacitivy phase
		} else {
			// if we just arrived in the inactivity phase,
			// from one of the other phases, then set the
			// smoother values to be used in the upcoming calculations
			if (this.still_first) {
				r_down_smoother.min = this.pure_rgb[0] / 2;
				r_down_smoother.max = this.decay_rgb[0];
				r_down_smoother.value = this.decay_rgb[0];

				g_down_smoother.min = this.pure_rgb[1] / 2;
				g_down_smoother.max = this.decay_rgb[1];
				g_down_smoother.value = this.decay_rgb[1];

				b_down_smoother.min = this.pure_rgb[2] / 2;
				b_down_smoother.max = this.decay_rgb[2];
				b_down_smoother.value = this.decay_rgb[2];

				this.still_first = false;
			}

			// smooth down the values until we hit half of their
			// full values
			if (
				this.decay_rgb[0] > (this.pure_rgb[0] / 2) || 
				this.decay_rgb[1] > (this.pure_rgb[1] / 2) || 
				this.decay_rgb[2] > (this.pure_rgb[2] / 2)
			) {
				//console.log("down to still");
				this.decay_rgb[0] = r_down_smoother.down();
				this.decay_rgb[1] = g_down_smoother.down();
				this.decay_rgb[2] = b_down_smoother.down();
			} else {
				//console.log("still");
				// when we are down fading, this is used to calculate
				// a long-time decaying of the colors. this calculation
				// makes the color fade away over 10 hours
				for (var i = 0; i < 3; i++)
					this.decay_rgb[i] = this.decay_rgb[i] * 0.999986544;
			}

			result = [
				this.decay_rgb[0],
				this.decay_rgb[1], 
				this.decay_rgb[2], 
				// also, fade down the vibration
				vibration_smoother.down(),
			];
		}

		// make sure that the light values are within
		// a range of 1-255 and that the vibration is within
		// the range of 0-255.
		result[0] = ranger_1.range(result[0]);
		result[1] = ranger_1.range(result[1]);
		result[2] = ranger_1.range(result[2]);
		result[3] = ranger.range(result[3]);

		// make sure that all numbers are integers, and not floats
		result = parser.parse(result);
		
		this.invoke(result || []);
	}

});

// ensure that the module can be used both in node.js
// and browser environment
if (typeof module != 'undefined' && module.exports) module.exports = SignalConverter;
