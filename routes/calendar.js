/**
 * Created by vis on 27/05/15.
 */

// Set the url of the calendar feed.
var url = 'http://www.reddit.com/';
//var url = 'D:\\Temp\\basic.ics';
var local = 'D:\\Temp\\vic.ics';

var fs = require('fs');
var http = require('http');

/*****************************************/

exports.calendar = function (req, res) {
    get_url(req, res, url, local);
};

// Run the helper function with the desired URL and echo the contents.


// Define the helper function that retrieved the data and decodes the content.
function get_url(req, res, url, local) {
    //user agent is very necessary, otherwise some websites like google.com wont give zipped content
    /*
     var opts = array(
     'http'=>array(
     'method'=>"GET",
     'header'=>"Accept-Language: en-US,en;q=0.8rn" .
     "Accept-Encoding: gzip,deflate,sdchrn" .
     "Accept-Charset:UTF-8,*;q=0.5rn" .
     "User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:19.0) Gecko/20100101 Firefox/19.0 FirePHP/0.4rn",
     "ignore_errors" => true	 //Fix problems getting data
     ),
     //Fixes problems in ssl
     "ssl" => array(
     "verify_peer"=>false,
     "verify_peer_name"=>false
     )
     );

     $context = stream_context_create($opts);
     $content = @file_get_contents($url ,false,$context);
     if($content === FALSE) {
     echo "error";
     var_dump($content);
     }else{
     //If http response header mentions that content is gzipped, then uncompress it
     if(!$islocal){
     foreach($http_response_header as $c => $h)
     {
     if(stristr($h, 'content-encoding') and stristr($h, 'gzip'))
     {
     //Now lets uncompress the compressed data
     $content = gzinflate( substr($content,10,-8) );
     }
     }
     }

     return $content;
     */
    http.get(url,function (res) {
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res.headers));
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log('BODY: ' + chunk);

        }.done(function () {
                res.render('blank', { content: chunk })
            }));
    }).on('error', function (e) {
            console.log("Got error: " + e.message);
            console.log("Trying local file");
            fs.readFile(local, 'utf8', function (err, data) {
                if (err) {
                    return console.log(err);
                }
                res.render('blank', { content: data });
            });
        });
}