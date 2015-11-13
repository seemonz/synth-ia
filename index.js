var express = require('express');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(8080);
app.use(express.static('public'));

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

// array of players in session
var players = [];

// arr of player 1's note presses
var musicEvents1 = [];

// arr of player 2's note presses
var musicEvents2 = [];

// socket io
io.on('connection', function (socket) {
  console.log('user connected');
  players.push(socket);
  if (players.length === 1) {
    startMusic();
  }
  
  socket.on('disconnect', function(socket) {
    console.log('user disconnected');
  });

  // play tempo
  function startMusic() {
    setInterval(function(){
      io.emit('button click');
      if (musicEvents1.length > 0) {
        io.emit('play1')
        musicEvents1 = [];
      }
      if (musicEvents2.length > 0) {
        io.emit('play2')
        musicEvents2 = [];
      }
    }, 200);
  }

  // syncs button clicks to activating each second
  socket.on('play1', function(){
    console.log('clicked play');
    musicEvents1.push(1);
    console.log(musicEvents1);
  });

  socket.on('play2', function(){
    musicEvents2.push(1);
  });
});


