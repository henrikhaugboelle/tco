if (typeof module != 'undefined') {
	var _ = require('./../raspberry-server/node_modules/underscore'),
		Ranger = require('./ranger'),
		Converter = require('./converter');

	_.mixin({
		inherit: require('./underscore.inherit')
	});
};

var AverageConverter = _.inherit(Converter, {
	time: 100,
	items: 0,

	calculate: function() {
		var temp = [];

		var number_of_sets = this.value_sets.length;

		temp = this.value_sets.pop();
		while (this.value_sets.length > 0) {
			var value_set = this.value_sets.pop();

			for (var i in value_set) {
				temp[i] = parseInt(temp[i] || 0) + parseInt(value_set[i]);
			}
		}

		for (var i in temp) {
			temp[i] = Math.round(temp[i] / number_of_sets);
		}

		this.invoke(temp || []);
	}

});

if (typeof module != 'undefined' && module.exports) module.exports = AverageConverter;