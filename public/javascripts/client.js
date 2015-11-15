$(function(){
  var socket = io();
  var playerId = 0;

  // currentPlayers current intrument
  var currentInstrument = 'space-bass';

  // receive playerId from server
  socket.on('assignPlayerId', function(data){
    if (playerId === 0){
      playerId = data.id;
    }
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
        socket.emit('playedNote', { note: currentKey, id: playerId, instrument: currentInstrument, volume: 0.5 });
        console.log(currentNote);
      }
  });

  // 12 notes for 12 keys o the board
  $('body').on('keydown', function(event){
    // Q
    if (event.keyCode == 81) {
      socket.emit('playedNote', { note: 12, id: playerId, instrument: currentInstrument, volume: 0.5 });
    }
    // W
    if (event.keyCode == 87) {
      socket.emit('playedNote', { note: 11, id: playerId, instrument: currentInstrument, volume: 0.5 });
    }
    // E
    if (event.keyCode == 69) {
      socket.emit('playedNote', { note: 10, id: playerId, instrument: currentInstrument, volume: 0.5 });
    }
    // R
    if (event.keyCode == 82) {
      socket.emit('playedNote', { note: 9, id: playerId, instrument: currentInstrument, volume: 0.5 });
    }
    // A
    if (event.keyCode == 65) {
      socket.emit('playedNote', { note: 8, id: playerId, instrument: currentInstrument, volume: 0.5 });
    }
    // S
    if (event.keyCode == 83) {
      socket.emit('playedNote', { note: 7, id: playerId, instrument: currentInstrument, volume: 0.5 });
    }
    // D
    if (event.keyCode == 68) {
      socket.emit('playedNote', { note: 6, id: playerId, instrument: currentInstrument, volume: 0.5 });
    }
    // F
    if (event.keyCode == 70) {
      socket.emit('playedNote', { note: 5, id: playerId, instrument: currentInstrument, volume: 0.5 });
    }
    // Z
    if (event.keyCode == 90) {
      socket.emit('playedNote', { note: 4, id: playerId, instrument: currentInstrument, volume: 0.5 });
    }
    // X
    if (event.keyCode == 88) {
      socket.emit('playedNote', { note: 3, id: playerId, instrument: currentInstrument, volume: 0.5 });
    }
    // C
    if (event.keyCode == 67) {
      socket.emit('playedNote', { note: 2, id: playerId, instrument: currentInstrument, volume: 0.5 });
    }
    // V
    if (event.keyCode == 86) {
      socket.emit('playedNote', { note: 1, id: playerId, instrument: currentInstrument, volume: 0.5 });
    }
  });

  // get notes from server for all players to play on next beat
  socket.on('notesPerTempo', function(data){
    for (var player in data){
      triggerNote(data[player].note, data[player].instrument, data[player].volume);
    }
  });

  socket.on('rhythmPerTempo', function(data){
    triggerNote(data.note, data.instrument, data.volume);
  });

});
