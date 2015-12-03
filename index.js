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
var game = {
  'earth': {},
  'space': {},
  'night': {},
  'boats': {}
};
var playerInputCollection = [];
var playerId = {};
var playerIdSequence = 0;

var currentScene = '';
var scene = {
  'earth': ['earth-harp', 'earth-piano', 'earth-rhode', 'earth-glock'],
  'space': ['space-leed', 'space-bass', 'space-accordian', 'space-pad'],
  'night': ['night-first', 'night-second', 'night-saw', 'night-bass'],
  'boats': ['boats-tenor', 'boats-high', 'boats-low', 'boats-bass']
};

// tempo
var tempo = 125;

// synth-ia is on/off
// var synthiaInit = true;
var synthiaRhythms = 0;
var synthia = {};
var synthias = {};
var nyanTracker = { earth:{},space:{},boats:{},night:{}};

var nyanCats = [
  'gb_cat.gif',
  'grumpy_cat.gif',
  'j5_cat.gif',
  'jamaicnyan_cat.gif',
  'jazz_cat.gif',
  'mexinyan_cat.gif',
  'nyan_cat.gif',
  'nyaninja_cat.gif',
  'pirate_cat.gif',
  'technyancolor_cat.gif',
  'zombie_cat.gif',
  'gb_cat.gif',
  'grumpy_cat.gif',
  'j5_cat.gif',
  'jamaicnyan_cat.gif',
  'jazz_cat.gif',
  'mexinyan_cat.gif',
  'nyan_cat.gif',
  'nyaninja_cat.gif',
  'pirate_cat.gif',
  'technyancolor_cat.gif',
  'zombie_cat.gif',
  'gb_cat.gif',
  'grumpy_cat.gif',
  'j5_cat.gif',
  'jamaicnyan_cat.gif',
  'jazz_cat.gif',
  'mexinyan_cat.gif',
  'nyan_cat.gif',
  'nyaninja_cat.gif',
  'pirate_cat.gif',
  'technyancolor_cat.gif',
  'zombie_cat.gif',
  'rainicorn.gif',
  'leekspin.gif'
]

function randomizeSynthia(tempo, instrument, volume){
  synthiaRhythms += 1;
  return { tempo: tempo, instrument: instrument, volume: volume, state: false };
}

function startSynthia() {
    currentScene = 'earth';
    synthia['0'] = randomizeSynthia(tempo * 4,  scene[currentScene][0], 0.2);
    synthia['1'] = randomizeSynthia(tempo * 8,  scene[currentScene][1], 0.3);
    synthia['2'] = randomizeSynthia(tempo * 16,  scene[currentScene][2], 0.5);
    synthia['3'] = randomizeSynthia(tempo * 32, scene[currentScene][3], 0.3);
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
    synthia['1'] = randomizeSynthia(tempo,      scene[currentScene][1], 0.6);
    synthia['2'] = randomizeSynthia(tempo * 32,  scene[currentScene][2], 0.2);
    synthia['3'] = randomizeSynthia(tempo * 16, scene[currentScene][3], 0.3);
    synthiaInit = false;
    synthias['space'] = synthia
    synthia = {};

    currentScene = 'night';
    synthia['0'] = randomizeSynthia(tempo * 128,  scene[currentScene][0], 0.4);
    synthia['1'] = randomizeSynthia(tempo * 2,   scene[currentScene][1], 0.5);
    synthia['2'] = randomizeSynthia(tempo * 64,  scene[currentScene][2], 0.3);
    synthia['3'] = randomizeSynthia(tempo * 128, scene[currentScene][3], 0.4);
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

  io.emit('assignPlayerId', { id: publicId });

  // server messages for connection and disconnection
  console.log('player:' + publicId + ' connected, with socket.id of ' + socket.id);
  socket.on('disconnect', function(socket) {
    console.log('player:' + publicId + ' disconnected');
    for (var key in nyanTracker) {
      delete nyanTracker[key][publicId]
      io.to(key).emit('killNyan', publicId);
    }
    io.emit('killTrail', publicId);
    for (var key in game) {
      delete game[key][publicId];
    }
  });

  if (!startTempoInit) {
    startTempo(tempo);
    startTempoInit = true;
  }

  // funnel player into scene room
  socket.on('scene', function(data){
    var sceneName = data;
    // var inter = {};
    // inter[publicId] = nyanCats[Math.floor(Math.random() * nyanCats.length)];
    nyanTracker[sceneName][publicId] = nyanCats[Math.floor(Math.random() * nyanCats.length)];
    // console.log(nyanTracker);

    socket.join(sceneName);
    // sends scene data for rendering buttons
    io.to(sceneName).emit('sceneData', scene[sceneName]);

    // sends scene data for rendering synthia
    io.to(sceneName).emit('synthiaNotes', synthias[sceneName]);
    io.emit('tempo',[new Date().getTime(),tempo]) // send server time to clients' metronome

    // sends scene data for rendering avatars
    io.to(sceneName).emit('createNyan', nyanTracker[sceneName]);

    // sends scene data for rendering trails
    io.to(sceneName).emit('createTrail', publicId)
  });


  // receive player mouse movement
  socket.on('mousePosition', function(data){
    io.emit('otherplayer', data);
  });

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
      Object.keys(game).forEach(function(scene){
        for (var player in scene){
          if (game[scene].hasOwnProperty(player)){
            game[scene][player].sound = '';
          }
        }
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
    io.to(data.scene).emit('otherPlayerPositions', data);
  });

  // on player input, stash the info associated with the note played and emit it back to all players
  socket.on('playerInput', function(input){
    playerInputCollection.push(input);
    playerInputCollection.forEach(function(input){
      game[input.scene][input.player] = input;
    });
    io.to(input.scene).emit('currentAudio', game[input.scene]);
  });

  // synthia on/off
  socket.on('synthiaOn', function(data){
    synthias[data[0]] = data[1];
    io.to(data[0]).emit('synthiaNotes', synthias[data[0]]);
  });
  socket.on('synthiaOff', function(data){
    synthias[data[0]] = data[1];
    io.to(data[0]).emit('synthiaNotes', synthias[data[0]]);
  });

  // synthia instrument control
  socket.on('synthiaInstrumentControl', function(data){
    synthias[data[0]] = data[1];
    io.to(data[0]).emit('synthiaNotes', synthias[data[0]]);
  });

});
