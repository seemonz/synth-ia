var game
$(function(){
  var socket = io();
  
  function getRandomNote(){
    return Math.floor(Math.random() * 11) + 1;
  }

  // function playNote(x, y, instrument){}
  // function playNote(randomNote, instrument){
  //   play{instrument}(randomNote);
  // use switch? instrument === piano1
  // playPiano1(randomNote);
  // }

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

  // note trigger on spacebar
  // only one that works (use as example)
  
  $('body').on('keypress', function(event){
      if (event.keyCode == 32) {
        if(!package){
          package = { key: 3 ,instrument:'space-leed', player: socket.id, volume: .5 }
          socket.emit('input', package );
        }else{
          if(package.key != 3){
            package = { key: 3 ,instrument:'space-leed', player: socket.id, volume: .5 }
            socket.emit('input', package ); 
          }
        }

        
      }
  });

  // 12 notes for 12 keys o the board
  $('body').on('keydown', function(event){
    // Q
    if (event.keyCode == 81) {
      socket.emit('currentPlayer', { note: 12 });
    }
    // W
    if (event.keyCode == 87) {
      socket.emit('currentPlayer', { note: 11 });
    }
    // E
    if (event.keyCode == 69) {
      socket.emit('currentPlayer', { note: 10 });
    }
    // R
    if (event.keyCode == 82) {
      socket.emit('currentPlayer', { note: 9 });
    }
    // A
    if (event.keyCode == 65) {
      socket.emit('currentPlayer', { note: 8 });
    }
    // S
    if (event.keyCode == 83) {
      socket.emit('currentPlayer', { note: 7 });
    }
    // D
    if (event.keyCode == 68) {
      socket.emit('currentPlayer', { note: 6 });
    }
    // F
    if (event.keyCode == 70) {
      socket.emit('currentPlayer', { note: 5 });
    }
    // Z
    if (event.keyCode == 90) {
      socket.emit('currentPlayer', { note: 4 });
    }
    // X
    if (event.keyCode == 88) {
      socket.emit('currentPlayer', { note: 3 });
    }
    // C
    if (event.keyCode == 67) {
      socket.emit('currentPlayer', { note: 2 });
    }
    // V
    if (event.keyCode == 86) {
      socket.emit('currentPlayer', { note: 1 });
    }
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
