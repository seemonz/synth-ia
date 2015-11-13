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
    var timeZero = Date.now();
    setInterval(function() {
      if (Date.now() >= timeZero + 1000){
        timeZero = Date.now();
        io.emit('button click', timeZero);
        console.log(timeZero);
      }
    }, 1);
  });

  // syncs button clicks to activating each second
  socket.on('play', function(){
    var timeZero = Date.now();
    var timer = setInterval(function(){
      if (Date.now() >= timeZero + 1000){
        io.emit('play');
        clearInterval(timer);
      }
    }, 50);
  });
});

// basic counter on seconds, broken though
function counter(){
  var timeZero = Date.now();
  var count = 0;
  while (timeZero < Date.now() + 1000000) {
    if (Date.now() >= timeZero + 1000) {
      timeZero = Date.now();
      count += 1;
      console.log(count);
      console.log(timeZero);
    }
  }
}
