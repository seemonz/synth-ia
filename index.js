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
var game = {};
var playerInputCollection = [];
var playerId = {};
var playerIdSequence = 0;

var currentScene = '';
var scene = {
  'earth': ['earth-harp', 'earth-piano', 'earth-rhode', 'earth-glock'],
  'space': ['space-leed', 'space-bass', 'space-accordian', 'space-pad'],
  'night': ['night-first', 'night-second', 'night-saw', 'night-bass'],
  'diego': ['diego-guitar4', 'diego-guitar3', 'diego-guitar2', 'diego-guitar1'],
  'boats': ['boats-highest', 'boats-high', 'boats-low', 'boats-lowest']
};

// tempo
var tempo = 125;

// synth-ia is on/off
// var synthiaInit = true;
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
  //
  io.emit('createNyan', game)
  // send out player ID to client and current scene
  io.emit('assignPlayerId', { id: publicId });
  // emit current scene if not player 1
  if (currentScene != '') {
    io.emit('sceneData', scene[currentScene]);
  }

  // Sends synthia's notes so players have access
  io.emit('synthiaNotes', synthia);

  // server messages for connection and disconnection
  console.log('player:' + publicId + ' connected, with socket.id of ' + socket.id);
  socket.on('disconnect', function(socket) {
    console.log('player:' + publicId + ' disconnected');
    io.emit('killNyan', game[publicId]);
    delete game[publicId];
    io.emit('killNyan');
  });

  // send modal signal for first player
  if (playerIdSequence === 1 ) {
    io.emit('modalRender');
  }

  // first players scene selection
  socket.on('selectScene', function(data){
    currentScene = data;
    startSynthia();
    // Sends synthia's notes so first player has access
    io.emit('synthiaNotes', synthia);
    startTempo(tempo);
    io.emit('sceneData', scene[currentScene]);
  });

  // receive player mouse movement
  socket.on('mousePosition', function(data){
    io.emit('otherplayer', data);

  });

  // detect first player, generate synthia's notes
  function startSynthia() {
    if (currentScene === 'earth') {
      synthia[synthiaRhythms] = randomizeSynthia(tempo * 2,  scene[currentScene][0], 0.5);
      synthia[synthiaRhythms] = randomizeSynthia(tempo * 4,  scene[currentScene][1], 1.0);
      synthia[synthiaRhythms] = randomizeSynthia(tempo * 8,  scene[currentScene][2], 1.0);
      synthia[synthiaRhythms] = randomizeSynthia(tempo * 32, scene[currentScene][3], 1.0);
      synthiaInit = false;
    }
    if (currentScene === 'boats') {
      console.log(currentScene)
      synthia[synthiaRhythms] = randomizeSynthia(tempo * 4,  scene[currentScene][0], 0.8);
      synthia[synthiaRhythms] = randomizeSynthia(tempo * 8,  scene[currentScene][1], 0.8);
      synthia[synthiaRhythms] = randomizeSynthia(tempo * 16, scene[currentScene][2], 0.8);
      synthia[synthiaRhythms] = randomizeSynthia(tempo * 64, scene[currentScene][3], 0.8);
      synthiaInit = false;
    }
    if (currentScene === 'space') {
      console.log(currentScene)
      synthia[synthiaRhythms] = randomizeSynthia(tempo,      scene[currentScene][0], 0.2);
      synthia[synthiaRhythms] = randomizeSynthia(tempo,      scene[currentScene][1], 1.0);
      synthia[synthiaRhythms] = randomizeSynthia(tempo * 8,  scene[currentScene][2], 0.8);
      synthia[synthiaRhythms] = randomizeSynthia(tempo * 16, scene[currentScene][3], 0.5);
      synthiaInit = false;
    }
    if (currentScene === 'night') {
      console.log(currentScene)
      synthia[synthiaRhythms] = randomizeSynthia(tempo * 32,  scene[currentScene][0], 0.2);
      synthia[synthiaRhythms] = randomizeSynthia(tempo * 8,   scene[currentScene][1], 0.1);
      synthia[synthiaRhythms] = randomizeSynthia(tempo * 64,  scene[currentScene][2], 0.09);
      synthia[synthiaRhythms] = randomizeSynthia(tempo * 128, scene[currentScene][3], 0.1);
      synthiaInit = false;
    }
  }

  // Synth-ia starts the tempo all players are syncopated to, where the tempo is set by tempo.
  // Sends play note event, bound by tempo, to all players if a player has played a note
  var metroCount = 0
  var noteArray = []
  for (var i = 8 - 1; i >= 0; i--) {
    noteArray.push(Math.floor(Math.random() * 11));
  };
  function startTempo(tempo) {
    var start = new Date().getTime(),
    time = tempo,
    elapsed = '0.0';
    function instance() {
      playerInputCollection = [];
      for (var key in game){
        key.sound = '';
      }
      Object.keys(game).forEach(function(key){
        game[key].sound = ''
      });
      time += tempo;
      if (metroCount === 128) {
        newNoteArray = []
        for (var i = 8 - 1; i >= 0; i--) {
          newNoteArray.push(Math.floor(Math.random() * 11));
        };
        metroCount = 0
        noteArray = newNoteArray
        // console.log(newNoteArray)
      }
      elapsed = Math.floor(time / tempo) / 10;
      if(Math.round(elapsed) == elapsed) { elapsed += '.0'; }
      var diff = (new Date().getTime() - start) - time;
      // console.log((tempo-diff),new Date().getTime())
      setTimeout(instance, (tempo - diff));
      io.emit('tempo',[new Date().getTime(),tempo]) // send server time to clients' metronome
      io.emit('changeSynthia', noteArray)
      metroCount++
    }
    setTimeout(instance, tempo);
  }

  // on player input, stash the info associated with the note played and emit it back to all players
  socket.on('playerInput', function(input){
    playerInputCollection.push(input);
    // game[input.player] = input
    playerInputCollection.forEach(function(input){
      game[input.player] = input;
    });
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
