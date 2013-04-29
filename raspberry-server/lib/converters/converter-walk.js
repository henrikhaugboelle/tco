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

var ranger = new Ranger({ min: 1, max: 255 });
var parser = new Parser();

var WalkConverter = _.inherit(Converter, {
	time: 200,
	items: 0,

	states: [
		[0, 0, 0, 0, 0]
	],

	rgb: [255, 0, 0],
	step: 5,
	round: 255 / 5, // 51
	count: 0,
	color: 0,

	calculate: function() {
		var result = [];

		this.rgb[this.color] -= this.step;
		this.rgb[(this.color+1) % 3] += this.step;

		this.count++
		if (this.count == 51) {
			this.count = 0;
			this.color++;
			if (this.color == 3) {
				this.color = 0;
			}
		}

		result = [this.rgb[0], this.rgb[1], this.rgb[2], 0];

		result = ranger.range(result);
		result = parser.parse(result);

		this.invoke(result || []);
	}

});

if (typeof module != 'undefined' && module.exports) module.exports = WalkConverter;