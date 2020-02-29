/**
 * Created by vis on 27/05/15.
 */
var socket = io();

// This function emit the event on the socket that switches the news feed source.
function changeFeed(){
    socket.emit('source-switch', $('#sourceSelect option:selected').attr('value'));
}