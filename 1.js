var express = require('express');
var app = express();

app.get('/log/:key/:value', (req, res) => {
	var key = req.params.key;
	var value = req.params.value;

	console.log('');
	console.log(`# ${new Date()}`)
	console.log(`* ${key}:`);
	console.log(`    ${value}`);
	
	res.status(200).end();
})


var server = app.listen(1678, '0.0.0.0', () => {
  var host = server.address().address;
  var port = server.address().port;
  console.log('logReciver Server Running ...');


	
});