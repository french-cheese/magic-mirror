/**
 * Created by vis on 27/05/15.
 */

// Set the url of the calendar feed.
var url = 'http://www.reddit.com/';
//var url = 'D:\\Temp\\basic.ics';
var local = 'D:\\Temp\\vic.ics';

var https = require('https');

/*****************************************/

exports.calendar = function (req, res) {
	get_url(req, res, url, local);
};

// Run the helper function with the desired URL and echo the contents.

// Define the helper function that retrieved the data and decodes the content.
function get_url(req, res, url, local) {
	https.get(url, function (ajaxRes) {
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
}
