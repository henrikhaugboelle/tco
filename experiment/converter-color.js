if (typeof module != 'undefined') {
	var _ = require('./../raspberry-server/node_modules/underscore'),
		Ranger = require('./ranger'),
		Parser = require('./parser'),
		Converter = require('./converter');

	_.mixin({
		inherit: require('./underscore.inherit')
	});
};

var ranger = new Ranger({ min: 0, max: 255 });
var parser = new Parser();

var ColorConverter = _.inherit(Converter, {
	time: 200,
	items: 0,

	states: [
		[0, 0, 0, 0, 0]
	],

	rgb: [255, 0, 0],
	color: 0,

	calculate: function() {
		var result = [];

		var acc_max = [0, 0, 0];

		while (this.value_sets.length > 0) {
			var value_set = this.value_sets.pop();
			
			for (var i = 0; i < 3; i++) {
				value_set[i] = parseInt(value_set[i]);
				if (value_set[i] > acc_max[i]) acc_max[i] = value_set[i];
			}
		}

		var magnitude = parser.parse(acc_max[0] + acc_max[1] + acc_max[2]);

		var states = [magnitude];

		var prev_states = this.states;
		var prev_states_averages = [0, 0, 0, 0, 0];

		var damp;

		for (var s = 0; s < prev_states.length; s++) {
			for (var v = 0; v < prev_states[s].length; v++) {
				prev_states_averages[s] += parseInt(prev_states[s][v]);
			}
			prev_states_averages[s] = prev_states_averages[s] / prev_states[s].length;
			
			damp = prev_states_averages[s] > states[s] ? 1.8 : 4;
			states[s] = states[s] + (prev_states_averages[s] - states[s]) / damp;
		
			this.states[s].shift();
			this.states[s].push(states[s]);
		}
		
		if (states[0] > 30) {
			var step = Math.round(states[0] / 255 * 10);

			this.rgb[this.color] = ranger.range(this.rgb[this.color] - step);
			this.rgb[(this.color+1) % 3] = ranger.range(this.rgb[(this.color+1) % 3] + step);

			if (this.rgb[this.color] == 0) {
				this.color++;
				if (this.color == 3) {
					this.color = 0;
				}
			}
		}

		result = [this.rgb[0], this.rgb[1], this.rgb[2], 255, states[0], magnitude];

		result = ranger.range(result);
		result = parser.parse(result);

		this.invoke(result || []);
	}

});

if (typeof module != 'undefined' && module.exports) module.exports = ColorConverter;