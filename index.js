var express = require('express');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var count = 0;

server.listen(8080);
app.use(express.static('public'));
// app.use(express.static('./bundle.js'));


app.get('/', function (req, res) {
  res.sendfile('public/index.html');
});

app.get('/space', function (req, res) {
  res.sendfile('public/app.html');
});

app.get('/earth', function (req, res) {
  res.sendfile('public/app.html');
});

app.get('/night', function (req, res) {
  res.sendfile('public/app.html');
});

app.get('/boats', function (req, res) {
  res.sendfile('public/app.html');
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
  'boats': ['boats-highest', 'boats-high', 'boats-low', 'boats-lowest']
};

// tempo
var tempo = 125;

// synth-ia is on/off
// var synthiaInit = true;
var synthiaRhythms = 0;
var synthia = {};
var synthias = {};

function randomizeSynthia(tempo, instrument, volume){
  synthiaRhythms += 1;
  return { tempo: tempo, instrument: instrument, volume: volume, state: true };
}

function startSynthia() {
    currentScene = 'earth';
    synthia['0'] = randomizeSynthia(tempo * 4,  scene[currentScene][0], 0.01);
    synthia['1'] = randomizeSynthia(tempo * 4,  scene[currentScene][1], .3);
    synthia['2'] = randomizeSynthia(tempo * 8,  scene[currentScene][2], 1.0);
    synthia['3'] = randomizeSynthia(tempo * 32, scene[currentScene][3], 1.0);
    synthias['earth'] = synthia
    synthia = {};

    currentScene = 'boats';
    synthia['0'] = randomizeSynthia(tempo * 4,  scene[currentScene][0], 0.8);
    synthia['1'] = randomizeSynthia(tempo * 8,  scene[currentScene][1], 0.8);
    synthia['2'] = randomizeSynthia(tempo * 16, scene[currentScene][2], 0.8);
    synthia['3'] = randomizeSynthia(tempo * 64, scene[currentScene][3], 0.8);
    synthiaInit = false;
    synthias['boats'] = synthia
    synthia = {};

    currentScene = 'space';
    synthia['0'] = randomizeSynthia(tempo,      scene[currentScene][0], 0.2);
    synthia['1'] = randomizeSynthia(tempo,      scene[currentScene][1], 1.0);
    synthia['2'] = randomizeSynthia(tempo * 8,  scene[currentScene][2], 0.8);
    synthia['3'] = randomizeSynthia(tempo * 16, scene[currentScene][3], 0.5);
    synthiaInit = false;
    synthias['space'] = synthia
    synthia = {};

    currentScene = 'night';
    synthia['0'] = randomizeSynthia(tempo * 32,  scene[currentScene][0], 0.2);
    synthia['1'] = randomizeSynthia(tempo * 8,   scene[currentScene][1], 0.1);
    synthia['2'] = randomizeSynthia(tempo * 64,  scene[currentScene][2], 0.09);
    synthia['3'] = randomizeSynthia(tempo * 128, scene[currentScene][3], 0.1);
    synthiaInit = false;
    synthias['night'] = synthia
    synthia = {};
}
startSynthia();

var startTempoInit = false;

// socket io
io.on('connection', function (socket) {
  var publicId = ++playerIdSequence;
  playerId[publicId] = socket.id;

  // server messages for connection and disconnection
  console.log('player:' + publicId + ' connected, with socket.id of ' + socket.id);
  socket.on('disconnect', function(socket) {
    console.log('player:' + publicId + ' disconnected');
    delete game[publicId];
  });

  if (!startTempoInit) {
    startTempo(tempo);
    startTempoInit = true;
  }

  // funnel player into scene room
  socket.on('scene', function(data){
    var sceneName = data;
    var test = scene[sceneName];
    socket.join(sceneName);
    // sends scene data for rendering buttons
    io.to(sceneName).emit('sceneData', scene[sceneName]);

    // sends scene data for rendering synthia
    io.to(sceneName).emit('synthiaNotes', synthias[sceneName]);
    io.emit('tempo',[new Date().getTime(),tempo]) // send server time to clients' metronome
  });

  // game[publicId] = { key: '', instrument: '' }

  // send out player ID to client and current scene
  io.emit('assignPlayerId', { id: publicId });

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
      io.emit('changeSynthia', noteArray)
      metroCount++
    }
    setTimeout(instance, tempo);
  }

  // receive player mouse movement
  socket.on('mousePosition', function(data){
    
    io.to(data.scene).emit('otherplayer', data);

  });

  // on player input, stash the info associated with the note played and emit it back to all players
  socket.on('playerInput', function(input){
    playerInputCollection.push(input);
    playerInputCollection.forEach(function(input){
      var inter = {};
      inter[input.player] = input
      game[input.scene] = inter;
    });
    io.to(input.scene).emit('currentAudio', game[input.scene]);
  })

  // synthia on/off
  socket.on('synthiaOn', function(data){
    synthias[data[0]] = data[1];
    io.emit('synthiaNotes', synthias[data[0]]);
  });
  socket.on('synthiaOff', function(data){
    synthias[data[0]] = data[1];
    io.emit('synthiaNotes', synthias[data[0]]);
  });

  // synthia instrument control
  socket.on('synthiaInstrumentControl', function(data){
    synthias[data[0]] = data[1];
    io.emit('synthiaNotes', synthias[data[0]]);
  });

});
