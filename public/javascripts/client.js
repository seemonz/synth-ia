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

  // note trigger on spacebar
  $('body').on('keydown', function(event){
      if (event.keyCode == 32) {
        socket.emit('currentPlayer', { note: currentKey });
      }
  });


  // get notes from server for all players to play on next beat
  socket.on('currentPlayer', function(data){
    console.log(data);
    // data.note.note is temporary
    // data = { note: { note: 'number'} }, eventually becomes data = { note: { x: 'number', y: 'number' } }
    triggerNote(data.note.note, 'drumkit');
    // should become triggerNote(data.note.x, data.note.y, data.note.instrument)
  });

  socket.on('playerTwoPlay', function(data){
    triggerNote(data.note.note, 'drumkit');
  });

  socket.on('playerThreePlay', function(data){
    triggerNote(data.note.note, 'drumkit');
  });

  socket.on('playerFourPlay', function(data){
    triggerNote(data.note.note, 'drumkit');
  });

});
