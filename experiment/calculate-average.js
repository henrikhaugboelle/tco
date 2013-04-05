
// var CalculatorAverage = function() {
// 	CalculatorAverage.prototype.constructor.apply(this, arguments);
// };

// CalculatorAverage.prototype.constructor = function(options) {
// };

// CalculatorAverage.prototype.calculate = function(converter) {
// 	var temp = [];

// 	var number_of_sets = converter.value_sets.length;

// 	temp = converter.value_sets.pop();
// 	while (converter.value_sets.length > 0) {
// 		var value_set = converter.value_sets.pop();

// 		for (var i in value_set) {
// 			temp[i] = parseInt(temp[i] || 0) + parseInt(value_set[i]);
// 		}
// 	}

// 	for (var i in temp) {
// 		temp[i] = Math.round(temp[i] / number_of_sets);
// 	}

// 	return temp || [];
// };

// if (typeof module != 'undefined' && module.exports) module.exports = CalculatorAverage;
