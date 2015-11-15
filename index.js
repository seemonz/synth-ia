var express = require('express');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(8080);
app.use(express.static('public'));
app.use(express.static('bundle.js'));


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

// current rhymthms in play
var currentRhythms = [];

// defining random rhythm on refresh
// var rDelay1 = getRandomRhythm();
// var rDelay2 = getRandomRhythm();
// var rDelay3 = getRandomRhythm();

// socket io
io.on('connection', function (socket) {
  var playerId = ++playerIdSequence;
  players[playerId] = socket.id;
  tempoInitiationArr.push(socket.id);

  console.log('player:' + playerId + ' connected, with socket.id of ' + socket.id);
  console.log(players);

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
      io.emit('notesPerTempo', playerNotes);
      playerNotes = {};
      // synthia's rhythm !
      rhythmGenerator('space-cymbals', tempo, 10, 1);
      rhythmGenerator('space-leed', tempo*2, 12, 0.05);
      // rhythmGenerator('space-pad', tempo*128, 12, 0.1);
    }, tempo);
  }

  // rhythm randomizer
  // function triggerRhythms(tempo) {

  // }

  function isRhythmPresent(instrument) {
    var getR = currentRhythms.indexOf(instrument);
    if (getR > -1){
      currentRhythms.splice(getR, 1);
      return true;
    } else {
      return false;
    }
  }  

  function rhythmGenerator(instrument, timeoutDuration, noteNum, volume) {
    var randNote = Math.floor(Math.random() * noteNum) + 1;
    if (!isRhythmPresent(instrument)) {
      currentRhythms.push(instrument);
      setTimeout(function() {
        io.emit('rhythmPerTempo', { note: randNote, instrument: instrument, volume: volume });
      }, timeoutDuration);
    }
  }

  // syncs button clicks to activating each second
  socket.on('playedNote', function(data){
    console.log('note has been played')
    var transitId = data.id
    playerNotes[transitId] = { note: data.note, instrument: data.instrument, volume: data.volume };
  });

});
