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
var players = {};
var playerIdSequence = 0;
var playerInstruments ={};
var tempoInitiationArr = [];

// arr of player's note presses, obj {note: int, id: int, instrument: folderName}
var playerNotes = {};

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
  var playerId = ++playerIdSequence;
  players[playerId] = socket.id;
  tempoInitiationArr.push(socket.id);

  console.log('player:' + playerId + ' connected, with socket.id of ' + socket.id);

  // send out player ID to client
  io.emit('assignPlayerId', { id: playerId });

  socket.on('disconnect', function(socket) {
    console.log('user disconnected');
    delete players[playerId];
    console.log(players);
  });

  // detect player, start music
  if (tempoInitiationArr.length === 1) {
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
      io.emit('notesPerTempo', playerNotes);
      playerNotes = {};

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
  socket.on('playedNote', function(data){
    var transitId = data.id
    playerNotes[transitId] = { note: data.note, instrument: data.instrument };
  });

});
