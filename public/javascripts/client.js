$(function(){
  var socket = io();
  var playerId = 0;

  // currentPlayers current intrument
  var currentInstrument = '';

  function getRandomNote(){
    return Math.floor(Math.random() * 11) + 1;
  }

  // function playNote(x, y, instrument){}
  // function playNote(randomNote, instrument){
  //   play{instrument}(randomNote);
  // use switch? instrument === piano1
  // playPiano1(randomNote);
  // }

  // receive playerId from server
  socket.on('assignPlayerId', function(data){
    if (playerId === 0){
      playerId = data.id;
    }
  });

  // gets tempo from server to keep syncopation
  socket.on('tempo', function(){

  });

  // plays rhythm 1
  socket.on('rhythm1', function(){
    triggerNote(1, 'drumkit');
  });

  // plays rhythm 2
  socket.on('rhythm2', function(){
    triggerNote(2, 'drumkit');
  });

  var currentKey = 1;

  $('.notes').on('mouseover', function(){
    currentKey = $(this).data('key');
  });

  // instrument change
  $('.instruments').on('click', function(){
    currentInstrument = $(this).data('instrument');
  });


  // note trigger on spacebar
  $('body').on('keydown', function(event){
      if (event.keyCode == 32) {
        socket.emit('playedNote', { note: currentKey, id: playerId, instrument: currentInstrument });
      }
  });

  // 12 notes for 12 keys o the board
  $('body').on('keydown', function(event){
    // Q
    if (event.keyCode == 81) {
      socket.emit('playedNote', { note: 12, id: playerId, instrument: currentInstrument });
    }
    // W
    if (event.keyCode == 87) {
      socket.emit('playedNote', { note: 11, id: playerId, instrument: currentInstrument });
    }
    // E
    if (event.keyCode == 69) {
      socket.emit('playedNote', { note: 10, id: playerId, instrument: currentInstrument });
    }
    // R
    if (event.keyCode == 82) {
      socket.emit('playedNote', { note: 9, id: playerId, instrument: currentInstrument });
    }
    // A
    if (event.keyCode == 65) {
      socket.emit('playedNote', { note: 8, id: playerId, instrument: currentInstrument });
    }
    // S
    if (event.keyCode == 83) {
      socket.emit('playedNote', { note: 7, id: playerId, instrument: currentInstrument });
    }
    // D
    if (event.keyCode == 68) {
      socket.emit('playedNote', { note: 6, id: playerId, instrument: currentInstrument });
    }
    // F
    if (event.keyCode == 70) {
      socket.emit('playedNote', { note: 5, id: playerId, instrument: currentInstrument });
    }
    // Z
    if (event.keyCode == 90) {
      socket.emit('playedNote', { note: 4, id: playerId, instrument: currentInstrument });
    }
    // X
    if (event.keyCode == 88) {
      socket.emit('playedNote', { note: 3, id: playerId, instrument: currentInstrument });
    }
    // C
    if (event.keyCode == 67) {
      socket.emit('playedNote', { note: 2, id: playerId, instrument: currentInstrument });
    }
    // V
    if (event.keyCode == 86) {
      socket.emit('playedNote', { note: 1, id: playerId, instrument: currentInstrument });
    }
  });

  // get notes from server for all players to play on next beat
  socket.on('notesPerTempo', function(data){
    for (var player in data){
      triggerNote(data[player].note, data[player].instrument);
    }
  });

});
