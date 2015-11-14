var express = require('express');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(8080);
app.use(express.static('public'));
app.use(express.static('./bundle.js'));


app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

// array of players in session
var players = [];

// arr of player's note presses
var playerOneNotes = [];
var playerTwoNotes = [];

function getRandomRhythm(){
  return Math.floor(Math.random() * 8) + 1;
}

// defining random rhythm on refresh
var rhythm1 = getRandomRhythm();
var rhythm2 = getRandomRhythm();
var rhythm3 = getRandomRhythm();

// socket io
io.on('connection', function (socket) {

  console.log('user connected');
  socket.on('disconnect', function(socket) {
    console.log('user disconnected');
  });

  var tempo = 125;
  players.push(socket);
  if (players.length === 1) {
    startTempo(tempo);
  }

  // Synth-ia starts the tempo all players are syncopated to, where the tempo is set by tempo.
  // Sends play note event, bound by tempo, to all players if a player has played a note
  var rhythmCounter = 0;
  function startTempo(tempo) {
    setInterval(function(){
      io.emit('tempo');
      console.log(Date.now());
      rhythmCounter += 0.125;
      if (rhythmCounter === 1) {
        rhythmGen(tempo, rhythm1, rhythm2, rhythm3);
        rhythmCounter = 0;
      }
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


  // rhythm
  function rhythmGen(tempo, rhythm1, rhythm2, rhythm3){
    // io.emit('rhythm1');
    console.log('rhythm' + Date.now());
    io.emit('rhythm2');
    setTimeout(function(){
      io.emit('rhythm1');
    }, rhythm1 * tempo);
    // setTimeout(function(){
    //   io.emit('rhythm2');
    // }, rhythm2 * tempo);
    setTimeout(function(){
      io.emit('rhythm2');
    }, rhythm3 * tempo);
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
