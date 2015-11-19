var currentAudio;
var playerAudio;
var currentInstrument;
var synthia;
var scene;
var currentX;
var currentY;
var noteArray;

$(function(){
  var socket = io();
  var playerId = 0;
  currentInstrument = '';

  // update current mouse X, Y to pass for visualization
  // $('#main-frame').on("mousemove", function(e) {
  //   currentX = e.clientX - $('#main-frame').offset().left;
  //   currentY = e.clientY - $('#main-frame').offset().top;
  //   console.log(currentX + ',' + currentY)
  // });

  // receive playerId from server
  socket.on('assignPlayerId', function(data){
    if (playerId === 0){
      playerId = data.id;
    }
  });

  // gets scene info
  socket.on('sceneData', function(data){
    scene = data;
    currentInstrument = data[0];
  });

  // gets tempo from server to keep syncopation
  var init = true
  socket.on('tempo', function(data){
    if (init) {
      startMetronome(data[0],data[1]);
      init = false;
    }
  });

  //change Note Array
  socket.on('changeSynthia', function(data){
    noteArray = data;
  });

  // gets current game state of all notes in queue
  socket.on('currentAudio', function(data){
    currentAudio = data;
  });

  // gets synthia's notes when joining
  socket.on('synthiaNotes', function(data){
    synthia = data;
  });

  // turn synthia on/off
  $('#on').on('click', function(){
    for (var key in synthia) {
      synthia[key].state = true;
    }
    socket.emit('synthiaOn', synthia);
  });

  $('#off').on('click', function(){
    for (var key in synthia) {
      synthia[key].state = false;
    }
    socket.emit('synthiaOff', synthia);
  });

  // synthia instrument control
  $('#synthia-instruments button').on('click', function(){
    if ($(this).hasClass('focus')) {
      for (var key in synthia) {
      if ($(this).text() === synthia[key].instrument) {
        synthia[key].state = true;
      }
    }
    } else {
      for (var key in synthia) {
        if ($(this).text() === synthia[key].instrument) {
          synthia[key].state = false;
        }
      }
    }
    socket.emit('synthiaIntrumentControl', synthia);
  });

  // mouse position
  $('#main-frame').on('click', function(){
    var note = currentNote;
    playerAudio = { sound: note, instrument: currentInstrument, player: playerId, volume: .5 }
    socket.emit('playerInput', playerAudio );
  });

  $('body').on('keypress', function(event){
      if (event.keyCode == 32) {
        console.log(event.clientX);
      }
  });

  // 12 notes for 12 keys on the board
  $('body').on('keydown', function(event){
    console.log(event.keyCode)
    // the keys are / Z X C V / A S D F / Q W E R /
    var keycodes = [90,88,67,86,65,83,68,70,81,87,69,82];
    if (keycodes.indexOf(event.keyCode) != -1){
      var note = keycodes.indexOf(event.keyCode) + 1;
      if (!playerAudio){
        playerAudio = { sound: note, instrument: currentInstrument, player: playerId, volume: .5 }
        socket.emit('playerInput', playerAudio );
      } else {
        if (playerAudio.sound != note){
          playerAudio = { sound: note, instrument: currentInstrument, player: playerId, volume: .5 }
          socket.emit('playerInput', playerAudio );
        }
      }
    }
  });
});
