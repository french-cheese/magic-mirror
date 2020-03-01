
var http = require('http');

function getQuote(req, res){
	http.get("http://quotes.rest/qod", function (ajaxRes) {
		console.log('STATUS: ' + ajaxRes.statusCode);
		console.log('HEADERS: ' + JSON.stringify(ajaxRes.headers));
		res.charset = 'utf8';
		var data = '';
		ajaxRes.on('data', function (chunk) {
			data += chunk;
		})
		ajaxRes.on('end', () => {
			console.log('BODY: ' + data);
			res.send(data);
		});
	});
};

exports.quote = function (req, res) {
	getQuote(req, res);
};
