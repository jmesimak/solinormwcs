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
	console.log(wagesArray);

	calculateWageForTheDay(wagesArray[11]);

}

function calculateWageForTheDay(dayArray) {
	var date = dayArray[2].replace(/\./g, '-');
	var entry = moment(date + " " + dayArray[3], "DD-MM-YYYY HH:mm");
	var leaving = moment(date + " " + dayArray[4], "DD-MM-YYYY HH:mm");
	if (leaving < entry) leaving.add(1, 'days');
	var morningMarker = moment(date + " " + "06:00", "DD-MM-YYYY HH:mm");
	var eveningMarker = moment(date + " " + "18:00", "DD-MM-YYYY HH:mm");
	var wage = 0;
	if (entry >= morningMarker && leaving <= eveningMarker && !overtime(entry, leaving)) wage += calculateNormalWage(leaving.diff(entry, 'minutes'));
	if ((entry < morningMarker || leaving > eveningMarker) && !overtime(entry, leaving)) wage += calculateWageWhenCompensation(entry, leaving, morningMarker, eveningMarker);
	if (overtime(entry, leaving)) wage += 
	console.log(wage);
}

function calculateWageWhenOvertime(entry, leaving, morningMarker, eveningMarker) {

	var totalMinutes = leaving.diff(entry, 'minutes');
	var normalMinutes = 0;
	var normalCompensatedMinutes = 0;
	var normalTierOneMinutes = 0;
	var normalTierTwoMinutes = 0;
	var normalTierThreeMinutes = 0;

	var mornDiff =morningMarker.diff(entry, 'minutes');

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

}

function overtime(entry, leaving) {
	return leaving.diff(entry, 'minutes') > 800;
}

function calculateNormalWage(minutes) {
	return minutes / 60 * 3.75;
}


function calculateWageWhenCompensation(entry, leaving, morningMarker, eveningMarker) {
	var normalMins = leaving.diff(entry, 'minutes');
	var compMins = 0;
	var diffMornMins = morningMarker.diff(entry, 'minutes');
	var diffEveningMins = leaving.diff(eveningMarker, 'minutes');
	if (diffMornMins > 0) {
		compMins += diffMornMins;
		normalMins -= diffMornMins;
	}
	if (diffEveningMins > 0) {
		compMins += diffEveningMins;
		normalMins -= diffEveningMins;
	}
	return compMins/60*4.90+calculateNormalWage(normalMins);
}

readWagesAsArray('03', handleWages);
