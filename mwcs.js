var csv = require('csv');
var fs = require('fs');
var _ = require('lodash');
var accounting = require('accounting');
var moment = require('moment');

function readWagesAsArray(month, callback) {
	fs.readFile('monthly_wages/HourList2014'+month+'.csv', 'utf8', function(err, data) {
		csv.parse(data, function(err, wages) {
			callback(_.rest(wages));
		});
	});
}

function handleWages(wagesArray) {
  var sum = 0;
  var wageObj = {};
  _.map(wagesArray, function(day) {
    if (!wageObj[day[0]]) wageObj[day[0]] = 0;
    wageObj[day[0]] += calculateWageForTheDay(day);
  });
	console.log(wageObj);
}

function calculateWageForTheDay(dayArray) {
	var date = dayArray[2].replace(/\./g, '-');
	var entry = moment(date + " " + dayArray[3], "DD-MM-YYYY HH:mm");
	var leaving = moment(date + " " + dayArray[4], "DD-MM-YYYY HH:mm");
	if (leaving < entry) leaving.add(1, 'days');
	var morningMarker = moment(date + " " + "06:00", "DD-MM-YYYY HH:mm");
	var eveningMarker = moment(date + " " + "18:00", "DD-MM-YYYY HH:mm");
	var totalMinutes = leaving.diff(entry, 'minutes');

	var timeSegments = splitMinutesToOvertimeSegments(totalMinutes);
	var wage = 0;
	for (var i = 0; i < timeSegments.length; i++) {
		var begin = entry.clone();
		begin.add(sumBeforeIndex(timeSegments, i), 'minutes');
		var end = begin.clone();
		end.add(timeSegments[i], 'minutes');
		wage += calculateWageForSegment(begin, end, i, morningMarker, eveningMarker);
	}
	return wage;
}

function calculateWageForSegment(begin, end, multiplierIndex, morningMarker, eveningMarker) {
	var basewage = 3.75;
	var compensation = 1.15;
	var multiplierArray = [1.00, 1.25, 1.50, 2.00];
	var compensatedMinutes = 0;

	if (morningMarker.diff(begin, 'minutes') > 0) compensatedMinutes += morningMarker.diff(begin, 'minutes');
	if (end.diff(eveningMarker, 'minutes') > 0) compensatedMinutes += end.diff(eveningMarker, 'minutes');
	var normalMinutes = end.diff(begin, 'minutes') - compensatedMinutes;
	var compensatedHours = compensatedMinutes/60.00;
	var normalHours = normalMinutes/60;
	var wage = 0;
	wage += compensatedHours * (basewage + compensation) * multiplierArray[multiplierIndex];
	wage += normalHours * basewage * multiplierArray[multiplierIndex];
	return wage;
}

function sumBeforeIndex(array, index) {
	var sum = 0;
	for (var i = 0; i < index; i++) {
		sum += array[i];
	}
	return sum;
}

function splitMinutesToOvertimeSegments(minutes) {
	var segments = [];
	if (minutes <= 480) {
		segments.push(minutes);
		return segments;
	}
	segments.push(480);
	var leftover = minutes - 480;
	// 25%
	if (leftover <= 120) {
		segments.push(leftover);
		return segments;
	}

	segments.push(120);
	leftover -= 120;
	// 50%
	if (leftover <= 120) {
		segments.push(leftover);
		return segments;
	}

	segments.push(120);
	// 100%
	leftover -= 120;
	segments.push(leftover);
	return segments;
}

module.exports = {
    splitMinutesToOvertimeSegments: splitMinutesToOvertimeSegments,
    sumBeforeIndex: sumBeforeIndex,
    calculateWageForTheDay: calculateWageForTheDay
};

readWagesAsArray('03', handleWages);