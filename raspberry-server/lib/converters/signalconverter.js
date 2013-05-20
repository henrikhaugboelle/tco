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

var ranger = new Ranger({ min: 0, max: 255 });
var ranger_1 = new Ranger({ min: 1, max: 255 });
var parser = new Parser();
var vibration_smoother = new Smoother({ min: 0, max: 155, step_up: 1, step_down: 20, value: 0 });

var r_down_smoother = new Smoother({ step_down: 8 });
var g_down_smoother = new Smoother({ step_down: 8 });
var b_down_smoother = new Smoother({ step_down: 8 });

var r_up_smoother = new Smoother({ step_up: 8 });
var g_up_smoother = new Smoother({ step_up: 8 });
var b_up_smoother = new Smoother({ step_up: 8 });

var SignalConverter = _.inherit(AbstractSignalConverter, {
	time: 100,
	items: 0,

	states: [
		[0, 0, 0, 0, 0]
	],

	pure_rgb: [255, 0, 0],
	decay_rgb: [255, 0, 0],

	color: 0,

	touch: 100,
	movement: 60,

	still_first: true,

	calculate: function() {
		var result = [];

		var acc_max = [0, 0, 0];
		var cap_max = 0;
		
		var len = this.value_sets.length;

		while (this.value_sets.length > 0) {
			var value_set = this.value_sets.pop();
			
			for (var i = 0; i < 3; i++) {
				value_set[i] = parseInt(value_set[i]);
				if (value_set[i] > acc_max[i]) acc_max[i] = value_set[i];
			}

			value_set[4] = parseInt(value_set[4]);
			if (value_set[4] > cap_max[4]) cap_max[4] = value_set[4];
		}

		var magnitude = parser.parse(acc_max[0] + acc_max[1] + acc_max[2]);
		var capacivity = cap_max;

		var states = [magnitude];

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
		
		if (states[0] > this.movement) {
			//console.log("movement");
			this.still_first = true;	
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
				vibration_smoother.up()
			];

		} else if (capacivity > this.touch) {
			//console.log("touch");
			this.still_first = true;

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
		} else {
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
				for (var i = 0; i < 3; i++)
					this.decay_rgb[i] = this.decay_rgb[i] * 0.999986544;
			}

			result = [
				this.decay_rgb[0],
				this.decay_rgb[1], 
				this.decay_rgb[2], 
				vibration_smoother.down(),
			];
		}
		result[0] = ranger_1.range(result[0]);
		result[1] = ranger_1.range(result[1]);
		result[2] = ranger_1.range(result[2]);
		result[3] = ranger.range(result[3]);

		result = parser.parse(result);
		
		// console.log(result);

		this.invoke(result || []);
	}

});

if (typeof module != 'undefined' && module.exports) module.exports = SignalConverter;
