var express = require('express');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var count = 0;

server.listen(8080);
app.use(express.static('public'));
app.use(express.static('./bundle.js'));


app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

// game is object of players in session
var tempoInit = true;
var game = {};
var playerId = {};
var playerIdSequence = 0;

var currentScene = 'earth';
var scene = {
  'earth': ['earth-harp', 'earth-piano', 'earth-rhode', 'earth-glock'],
  'space': ['space-leed', 'space-bass', 'space-accordian', 'space-pad']
};

// tempo
var tempo = 125;

// synth-ia is on/off
var synthiaInit = true;
var synthiaRhythms = 0;
var synthia = {};

function randomizeSynthia(tempo, instrument, volume){
  synthiaRhythms += 1;
  return { tempo: tempo, instrument: instrument, volume: volume, state: true };
}

// socket io
io.on('connection', function (socket) {
  var publicId = ++playerIdSequence;
  playerId[publicId] = socket.id;
  game[publicId] = { key: '', instrument: '' }

  // send out player ID to client and current scene
  io.emit('assignPlayerId', { id: publicId });
  io.emit('sceneData', scene[currentScene])

  // Sends synthia's notes so players have access
  io.emit('synthiaNotes', synthia);
  console.log(('synthiaNotes', synthia))

  // server messages for connection and disconnection
  console.log('player:' + publicId + ' connected, with socket.id of ' + socket.id);
  socket.on('disconnect', function(socket) {
    console.log('player:' + publicId + ' disconnected');
    delete game[publicId];
  });

  // detect first player, start music
  if (tempoInit) {
    startTempo(tempo);
    tempoInit = false;
  }

  // detect first player, generate synthia's notes
  if (synthiaInit) {
    synthia[synthiaRhythms] = randomizeSynthia(tempo * 2, 'earth-harp', 0.1);
    synthia[synthiaRhythms] = randomizeSynthia(tempo * 32, 'earth-piano', 0.1);
    synthia[synthiaRhythms] = randomizeSynthia(tempo * 64, 'earth-rhode', 0.5);
    synthia[synthiaRhythms] = randomizeSynthia(tempo * 128, 'earth-glock', 1);
    synthiaInit = false;
  }

  // Synth-ia starts the tempo all players are syncopated to, where the tempo is set by tempo.
  // Sends play note event, bound by tempo, to all players if a player has played a note
  var metroCount = 0
  var noteArray = [1,2,3,4,5,6,7,8];
  function startTempo(tempo) {
    console.log("START")
    var start = new Date().getTime(),
    time = tempo,
    elapsed = '0.0';
    function instance() {
      for (var key in game){
        key.sound = '';
      }
      Object.keys(game).forEach(function(key){
        game[key].sound = ''
      });
      time += tempo;
      if (metroCount === 512) {
        var newNoteArray = [
          Math.floor(Math.random() * 11),
          Math.floor(Math.random() * 11),
          Math.floor(Math.random() * 11),
          Math.floor(Math.random() * 11),
          Math.floor(Math.random() * 11),
          Math.floor(Math.random() * 11),
          Math.floor(Math.random() * 11),
          Math.floor(Math.random() * 11),
        ]
        metroCount = 0
        noteArray = newNoteArray
        console.log(newNoteArray)
      }
      elapsed = Math.floor(time / tempo) / 10;
      if(Math.round(elapsed) == elapsed) { elapsed += '.0'; }
      var diff = (new Date().getTime() - start) - time;
      // console.log((tempo-diff),new Date().getTime())
      setTimeout(instance, (tempo - diff));
      io.emit('tempo',[new Date().getTime(),tempo]) // send server time to clients' metronome
      io.emit('changeSynthia', noteArray)
      console.log(metroCount)
      metroCount++
      console.log(noteArray)
    }
    setTimeout(instance, tempo);
  }

  // on player input, stash the info associated with the note played and emit it back to all players
  socket.on('playerInput', function(input){
    game[input.player] = input
    io.emit('currentAudio', game)
  })

  // synthia on/off
  socket.on('synthiaOn', function(data){
    synthia = data;
    io.emit('synthiaNotes', synthia);
  });
  socket.on('synthiaOff', function(data){
    synthia = data;
    io.emit('synthiaNotes', synthia);
  });

  // synthia instrument control
  socket.on('synthiaInstrumentControl', function(data){
    synthia = data;
    io.emit('synthiaNotes', synthia);
  });

});
