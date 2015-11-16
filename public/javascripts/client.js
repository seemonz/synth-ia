var game
var player
$(function(){
  var socket = io();

  // gets tempo from server to keep syncopation
  var init = true
  socket.on('tempo', function(data){
    if(init){
      startMetronome(data[0],data[1])
      init = false
    }else{
    }
  });
  socket.on('data', function(x){
    game = x
  })
 
  var currentKey = 1;

  $('.notes').on('mouseover', function(){
    currentKey = $(this).data('key');
  });


  player = {instrument:'earth-harp'}
  
  $('body').on('keypress', function(event){
      if (event.keyCode == 32) {   
      }
  });

  // 12 notes for 12 keys on the board
  $('body').on('keydown', function(event){
    console.log(event.keyCode)
    var keycodes = [81,87,69,82,65,83,68,70,90,88,67,86]
    var note = keycodes.indexOf(event.keyCode)
    note++
    if(!package){
      package = { key: note, instrument:player.instrument, player: socket.id, volume: .5 }
      socket.emit('input', package );
    }else{
      if(package.key != note){
        package = { key: note, instrument:player.instrument, player: socket.id, volume: .5 }
        socket.emit('input', package ); 
      }
    }
  
    // // Q
    // if (event.keyCode == 81) {
    //   socket.emit('currentPlayer', { note: 12 });
    // }
    // // W
    // if (event.keyCode == 87) {
    //   socket.emit('currentPlayer', { note: 11 });
    // }
    // // E
    // if (event.keyCode == 69) {
    //   socket.emit('currentPlayer', { note: 10 });
    // }
    // // R
    // if (event.keyCode == 82) {
    //   socket.emit('currentPlayer', { note: 9 });
    // }
    // // A
    // if (event.keyCode == 65) {
    //   socket.emit('currentPlayer', { note: 8 });
    // }
    // // S
    // if (event.keyCode == 83) {
    //   socket.emit('currentPlayer', { note: 7 });
    // }
    // // D
    // if (event.keyCode == 68) {
    //   socket.emit('currentPlayer', { note: 6 });
    // }
    // // F
    // if (event.keyCode == 70) {
    //   socket.emit('currentPlayer', { note: 5 });
    // }
    // // Z
    // if (event.keyCode == 90) {
    //   socket.emit('currentPlayer', { note: 4 });
    // }
    // // X
    // if (event.keyCode == 88) {
    //   socket.emit('currentPlayer', { note: 3 });
    // }
    // // C
    // if (event.keyCode == 67) {
    //   socket.emit('currentPlayer', { note: 2 });
    // }
    // // V
    // if (event.keyCode == 86) {
    //   socket.emit('currentPlayer', { note: 1 });
    // }
  });

  // get notes from server for all players to play on next beat
  // socket.on('currentPlayer', function(data){
  //   console.log(data);
  //   // data.note.note is temporary
  //   // data = { note: { note: 'number'} }, eventually becomes data = { note: { x: 'number', y: 'number' } }
  //   triggerNote(data.note.note, 'space-leed');
  //   // should become triggerNote(data.note.x, data.note.y, data.note.instrument)
  // });

});
