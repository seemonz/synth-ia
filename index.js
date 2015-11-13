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
var playerNotes1 = [];
var playerNotes2 = [];

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
      if (playerNotes1.length > 0) {
        io.emit('note1', { note: playerNotes1[0] });
        playerNotes1 = [];
      }
      if (playerNotes2.length > 0) {
        io.emit('note2', { note: playerNotes2[0] });
        playerNotes2 = [];
      }
    }, tempo);
  }

  // syncs button clicks to activating each second
  socket.on('note1', function(note){
    console.log('clicked play');
    playerNotes1.push(note);
  });

  socket.on('note2', function(note){
    playerNotes2.push(note);
  });
});
