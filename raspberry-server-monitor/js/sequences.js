var HIGH = 255,
	MEDIUM = 128,
	LOW = 0;

var acc = {
	shake_100_1: [
		{ time: 0,		value: MEDIUM	},
		{ time: 2000,	value: MEDIUM	},

		{ time: 100,	value: LOW		},
		{ time: 100,	value: HIGH		},
		{ time: 100,	value: LOW		},
		{ time: 100,	value: HIGH		},
		{ time: 200,	value: MEDIUM	}
	],
	shake_100_1: [
		{ time: 0,		value: MEDIUM,	},
		{ time: 2000,	value: MEDIUM,	},

		{ time: 100,	value: LOW,		},
		{ time: 100,	value: HIGH,	},
		{ time: 100,	value: LOW,		},
		{ time: 100,	value: HIGH,	},
		{ time: 200,	value: MEDIUM,	}
	],
	shake_100_2: [
		{ time: 0,		value: MEDIUM,	},
		{ time: 2000,	value: MEDIUM,	},

		{ time: 100,	value: LOW,		},
		{ time: 100,	value: HIGH,	},
		{ time: 100,	value: LOW,		},
		{ time: 100,	value: HIGH,	},
		{ time: 100,	value: MEDIUM,	},

		{ time: 250,	value: MEDIUM,	},

		{ time: 100,	value: LOW,		},
		{ time: 100,	value: HIGH,	},
		{ time: 100,	value: LOW,		},
		{ time: 100,	value: HIGH,	},
		{ time: 100,	value: MEDIUM,	},

		{ time: 250,	value: MEDIUM,	}
	],
	shake_100_3: [
		{ time: 0,		value: MEDIUM,	},
		{ time: 2000,	value: MEDIUM,	},

		{ time: 100,	value: LOW,		},
		{ time: 100,	value: HIGH,	},
		{ time: 100,	value: LOW,		},
		{ time: 100,	value: HIGH,	},
		{ time: 100,	value: MEDIUM,	},

		{ time: 250,	value: MEDIUM,	},

		{ time: 100,	value: LOW,		},	
		{ time: 100,	value: HIGH,	},
		{ time: 100,	value: LOW,		},
		{ time: 100,	value: HIGH,	},
		{ time: 100,	value: MEDIUM,	},

		{ time: 250,	value: MEDIUM,	},

		{ time: 100,	value: LOW,		},
		{ time: 100,	value: HIGH,	},
		{ time: 100,	value: LOW,		},
		{ time: 100,	value: HIGH,	},
		{ time: 100,	value: MEDIUM,	},

		{ time: 250,	value: MEDIUM,	}
	],

	shake_200_1: [
		{ time: 0,		value: MEDIUM,	},
		{ time: 2000,	value: MEDIUM,	},

		{ time: 200,	value: LOW,		},
		{ time: 200,	value: HIGH,	},
		{ time: 200,	value: LOW,		},
		{ time: 200,	value: HIGH,	},
		{ time: 200,	value: MEDIUM,	}
	],
	shake_200_2: [
		{ time: 0,		value: MEDIUM,	},
		{ time: 2000,	value: MEDIUM,	},

		{ time: 200,	value: LOW,		},
		{ time: 200,	value: HIGH,	},
		{ time: 200,	value: LOW,		},
		{ time: 200,	value: HIGH,	},
		{ time: 200,	value: MEDIUM,	},

		{ time: 500,	value: MEDIUM,	},

		{ time: 200,	value: LOW,		},
		{ time: 200,	value: HIGH,	},
		{ time: 200,	value: LOW,		},
		{ time: 200,	value: HIGH,	},
		{ time: 200,	value: MEDIUM,	}
	],
	shake_200_3: [
		{ time: 0,		value: MEDIUM,	},
		{ time: 2000,	value: MEDIUM,	},

		{ time: 200,	value: LOW,		},
		{ time: 200,	value: HIGH,	},
		{ time: 200,	value: LOW,		},
		{ time: 200,	value: HIGH,	},
		{ time: 200,	value: MEDIUM,	},

		{ time: 500,	value: MEDIUM,	},

		{ time: 200,	value: LOW,		},
		{ time: 200,	value: HIGH,	},
		{ time: 200,	value: LOW,		},
		{ time: 200,	value: HIGH,	},
		{ time: 200,	value: MEDIUM,	},

		{ time: 500,	value: MEDIUM,	},

		{ time: 200,	value: LOW,		},
		{ time: 200,	value: HIGH,	},
		{ time: 200,	value: LOW,		},
		{ time: 200,	value: HIGH,	},
		{ time: 200,	value: MEDIUM,	}
	],

	shake_400_1: [
		{ time: 0,		value: MEDIUM,	},
		{ time: 2000,	value: MEDIUM,	},

		{ time: 400,	value: LOW,		},
		{ time: 400,	value: HIGH,	},
		{ time: 400,	value: LOW,		},
		{ time: 400,	value: HIGH,	},
		{ time: 400,	value: MEDIUM,	}
	],
	shake_400_2: [
		{ time: 0,		value: MEDIUM,	},
		{ time: 2000,	value: MEDIUM,	},

		{ time: 400,	value: LOW,		},
		{ time: 400,	value: HIGH,	},
		{ time: 400,	value: LOW,		},
		{ time: 400,	value: HIGH,	},
		{ time: 400,	value: MEDIUM,	},

		{ time: 1000,	value: MEDIUM,	},

		{ time: 400,	value: LOW,		},
		{ time: 400,	value: HIGH,	},
		{ time: 400,	value: LOW,		},
		{ time: 400,	value: HIGH,	},
		{ time: 400,	value: MEDIUM,	}
	],
	shake_400_3: [
		{ time: 0,		value: MEDIUM,	},
		{ time: 2000,	value: MEDIUM,	},

		{ time: 400,	value: LOW,		},
		{ time: 400,	value: HIGH,	},
		{ time: 400,	value: LOW,		},
		{ time: 400,	value: HIGH,	},
		{ time: 400,	value: MEDIUM,	},

		{ time: 1000,	value: MEDIUM,	},

		{ time: 400,	value: LOW,		},
		{ time: 400,	value: HIGH,	},
		{ time: 400,	value: LOW,		},
		{ time: 400,	value: HIGH,	},
		{ time: 400,	value: MEDIUM,	},

		{ time: 1000,	value: MEDIUM,	},

		{ time: 400,	value: LOW,		},
		{ time: 400,	value: HIGH,	},
		{ time: 400,	value: LOW,		},
		{ time: 400,	value: HIGH,	},
		{ time: 400,	value: MEDIUM,	}
	]
};

var sequences = {
	acc: {},
	cap: {}
};


for (var key in acc) {
	sequences.acc[key + "_x"] = [];

	for (var part in acc[key]) {
		sequences.acc[key + "_x"].push({ time: acc[key][part].time, values: [acc[key][part].value, MEDIUM, MEDIUM] });
	}
}
for (var key in acc) {
	sequences.acc[key + "_y"] = [];

	for (var part in acc[key]) {
		sequences.acc[key + "_y"].push({ time: acc[key][part].time, values: [MEDIUM, acc[key][part].value, MEDIUM] });
	}
}
for (var key in acc) {
	sequences.acc[key + "_z"] = [];

	for (var part in acc[key]) {
		sequences.acc[key + "_z"].push({ time: acc[key][part].time, values: [MEDIUM, MEDIUM, acc[key][part].value] });
	}
}


// var sequences = {
// 	acc: {
// 		test_sequence: [
// 			{ time: 0,		value: MEDIUM,	},
// 			{ time: 1000,	value: LOW,		HIGH,	},
// 			{ time: 1000,	value: MEDIUM,	},
// 			{ time: 1000,	value: HIGH,		LOW,		},
// 			{ time: 1000,	value: MEDIUM,	}
// 		],

// 		shake_100_1: [
// 			{ time: 0,		value: MEDIUM,	},
// 			{ time: 2000,	value: MEDIUM,	},

// 			{ time: 100,	value: LOW,		},
// 			{ time: 100,	value: HIGH,	},
// 			{ time: 100,	value: LOW,		},
// 			{ time: 100,	value: HIGH,	},
// 			{ time: 200,	value: MEDIUM,	}
// 		],
// 		shake_100_2: [
// 			{ time: 0,		value: MEDIUM,	},
// 			{ time: 2000,	value: MEDIUM,	},

// 			{ time: 100,	value: LOW,		},
// 			{ time: 100,	value: HIGH,	},
// 			{ time: 100,	value: LOW,		},
// 			{ time: 100,	value: HIGH,	},
// 			{ time: 100,	value: MEDIUM,	},

// 			{ time: 250,	value: MEDIUM,	},

// 			{ time: 100,	value: LOW,		},
// 			{ time: 100,	value: HIGH,	},
// 			{ time: 100,	value: LOW,		},
// 			{ time: 100,	value: HIGH,	},
// 			{ time: 100,	value: MEDIUM,	},

// 			{ time: 250,	value: MEDIUM,	}
// 		],
// 		shake_100_3: [
// 			{ time: 0,		value: MEDIUM,	},
// 			{ time: 2000,	value: MEDIUM,	},

// 			{ time: 100,	value: LOW,		},
// 			{ time: 100,	value: HIGH,	},
// 			{ time: 100,	value: LOW,		},
// 			{ time: 100,	value: HIGH,	},
// 			{ time: 100,	value: MEDIUM,	},

// 			{ time: 250,	value: MEDIUM,	},

// 			{ time: 100,	value: LOW,		},
// 			{ time: 100,	value: HIGH,	},
// 			{ time: 100,	value: LOW,		},
// 			{ time: 100,	value: HIGH,	},
// 			{ time: 100,	value: MEDIUM,	},

// 			{ time: 250,	value: MEDIUM,	},

// 			{ time: 100,	value: LOW,		},
// 			{ time: 100,	value: HIGH,	},
// 			{ time: 100,	value: LOW,		},
// 			{ time: 100,	value: HIGH,	},
// 			{ time: 100,	value: MEDIUM,	},

// 			{ time: 250,	value: MEDIUM,	}
// 		],

// 		shake_200_1: [
// 			{ time: 0,		value: MEDIUM,	},
// 			{ time: 2000,	value: MEDIUM,	},

// 			{ time: 200,	value: LOW,		},
// 			{ time: 200,	value: HIGH,	},
// 			{ time: 200,	value: LOW,		},
// 			{ time: 200,	value: HIGH,	},
// 			{ time: 200,	value: MEDIUM,	}
// 		],
// 		shake_200_2: [
// 			{ time: 0,		value: MEDIUM,	},
// 			{ time: 2000,	value: MEDIUM,	},

// 			{ time: 200,	value: LOW,		},
// 			{ time: 200,	value: HIGH,	},
// 			{ time: 200,	value: LOW,		},
// 			{ time: 200,	value: HIGH,	},
// 			{ time: 200,	value: MEDIUM,	},

// 			{ time: 500,	value: MEDIUM,	},

// 			{ time: 200,	value: LOW,		},
// 			{ time: 200,	value: HIGH,	},
// 			{ time: 200,	value: LOW,		},
// 			{ time: 200,	value: HIGH,	},
// 			{ time: 200,	value: MEDIUM,	}
// 		],
// 		shake_200_3: [
// 			{ time: 0,		value: MEDIUM,	},
// 			{ time: 2000,	value: MEDIUM,	},

// 			{ time: 200,	value: LOW,		},
// 			{ time: 200,	value: HIGH,	},
// 			{ time: 200,	value: LOW,		},
// 			{ time: 200,	value: HIGH,	},
// 			{ time: 200,	value: MEDIUM,	},

// 			{ time: 500,	value: MEDIUM,	},

// 			{ time: 200,	value: LOW,		},
// 			{ time: 200,	value: HIGH,	},
// 			{ time: 200,	value: LOW,		},
// 			{ time: 200,	value: HIGH,	},
// 			{ time: 200,	value: MEDIUM,	},

// 			{ time: 500,	value: MEDIUM,	},

// 			{ time: 200,	value: LOW,		},
// 			{ time: 200,	value: HIGH,	},
// 			{ time: 200,	value: LOW,		},
// 			{ time: 200,	value: HIGH,	},
// 			{ time: 200,	value: MEDIUM,	}
// 		],

// 		shake_400_1: [
// 			{ time: 0,		value: MEDIUM,	},
// 			{ time: 2000,	value: MEDIUM,	},

// 			{ time: 400,	value: LOW,		},
// 			{ time: 400,	value: HIGH,	},
// 			{ time: 400,	value: LOW,		},
// 			{ time: 400,	value: HIGH,	},
// 			{ time: 400,	value: MEDIUM,	}
// 		],
// 		shake_400_2: [
// 			{ time: 0,		value: MEDIUM,	},
// 			{ time: 2000,	value: MEDIUM,	},

// 			{ time: 400,	value: LOW,		},
// 			{ time: 400,	value: HIGH,	},
// 			{ time: 400,	value: LOW,		},
// 			{ time: 400,	value: HIGH,	},
// 			{ time: 400,	value: MEDIUM,	},

// 			{ time: 1000,	value: MEDIUM,	},

// 			{ time: 400,	value: LOW,		},
// 			{ time: 400,	value: HIGH,	},
// 			{ time: 400,	value: LOW,		},
// 			{ time: 400,	value: HIGH,	},
// 			{ time: 400,	value: MEDIUM,	}
// 		],
// 		shake_400_3: [
// 			{ time: 0,		value: MEDIUM,	},
// 			{ time: 2000,	value: MEDIUM,	},

// 			{ time: 400,	value: LOW,		},
// 			{ time: 400,	value: HIGH,	},
// 			{ time: 400,	value: LOW,		},
// 			{ time: 400,	value: HIGH,	},
// 			{ time: 400,	value: MEDIUM,	},

// 			{ time: 1000,	value: MEDIUM,	},

// 			{ time: 400,	value: LOW,		},
// 			{ time: 400,	value: HIGH,	},
// 			{ time: 400,	value: LOW,		},
// 			{ time: 400,	value: HIGH,	},
// 			{ time: 400,	value: MEDIUM,	},

// 			{ time: 1000,	value: MEDIUM,	},

// 			{ time: 400,	value: LOW,		},
// 			{ time: 400,	value: HIGH,	},
// 			{ time: 400,	value: LOW,		},
// 			{ time: 400,	value: HIGH,	},
// 			{ time: 400,	value: MEDIUM,	}
// 		]
// 	},
// 	cap: {
// 		slow_touch: [
// 			{ time: 0,		value: LOW]},
// 			{ time: 5000,	value: HIGH]},
// 			{ time: 5000,	value: LOW]}
// 		],
// 		quick_touch: [
// 			{ time: 0,		value: LOW]},
// 			{ time: 1000,	value: HIGH]},
// 			{ time: 1000,	value: LOW]}
// 		]
// 	}
//};
