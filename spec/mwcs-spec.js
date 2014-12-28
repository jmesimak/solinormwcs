var mwcs = require('../mwcs');

describe("wage properly calculated for a day", function() {

  function roundWage(wage) {
    return Math.round(wage * 100) / 100
  }

	it("should be able to calculate the correct wage for a standard 480 minute workday with no compensation time.", function() {
		var wage = mwcs.calculateWageForTheDay([ 'Janet Java', '1', '7.3.2014', '9:00', '17:00' ]);
		expect(roundWage(wage)).toEqual(30);
	});

	it("should be able to calculate the correct wage for a day with morning compensation e.g. entry pre 06:00", function() {
		var wage = mwcs.calculateWageForTheDay([ 'Larry Lolcode', '3', '6.3.2014', '5:00', '10:00' ]);
		expect(roundWage(wage)).toEqual(19.9);
	});

	it("should be able to calculate the correct wage for a day with overtime but no compensation", function() {
		var wage = mwcs.calculateWageForTheDay([ 'Janet Java', '1', '5.3.2014', '8:00', '16:30' ]);
		expect(roundWage(wage)).toEqual(32.34);
	});

	it("should be able to calculate the correct wage for a day with overtime and compensation", function() {
		var wage = mwcs.calculateWageForTheDay([ 'Janet Java', '1', '20.3.2014', '10:00', '19:00' ]);
		expect(roundWage(wage)).toEqual(36.13);
	});

	it("should be able to calculate the wage for someone who is totally bonkers and working from 10pm to 6am", function() {
		var wage = mwcs.calculateWageForTheDay([ 'Scott Scala', '2', '24.3.2014', '22:00', '6:00' ]);
		expect(roundWage(wage)).toEqual(39.2);
	});
	
	it("should be able to calculate the wage for a day when the wage is doubled e.g. over 12 hours", function() {
		var wage = mwcs.calculateWageForTheDay([ 'Janet Java', '1', '5.3.2014', '10:00', '01:00' ]);
		expect(roundWage(wage) >= 86.35).toBeTruthy();
	});

  it("should be able to calc wage for 23-02", function() {
    var wage = mwcs.calculateWageForTheDay(['Bob', '10', '1.1.2014', '23:00', '02:00']);
    expect(roundWage(wage) >= 14.7).toBeTruthy();
  });

  it("should be able to calc wage for 19-09", function() {
    var wage = mwcs.calculateWageForTheDay(['Bob', '10', '1.1.2014', '19:00', '09:00']);
    expect(roundWage(wage)).toEqual(79.43);
  });


	// it("", function() {
	// 	var wage = mwcs.calculateWageForTheDay();
	// 	expect(wage).toEqual();
	// });

});

