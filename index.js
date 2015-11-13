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

// arr of player's note presses
var playerOneNotes = [];
var playerTwoNotes = [];

// socket io
io.on('connection', function (socket) {

  console.log('user connected');
  socket.on('disconnect', function(socket) {
    console.log('user disconnected');
  });

  var tempo = 500;
  players.push(socket);
  if (players.length === 1) {
    startTempo(tempo);
  }

  // Synth-ia starts the tempo all players are syncopated to, where the tempo is set by tempo.
  // Sends play note event, bound by tempo, to all players if a player has played a note
  function startTempo(tempo) {
    setInterval(function(){
      io.emit('tempo');
      if (playerOneNotes.length > 0) {
        io.emit('playerOnePlay', { note: playerOneNotes[0] });
        playerOneNotes = [];
      }
      if (playerTwoNotes.length > 0) {
        io.emit('playerTwoPlay', { note: playerTwoNotes[0] });
        playerTwoNotes = [];
      }
    }, tempo);
  }

  // syncs button clicks to activating each second
  socket.on('playerOnePlay', function(note){
    console.log('clicked play');
    playerOneNotes.push(note);
  });

  socket.on('playerTwoPlay', function(note){
    playerTwoNotes.push(note);
  });
});
