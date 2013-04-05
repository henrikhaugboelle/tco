var HIGH = 255,
	MEDIUM = 128,
	LOW = 0;

var sequences = {
	acc: {
		test_sequence: [
			{ time: 0,		values: [MEDIUM,	MEDIUM,		MEDIUM] },
			{ time: 1000,	values: [LOW,		HIGH,		MEDIUM] },
			{ time: 1000,	values: [MEDIUM,	MEDIUM,		MEDIUM] },
			{ time: 1000,	values: [HIGH,		LOW,		MEDIUM] },
			{ time: 1000,	values: [MEDIUM,	MEDIUM,		MEDIUM] }
		],

		shake_x_100_1: [
			{ time: 0,		values: [MEDIUM,	MEDIUM,		MEDIUM] },
			{ time: 2000,	values: [MEDIUM,	MEDIUM,		MEDIUM] },

			{ time: 100,	values: [LOW,		MEDIUM,		MEDIUM] },
			{ time: 100,	values: [HIGH,		MEDIUM,		MEDIUM] },
			{ time: 100,	values: [LOW,		MEDIUM,		MEDIUM] },
			{ time: 100,	values: [HIGH,		MEDIUM,		MEDIUM] },
			{ time: 200,	values: [MEDIUM,	MEDIUM,		MEDIUM] }
		],
		shake_x_100_2: [
			{ time: 0,		values: [MEDIUM,	MEDIUM,		MEDIUM] },
			{ time: 2000,	values: [MEDIUM,	MEDIUM,		MEDIUM] },

			{ time: 100,	values: [LOW,		MEDIUM,		MEDIUM] },
			{ time: 100,	values: [HIGH,		MEDIUM,		MEDIUM] },
			{ time: 100,	values: [LOW,		MEDIUM,		MEDIUM] },
			{ time: 100,	values: [HIGH,		MEDIUM,		MEDIUM] },
			{ time: 100,	values: [MEDIUM,	MEDIUM,		MEDIUM] },

			{ time: 250,	values: [MEDIUM,	MEDIUM,		MEDIUM] },

			{ time: 100,	values: [LOW,		MEDIUM,		MEDIUM] },
			{ time: 100,	values: [HIGH,		MEDIUM,		MEDIUM] },
			{ time: 100,	values: [LOW,		MEDIUM,		MEDIUM] },
			{ time: 100,	values: [HIGH,		MEDIUM,		MEDIUM] },
			{ time: 100,	values: [MEDIUM,	MEDIUM,		MEDIUM] },

			{ time: 250,	values: [MEDIUM,	MEDIUM,		MEDIUM] }
		],
		shake_x_100_3: [
			{ time: 0,		values: [MEDIUM,	MEDIUM,		MEDIUM] },
			{ time: 2000,	values: [MEDIUM,	MEDIUM,		MEDIUM] },

			{ time: 100,	values: [LOW,		MEDIUM,		MEDIUM] },
			{ time: 100,	values: [HIGH,		MEDIUM,		MEDIUM] },
			{ time: 100,	values: [LOW,		MEDIUM,		MEDIUM] },
			{ time: 100,	values: [HIGH,		MEDIUM,		MEDIUM] },
			{ time: 100,	values: [MEDIUM,	MEDIUM,		MEDIUM] },

			{ time: 250,	values: [MEDIUM,	MEDIUM,		MEDIUM] },

			{ time: 100,	values: [LOW,		MEDIUM,		MEDIUM] },
			{ time: 100,	values: [HIGH,		MEDIUM,		MEDIUM] },
			{ time: 100,	values: [LOW,		MEDIUM,		MEDIUM] },
			{ time: 100,	values: [HIGH,		MEDIUM,		MEDIUM] },
			{ time: 100,	values: [MEDIUM,	MEDIUM,		MEDIUM] },

			{ time: 250,	values: [MEDIUM,	MEDIUM,		MEDIUM] },

			{ time: 100,	values: [LOW,		MEDIUM,		MEDIUM] },
			{ time: 100,	values: [HIGH,		MEDIUM,		MEDIUM] },
			{ time: 100,	values: [LOW,		MEDIUM,		MEDIUM] },
			{ time: 100,	values: [HIGH,		MEDIUM,		MEDIUM] },
			{ time: 100,	values: [MEDIUM,	MEDIUM,		MEDIUM] },

			{ time: 250,	values: [MEDIUM,	MEDIUM,		MEDIUM] }
		],

		shake_x_200_1: [
			{ time: 0,		values: [MEDIUM,	MEDIUM,		MEDIUM] },
			{ time: 2000,	values: [MEDIUM,	MEDIUM,		MEDIUM] },

			{ time: 200,	values: [LOW,		MEDIUM,		MEDIUM] },
			{ time: 200,	values: [HIGH,		MEDIUM,		MEDIUM] },
			{ time: 200,	values: [LOW,		MEDIUM,		MEDIUM] },
			{ time: 200,	values: [HIGH,		MEDIUM,		MEDIUM] },
			{ time: 200,	values: [MEDIUM,	MEDIUM,		MEDIUM] }
		],
		shake_x_200_2: [
			{ time: 0,		values: [MEDIUM,	MEDIUM,		MEDIUM] },
			{ time: 2000,	values: [MEDIUM,	MEDIUM,		MEDIUM] },

			{ time: 200,	values: [LOW,		MEDIUM,		MEDIUM] },
			{ time: 200,	values: [HIGH,		MEDIUM,		MEDIUM] },
			{ time: 200,	values: [LOW,		MEDIUM,		MEDIUM] },
			{ time: 200,	values: [HIGH,		MEDIUM,		MEDIUM] },
			{ time: 200,	values: [MEDIUM,	MEDIUM,		MEDIUM] },

			{ time: 500,	values: [MEDIUM,	MEDIUM,		MEDIUM] },

			{ time: 200,	values: [LOW,		MEDIUM,		MEDIUM] },
			{ time: 200,	values: [HIGH,		MEDIUM,		MEDIUM] },
			{ time: 200,	values: [LOW,		MEDIUM,		MEDIUM] },
			{ time: 200,	values: [HIGH,		MEDIUM,		MEDIUM] },
			{ time: 200,	values: [MEDIUM,	MEDIUM,		MEDIUM] }
		],
		shake_x_200_3: [
			{ time: 0,		values: [MEDIUM,	MEDIUM,		MEDIUM] },
			{ time: 2000,	values: [MEDIUM,	MEDIUM,		MEDIUM] },

			{ time: 200,	values: [LOW,		MEDIUM,		MEDIUM] },
			{ time: 200,	values: [HIGH,		MEDIUM,		MEDIUM] },
			{ time: 200,	values: [LOW,		MEDIUM,		MEDIUM] },
			{ time: 200,	values: [HIGH,		MEDIUM,		MEDIUM] },
			{ time: 200,	values: [MEDIUM,	MEDIUM,		MEDIUM] },

			{ time: 500,	values: [MEDIUM,	MEDIUM,		MEDIUM] },

			{ time: 200,	values: [LOW,		MEDIUM,		MEDIUM] },
			{ time: 200,	values: [HIGH,		MEDIUM,		MEDIUM] },
			{ time: 200,	values: [LOW,		MEDIUM,		MEDIUM] },
			{ time: 200,	values: [HIGH,		MEDIUM,		MEDIUM] },
			{ time: 200,	values: [MEDIUM,	MEDIUM,		MEDIUM] },

			{ time: 500,	values: [MEDIUM,	MEDIUM,		MEDIUM] },

			{ time: 200,	values: [LOW,		MEDIUM,		MEDIUM] },
			{ time: 200,	values: [HIGH,		MEDIUM,		MEDIUM] },
			{ time: 200,	values: [LOW,		MEDIUM,		MEDIUM] },
			{ time: 200,	values: [HIGH,		MEDIUM,		MEDIUM] },
			{ time: 200,	values: [MEDIUM,	MEDIUM,		MEDIUM] }
		],

		shake_x_400_1: [
			{ time: 0,		values: [MEDIUM,	MEDIUM,		MEDIUM] },
			{ time: 2000,	values: [MEDIUM,	MEDIUM,		MEDIUM] },

			{ time: 400,	values: [LOW,		MEDIUM,		MEDIUM] },
			{ time: 400,	values: [HIGH,		MEDIUM,		MEDIUM] },
			{ time: 400,	values: [LOW,		MEDIUM,		MEDIUM] },
			{ time: 400,	values: [HIGH,		MEDIUM,		MEDIUM] },
			{ time: 400,	values: [MEDIUM,	MEDIUM,		MEDIUM] }
		],
		shake_x_400_2: [
			{ time: 0,		values: [MEDIUM,	MEDIUM,		MEDIUM] },
			{ time: 2000,	values: [MEDIUM,	MEDIUM,		MEDIUM] },

			{ time: 400,	values: [LOW,		MEDIUM,		MEDIUM] },
			{ time: 400,	values: [HIGH,		MEDIUM,		MEDIUM] },
			{ time: 400,	values: [LOW,		MEDIUM,		MEDIUM] },
			{ time: 400,	values: [HIGH,		MEDIUM,		MEDIUM] },
			{ time: 400,	values: [MEDIUM,	MEDIUM,		MEDIUM] },

			{ time: 1000,	values: [MEDIUM,	MEDIUM,		MEDIUM] },

			{ time: 400,	values: [LOW,		MEDIUM,		MEDIUM] },
			{ time: 400,	values: [HIGH,		MEDIUM,		MEDIUM] },
			{ time: 400,	values: [LOW,		MEDIUM,		MEDIUM] },
			{ time: 400,	values: [HIGH,		MEDIUM,		MEDIUM] },
			{ time: 400,	values: [MEDIUM,	MEDIUM,		MEDIUM] }
		],
		shake_x_400_3: [
			{ time: 0,		values: [MEDIUM,	MEDIUM,		MEDIUM] },
			{ time: 2000,	values: [MEDIUM,	MEDIUM,		MEDIUM] },

			{ time: 400,	values: [LOW,		MEDIUM,		MEDIUM] },
			{ time: 400,	values: [HIGH,		MEDIUM,		MEDIUM] },
			{ time: 400,	values: [LOW,		MEDIUM,		MEDIUM] },
			{ time: 400,	values: [HIGH,		MEDIUM,		MEDIUM] },
			{ time: 400,	values: [MEDIUM,	MEDIUM,		MEDIUM] },

			{ time: 1000,	values: [MEDIUM,	MEDIUM,		MEDIUM] },

			{ time: 400,	values: [LOW,		MEDIUM,		MEDIUM] },
			{ time: 400,	values: [HIGH,		MEDIUM,		MEDIUM] },
			{ time: 400,	values: [LOW,		MEDIUM,		MEDIUM] },
			{ time: 400,	values: [HIGH,		MEDIUM,		MEDIUM] },
			{ time: 400,	values: [MEDIUM,	MEDIUM,		MEDIUM] },

			{ time: 1000,	values: [MEDIUM,	MEDIUM,		MEDIUM] },

			{ time: 400,	values: [LOW,		MEDIUM,		MEDIUM] },
			{ time: 400,	values: [HIGH,		MEDIUM,		MEDIUM] },
			{ time: 400,	values: [LOW,		MEDIUM,		MEDIUM] },
			{ time: 400,	values: [HIGH,		MEDIUM,		MEDIUM] },
			{ time: 400,	values: [MEDIUM,	MEDIUM,		MEDIUM] }
		],

		shake_right_left: [
			{ time: 0,		values: [MEDIUM,	MEDIUM,		MEDIUM] },
			{ time: 2000,	values: [MEDIUM,	MEDIUM,		MEDIUM] },
			{ time: 200,	values: [HIGH,		LOW,		MEDIUM] },
			{ time: 200,	values: [LOW,		HIGH,		MEDIUM] },
			{ time: 200,	values: [HIGH,		LOW,		MEDIUM] },
			{ time: 200,	values: [LOW,		HIGH,		MEDIUM] },
			{ time: 200,	values: [MEDIUM,	MEDIUM,		MEDIUM] }
		]
	},
	cap: {
		slow_touch: [
			{ time: 0,		values: [LOW] },
			{ time: 5000,	values: [HIGH] },
			{ time: 5000,	values: [LOW] }
		],
		quick_touch: [
			{ time: 0,		values: [LOW] },
			{ time: 1000,	values: [HIGH] },
			{ time: 1000,	values: [LOW] }
		]
	}
};
