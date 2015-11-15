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
var playerThreeNotes = [];
var playerFourNotes = [];

// tempo
var tempo = 125;

function getRandomRhythm(){
  return Math.floor(Math.random() * 8) + 1;
}

// defining random rhythm on refresh
var rDelay1 = getRandomRhythm();
var rDelay2 = getRandomRhythm();
var rDelay3 = getRandomRhythm();

// socket io
io.on('connection', function (socket) {

  console.log('user connected');
  socket.on('disconnect', function(socket) {
    console.log('user disconnected');
  });

  // detect player, start music
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
      rhythmCounter += (tempo/1000);
      if (rhythmCounter === 1) {
        // triggerRhythms(tempo, rDelay1, rDelay2, rDelay3);
        rhythmCounter = 0;
      }
      if (playerOneNotes.length > 0) {
        io.emit('currentPlayer', { note: playerOneNotes[0] });
        playerOneNotes = [];
      }
      if (playerTwoNotes.length > 0) {
        io.emit('playerTwoPlay', { note: playerTwoNotes[0] });
        playerTwoNotes = [];
      }
      if (playerThreeNotes.length > 0) {
        io.emit('playerThreePlay', { note: playerThreeNotes[0] });
        playerThreeNotes = [];
      }
      if (playerFourNotes.length > 0) {
        io.emit('playerFourPlay', { note: playerFourNotes[0] });
        playerFourNotes = [];
      }
    }, tempo);
  }

  // rhythm randomizer
  function triggerRhythms(tempo, r1, r2, r3) {

    io.emit('rhythm2');
    rhythmGenerator('rhythm1', r1 * tempo);
    rhythmGenerator('rhythm2', r3 * tempo);

  }

  function rhythmGenerator(eventName, timeoutDuration) {
    return setTimeout(function() {
      io.emit(eventName);
    }, timeoutDuration);
  }

  // syncs button clicks to activating each second
  socket.on('currentPlayer', function(note){
    console.log('clicked play');
    playerOneNotes.push(note);
  });

  socket.on('playerTwoPlay', function(note){
    playerTwoNotes.push(note);
  });

  socket.on('playerThreePlay', function(note){
      playerThreeNotes.push(note);
    });

  socket.on('playerFourPlay', function(note){
    playerFourNotes.push(note);
  });

});
