var express = require('express');
var app = express();
var mwcs = require('./mwcs.js');
var fs = require('fs');

app.get('/', function(req, res) {
	res.sendFile('front/index.html', {root: __dirname });
});

app.get('/wages/:year/:month', function(req, res) {
  mwcs.getWagesForMonth(req.params.year, req.params.month, function(data) {
    res.json(data);
  })
});

app.get('/js/*', function(req, res) {
	res.sendFile('front/'+req.originalUrl, {root: __dirname });
});

app.get('/wages', function(req, res) {

  fs.readdir('./monthly_wages', function(err, files) {
    
    var ret = [];
    files.forEach(function(file) {
      var year = file.substring(8, 12);
      var month = file.substring(12, 14);
      ret.push(year+'/'+month);
    });

    res.json(ret);
  });

});

var server = app.listen(3000, function() {

	var host = server.address().address;
	var port = server.address().port;

});