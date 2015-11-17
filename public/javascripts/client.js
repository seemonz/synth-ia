var currentAudio;
var playerAudio;
var currentInstrument;
var synthia;

$(function(){
  var socket = io();
  var playerId = 0;
  currentInstrument = 'earth-harp';

  // receive playerId from server
  socket.on('assignPlayerId', function(data){
    if (playerId === 0){
      playerId = data.id;
    }
  });

  // gets tempo from server to keep syncopation
  var init = true
  socket.on('tempo', function(data){
    if (init) {
      startMetronome(data[0],data[1]);
      init = false;
    }
  });

  socket.on('synthiaNotes', function(data){
    synthia = data;
    // console.log(synthia);
  });

  // gets public id from server
  socket.on('assignPlayerId', function(data){
    if (playerId === 0){
      playerId = data.id;
    }
  });

  socket.on('currentAudio', function(data){
    currentAudio = data;
  });

  // $('.notes').on('mouseover', function(){
  //   currentKey = $(this).data('key');
  // });


  $('body').on('keypress', function(event){
      if (event.keyCode == 32) {
        console.log("spacebar'd");
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
