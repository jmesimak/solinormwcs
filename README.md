# Monthly Wage Calculation System

A prototypish full-stack application for parsing .csv-files that contain the work shifts of a company's employees. The example output is a month's pay for each employee.

## Technologies used
Node.JS with the following modules:
    - Moment.js for better time handling
    - accounting.js for basic currency handling
    - Express as a minimalist web framework
    - Jasmine-Node for testing
    - node-csv to help with parsing the csv
    - Lo-Dash because it's neat

As a cherry on top, Angular for the front-end.

### Things to consider
JavaScript's numbers are 64-bit floating points which means that there will be errors when working with basic arithmetic operations. The errors are within acceptable bounds in this use case.

#### Running the app
```
git clone https://github.com/jmesimak/solinormwcs.git
cd solinormwcs
npm install
node app.js
```

The application should now be running in your localhost's port 3000. You can run tests by issuing jasmine-node spec/mwcs-spec.js however jasmine-node should be installed globally unless you are working with nvm.