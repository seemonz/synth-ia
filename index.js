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

// game is object of players in session
var tempoInitiationArr = [];
var game = {};
var playerId = {};
var playerIdSequence = 0;

// tempo
var tempo = 125;

// synth-ia is on/off
// var startSynthia = false;
var synthia;

function randomizeSynthia(tempo, instrument, volume){
  var randNote = Math.floor(Math.random() * 12) + 1;
  return { sound: randNote, instrument: instrument, player: 'synthia', volume: volume };
}

// socket io
io.on('connection', function (socket) {
  var publicId = ++playerIdSequence;
  playerId[publicId] = socket.id;
  game[publicId] = { key: '', instrument: '' }
  startSynthia = true;

  // send out player ID to client
  io.emit('assignPlayerId', { id: publicId });

  // server messages for connection and disconnection
  console.log('player:' + publicId + ' connected, with socket.id of ' + socket.id);
  socket.on('disconnect', function(socket) {
    console.log('player:' + publicId + ' disconnected');
    delete game[publicId];
  });

  // detect player, start music, and generate synthia's notes
  tempoInitiationArr.push(socket);
  if (tempoInitiationArr.length === 1) {
    startTempo(tempo);
    // if statement to change her instrments depending on scene
    synthia = {
      'first': randomizeSynthia(tempo * 4, 'earth-harp', 0.1),
      'second': randomizeSynthia(tempo * 128, 'earth-piano', 0.1),
      'third': randomizeSynthia(tempo * 128, 'earth-rhode', 0.5),
      'four': randomizeSynthia(tempo * 256, 'earth-glock', 1)
    }
  }

  // Synth-ia starts the tempo all players are syncopated to, where the tempo is set by tempo.
  // Sends play note event, bound by tempo, to all players if a player has played a note
  // Sends synthia's notes so players have access
  function startTempo(tempo) {
    var start = new Date().getTime(),
    time = tempo,
    elapsed = '0.0';
    function instance() {
      Object.keys(game).forEach(function(key){
        game[key].sound = ''
      });         
      time += tempo;

      elapsed = Math.floor(time / tempo) / 10;
      if(Math.round(elapsed) == elapsed) { elapsed += '.0'; }
      var diff = (new Date().getTime() - start) - time;
      // console.log((tempo-diff),new Date().getTime())
      setTimeout(instance, (tempo - diff));
      io.emit('tempo',[new Date().getTime(),tempo]) // send server time to clients' metronome
    }
    io.emit('synthiaNotes', synthia);
    setTimeout(instance, tempo);
  }

  // players can turn on/off synthia who is recorded in the game obj like other players
  // if (startSynthia){
  //   game['synthia'] = { sound: 1, instrument: 'earth-harp', volume: 0.1, player: 'synthia' };
  // } 
  
  // on player input, stash the info associated with the note played and emit it back to all players
  socket.on('playerInput', function(input){
    game[input.player] = input
    console.log(game)
    io.emit('data', game)
  })
});
