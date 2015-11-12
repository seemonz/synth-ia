var express = require('express');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(8080);
app.use(express.static('public'));

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});
// socket io
io.on('connection', function (socket) {
  console.log('user connected');

  socket.on('disconnect', function(socket) {
    console.log('user disconnected');
  });

  // gets the the button click from the user and echos it back out to everyone
  socket.on('button click', function(){
    console.log('click');
    io.emit('button click');
  });
});
