// in: accelerometer + touch
// out: light + vibration

// sequences
// states / persistence

// check out real values (limits and so on)

function pad(num) {
    var s = num+"";
    while (s.length < 3) s = "0" + s;
    return s;
}

// var converter = new AverageConverter();
// var converter = new FirstConverter();
// var converter = new PrototypeConverter();
// var converter = new SecondConverter();
// var converter = new ThirdConverter();
// var converter = new ColorConverter();
// var converter = new WalkConverter();
var converter = new ColorConverter();

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

var ArduinoViewModel = function() {
	this.speed = ko.observable(arduino.speed);
	this.running = ko.observable('');

	this.speed.subscribe(function(newValue) {
		console.log("arduino speed: " + newValue);
		arduino.setSpeed(newValue);
	});

	this.start = function() {
		console.log("arduino start");
		arduino.start();
		this.running('running');
	};

	this.stop = function() {
		console.log("arduino stop");
		arduino.stop();
		this.running('');
	};
};

var SensorsViewModel = function() {
	this.running = ko.observable('');

	this.start = function() {
		console.log("start all");
		arduino.start();
		converter.start();
		for (var key in sensors) {
			sensors[key].start();
		}
		this.running('running');
	};

	this.stop = function() {
		console.log("stop all");
		for (var key in sensors) {
			sensors[key].stop();
		}
		converter.stop();
		arduino.stop();
		this.running('');
	};
};

var ConverterViewModel = function() {
	this.running = ko.observable('');

	this.start = function() {
		console.log("converter start");
		arduino.start();
		converter.start();
		this.running('running');
	};

	this.stop = function() {
		console.log("converter stop");
		converter.stop();
		arduino.stop();
		this.running('');
	};
};

var SensorViewModel = function(key) {
	var sensor = sensors[key];

	this.running = ko.observable('');

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
		arduino.start();
		converter.start();
		sensor.start();
		this.running('running');
	};

	this.stop = function() {
		console.log(key + " stop");
		converter.stop();
		arduino.stop();
		sensor.stop();
		this.running('');
	};
};

var ValuesViewModel = function() {
	this.numbers = ko.observable('000 000 000 000');
};
var valuesViewModel = new ValuesViewModel();

var ColorViewModel = function() {
	this.color1 = ko.observable('rgba(0, 0, 0, 0)');
	this.color2 = ko.observable('rgba(0, 0, 0, 0)');
};
var colorViewModel = new ColorViewModel();

var MaxViewModel = function() {
	this._max = 0;
	this.number = ko.observable(0);
	this.max = ko.computed({
		read: function() {
			if (this.number() > this._max) this._max = this.number();

			return this._max;
		},
		write: function(value) {
			this._max = value;
		},
		owner: this		
	});

	this.clear = function() {
		this.max(0);
	};
};
maxViewModel = new MaxViewModel();

var GraphViewModel = function() {
	this.limit = 50;

	this.points1 = ko.observableArray([]);

	this.points1.subscribe(function(newValue) {
		if (newValue.length > this.limit) {
			newValue.shift();
		}

        $('#graph-1').sparkline(newValue, { 
        	width: 570, 
        	height: 142,
        	lineColor: 'rgba(0, 0, 255, 0.8)',
        	fillColor: 'rgba(0, 0, 255, 0.2)' 
        });
	}, this);

	this.points2 = ko.observableArray([]);

	this.points2.subscribe(function(newValue) {
		if (newValue.length > this.limit) {
			newValue.shift();
		}

        $('#graph-2').sparkline(newValue, { 
        	width: 570, 
        	height: 142,
        	lineColor: 'rgba(255, 0, 0, 0.8)',
        	fillColor: 'rgba(255, 0, 0, 0.2)' 
        });
	}, this);

	this.points3 = ko.observableArray([]);

	this.points3.subscribe(function(newValue) {
		if (newValue.length > this.limit) {
			newValue.shift();
		}

        $('#graph-3').sparkline(newValue, { 
        	width: 570, 
        	height: 142,
        	lineColor: 'rgba(128, 255, 0, 0.8)',
        	fillColor: 'rgba(128, 255, 0, 0.2)' 
        });
	}, this);
};
var graphViewModel = new GraphViewModel();

var LogViewModel = function() {
	this.limit = 200;
	this.logs = ko.observableArray([]);

	this.logs.subscribe(function(newValue) {
		if (newValue.length > this.limit) {
			this.logs.pop();
		}
	}, this);

	this.clear = function() {
		this.logs([]);
	}
};
var logViewModel = new LogViewModel();

$(document).ready(function() {
	var accViewModel = new SensorViewModel('acc');
	var capViewModel = new SensorViewModel('cap');

	ko.applyBindings(new ArduinoViewModel(), $('#arduino')[0]);
	ko.applyBindings(new SensorsViewModel(), $('#sensors')[0]);
	ko.applyBindings(new ConverterViewModel(), $('#converter')[0]);

	ko.applyBindings(accViewModel, $('#accelerometer')[0]);
	ko.applyBindings(capViewModel, $('#capacitive')[0]);

	ko.applyBindings(valuesViewModel, $('#values')[0]);
	ko.applyBindings(colorViewModel, $('#color')[0]);
	ko.applyBindings(graphViewModel, $('#graphs')[0]);
	ko.applyBindings(maxViewModel, $('#max')[0]);
	ko.applyBindings(logViewModel, $('#log')[0]);
});

converter.emit(function(values, log) {
	if (values) {
		colorViewModel.color1('rgba(' + values[0] + ',' + values[1] + ',' + values[2] + ',' + 1 + ')');
		graphViewModel.points1.push(values[3]);
		graphViewModel.points2.push(values[4]);
		graphViewModel.points3.push(values[5]);
		// graphViewModel.points2.push(values[5]);
	
		// colorViewModel.color2('rgba(' + values[0] + ',' + values[1] + ',' + values[2] + ',' + (values[4] / 255) + ')');
		// graphViewModel.points2.push(values[4]);

		maxViewModel.number(values[3]);

		logViewModel.logs.unshift(values.join(' '));

		for (var v in values) values[v] = pad(values[v]);
		valuesViewModel.numbers(values.join(' '));

		// if (values[3] > maxViewModel.max()) maxViewModel.max(values[3]);

		// $('#average-numbers').html(values.join(' ') + " " + pad(parseInt(maxViewModel.max())));
		// $('#average-log').prepend('<div>'+values.join(' ')+'</div>');
	}
});

