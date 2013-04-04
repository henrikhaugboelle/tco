
// visualize vibration

// check out real values (limits and so on)

// try to implement something reasonable
// acc: distance between xmin/xmax etc -> magnitude

// states -> two states
// persistence

// reimplement "stop"?

// in: accelerometer + touch
// out: light + vibration

function pad(num) {
    var s = num+"";
    while (s.length < 3) s = "0" + s;
    return s;
}

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
		shake_left_right: [
			{ time: 0,		values: [MEDIUM,	MEDIUM,		MEDIUM] },
			{ time: 2000,	values: [MEDIUM,	MEDIUM,		MEDIUM] },
			{ time: 200,	values: [LOW,		HIGH,		MEDIUM] },
			{ time: 200,	values: [HIGH,		LOW,		MEDIUM] },
			{ time: 200,	values: [LOW,		HIGH,		MEDIUM] },
			{ time: 200,	values: [HIGH,		LOW,		MEDIUM] },
			{ time: 200,	values: [MEDIUM,	MEDIUM,		MEDIUM] }
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

 var points = [];

var converter = new Converter({
	calculator: new CalculatorAverage()
});

converter.emit(function(values) {
	if (values) {
		$('#average-color').css('background', 'rgba(' + values[0] + ',' + values[1] + ',' + values[2] + ',' + (values[3] / 255) + ')');
		
		points.push(values[3]);

		for (var v in values) values[v] = pad(values[v]);
		$('#average-numbers').html(values.join(' '));
	}
});

var sensors = {};

sensors.acc = new Accelerometer({
	ranger: new Ranger({ min: 0, max: 255 }),
	distortor: new Distortor({ spectrum: 4 })
});

sensors.cap = new CapacitiveSensor({
	ranger: new Ranger({ min: 0, max: 255 }),
	distortor: new Distortor({ spectrum: 8 })
});

var arduino = new Arduino();

arduino.addSensor('acc', sensors.acc);
arduino.addSensor('cap', sensors.cap);

arduino.emit(function(values) {
	converter.push(values);
});

converter.start();
arduino.start();

var ArduinoViewModel = function() {
	this.speed = ko.observable(arduino.speed);

	this.speed.subscribe(function(newValue) {
		arduino.setSpeed(newValue);
	});

	this.startAll = function() {
		console.log("start all");
		for (var key in sensors) {
			sensors[key].start();
		}
	};

	this.stopAll = function() {
		console.log("stop all");
		for (var key in sensors) {
			sensors[key].stop();
		}
	};
};

var SensorViewModel = function(key) {
	var sensor = sensors[key];

	this.speed = ko.observable(sensor.speed);
	this.repeat = ko.observable(sensor.repeat);
	this.sequences = ko.observableArray(_.keys(sequences[key]));
	this.sequence = ko.observable(sequences[key][_.keys(sequences[key])[0]]);

	this.distortion = ko.observable(sensor.distortor.spectrum);

	this.speed.subscribe(function(newValue) {
		console.log(key + " speed: " + newValue);
		sensor.setSpeed(newValue);
	});

	this.repeat.subscribe(function(newValue) {
		console.log(key + " repeat: " + newValue);
		sensor.setRepeat(newValue);
	});

	this.sequence.subscribe(function(newValue) {
		console.log(key + " sequence: " + newValue);
		sensor.setSequence(sequences[key][newValue]);
	});

	this.distortion.subscribe(function(newValue) {
		console.log(key + " distortion: " + newValue);
		sensor.distortor.setSpectrum(newValue);
	});

	this.start = function() {
		console.log(key + " start");
		sensor.start();
	};

	this.stop = function() {
		console.log(key + " stop");
		sensor.stop();
	};
};

$(document).ready(function() {
	var accViewModel = new SensorViewModel('acc');
	var capViewModel = new SensorViewModel('cap');

	ko.applyBindings(new ArduinoViewModel(), $('#arduino')[0]);
	ko.applyBindings(accViewModel, $('#accelerometer')[0]);
	ko.applyBindings(capViewModel, $('#capacitive')[0]);

	drawVibration();
});

function drawVibration() {
    var refresh_interval = 50; // update display every 500ms
    var points_max = 200;
    
    var draw = function() {
        if (points.length > points_max) {
        	points.splice(0, points.length - points_max);
        }

        $('#average-vibration').sparkline(points, { width: 570, height: 142 });
        
        setTimeout(draw, refresh_interval);
    }
    // We could use setInterval instead, but I prefer to do it this way
    setTimeout(draw, refresh_interval); 
};