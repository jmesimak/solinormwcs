var mwcs = require('../mwcs');


describe("splitting minutes", function() {

	it("should be able to split a standard workday correctly", function() {
		var minutesArray = mwcs.splitMinutesToOvertimeSegments(480);
		expect(minutesArray).toEqual([480]);
	});

	it("should be able to split a 500 min workday correctly", function() {
		var minutesArray = mwcs.splitMinutesToOvertimeSegments(500);
		expect(minutesArray).toEqual([480, 20]);
	});

	it("should be able to split a 600 min workday correctly", function() {
		var minutesArray = mwcs.splitMinutesToOvertimeSegments(600);
		expect(minutesArray).toEqual([480, 120]);
	});

	it("should be able to split a 720 min workday correctly", function() {
		var minutesArray = mwcs.splitMinutesToOvertimeSegments(720);
		expect(minutesArray).toEqual([480, 120, 120]);
	});

	it("should be able to split a 800 min workday correctly", function() {
		var minutesArray = mwcs.splitMinutesToOvertimeSegments(800);
		expect(minutesArray).toEqual([480, 120, 120, 80]);
	});

	it("should be able to split a ohmygodsomanyminutes workday correctly", function() {
		var minutesArray = mwcs.splitMinutesToOvertimeSegments(1820);
		expect(minutesArray).toEqual([480, 120, 120, 1100]);
	});

});

describe("summing time segments", function() {

	it("a simple test for a simple function", function() {
		var sum = mwcs.sumBeforeIndex([480, 120, 120, 120], 2);
		expect(sum).toEqual(600);
	});

});

describe("wage properly calculated for a day", function() {

	it("should be able to calculate the correct wage for a standard 480 minute workday with no compensation time.", function() {
		var wage = mwcs.calculateWageForTheDay([ 'Janet Java', '1', '7.3.2014', '9:00', '17:00' ]);
		expect(wage).toEqual(30);
	});

	it("should be able to calculate the correct wage for a day with morning compensation e.g. entry pre 06:00", function() {
		var wage = mwcs.calculateWageForTheDay([ 'Larry Lolcode', '3', '6.3.2014', '5:00', '10:00' ]);
		expect(wage).toEqual(19.9);
	});

});