var csv = require('csv');
var fs = require('fs');
var _ = require('lodash');
var accounting = require('accounting');
var moment = require('moment');

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
    if (i > 32) multiplier = 1.25;
    if (i > 40) multiplier = 1.50;
    if (i > 48) multiplier = 2.00;
    return multiplier;
}

function totrec(begin, total, date, wage, i) {
  if (i <= total/15) {
    var comp = eveningPay(begin);
    return totrec(begin.add(15, "minutes"), total, date, wage += 0.25*(3.75+(comp*1.15))*getMultiplier(i), i+1);
  }
  return wage;
}

module.exports = {
    calculateWageForTheDay: calculateWageForTheDay,
    getWagesForMonth: getWagesForMonth
};
