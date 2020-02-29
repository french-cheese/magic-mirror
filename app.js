
/**
 * Module dependencies.
 */

var routes = require('./routes');
var user = require('./routes/user');
var calendar = require('./routes/calendar');
var controller = require('./routes/controller');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var errorhandler = require('errorhandler');
var morgan = require('morgan');

var path = require('path');

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//app.use(express.favicon());
app.use(morgan('dev'));
//app.use(express.json());
//app.use(express.urlencoded());
//app.use(express.methodOverride());
//app.use(express.session({ secret: 'your secret here' }));
//app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(errorhandler());
}

app.get('/', routes.index);
app.get('/calendar', calendar.calendar);
app.get('/users', user.list);
app.get('/controller', controller.controller);

var mirror = null;

io.on('connection', function(socket){
    console.log('A user connected');
    socket.on('disconnect', function(){

        if(socket == mirror){
            console.log('Mirror disconnected');
            mirror = null;
        }else{
            console.log('User disconnected');
        }
    });
    socket.on('source-switch', function(source){
        console.log("Changement de source d'info : "+source);
        if(mirror != null){
            mirror.emit('feed', source);
        }
    });
    socket.on('mirror-connected', function(msg){
        mirror = socket;
        console.log("Mirror connected");
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});