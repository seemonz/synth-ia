var game;
var currentInstrument;

$(function(){
  var socket = io();
  var playerId = 0;
  currentInstrument = 'earth-harp';

  // gets tempo from server to keep syncopation
  var init = true
  socket.on('tempo', function(data){
    if (init) {
      startMetronome(data[0],data[1])
      init = false
    }
  });

  // gets public id from server
  socket.on('assignPlayerId', function(data){
    if (playerId === 0){
      playerId = data.id;
    }
  });

  socket.on('data', function(x){
    game = x
  });

  // $('.notes').on('mouseover', function(){
  //   currentKey = $(this).data('key');
  // });

  $('body').on('keypress', function(event){
      if (event.keyCode == 32) {
        console.log("spacebar'd")
      }
  });

  // 12 notes for 12 keys on the board
  $('body').on('keydown', function(event){
    console.log(event.keyCode)
    // the keys are / Z X C V / A S D F / Q W E R / 
    var keycodes = [90,88,67,86,65,83,68,70,81,87,69,82];
    if (keycodes.indexOf(event.keyCode) != -1){
      var note = keycodes.indexOf(event.keyCode) + 1;
      if (!package){
        package = { sound: note, instrument: currentInstrument, player: playerId, volume: .5 }
        socket.emit('playerInput', package );
      } else {
        if (package.sound != note){
          package = { sound: note, instrument: currentInstrument, player: playerId, volume: .5 }
          socket.emit('playerInput', package ); 
        }
      }
    }
  });

});
