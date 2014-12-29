var csv = require('csv');
var fs = require('fs');
var _ = require('lodash');
var accounting = require('accounting');
var moment = require('moment');

var OVERTIME_MULTIPLIERS = [1.25, 1.50, 2.00];
var BASEWAGE = 3.75;
var COMPENSATION = 1.15;

function getWagesForMonth(year, month, callback) {
  readWagesAsArray(year, month, function(data) {
    callback(handleWages(data));
  });
}

function readWagesAsArray(year, month, callback) {
	fs.readFile('monthly_wages/HourList'+year+month+'.csv', 'utf8', function(err, data) {
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

  _.map(wageObj, function(sum, index) {
    wageObj[index] = accounting.formatMoney(sum);
  });

  return wageObj;
}

function createDate(date, time) {
  return moment(date + " " + time, "DD-MM-YYYY HH:mm");
}

function calculateWageForTheDay(dayArray) {
	var date = dayArray[2].replace(/\./g, '-');
  var entry = createDate(date, dayArray[3]);
	var leaving = createDate(date, dayArray[4]);
	if (leaving < entry) leaving.add(1, 'days');
	var totalMinutes = leaving.diff(entry, 'minutes');
	return totrec(entry, totalMinutes, date, 0, 1);
}

function eveningPay(time) {
  var date = time.get("date")+"."+(time.get("month")+1)+"."+time.get("year");
  return time < createDate(date, "06:00") || time >= createDate(date, "18:00");
}

function getMultiplier(i) {
    var multiplier = 1;
    if (i > 32) multiplier = OVERTIME_MULTIPLIERS[0];
    if (i > 40) multiplier = OVERTIME_MULTIPLIERS[1];
    if (i > 48) multiplier = OVERTIME_MULTIPLIERS[2];
    return multiplier;
}

/*
* Recursively calculate the total wage for a given work shift in 15 minute increments.
*/
function totrec(begin, total, date, wage, i) {
  if (i <= total/15) {
    var comp = eveningPay(begin);
    return totrec(begin.add(15, "minutes"), 
                  total, 
                  date, 
                  wage += 0.25*(BASEWAGE+(comp*COMPENSATION))*getMultiplier(i), 
                  i+1);
  }
  return wage;
}

/*
* getWagesForMonth is the primary interface for the web server.
* calculateWageForTheDay is exported for testing purposes (jasmine-node).
*/
module.exports = {
    calculateWageForTheDay: calculateWageForTheDay,
    getWagesForMonth: getWagesForMonth
};
