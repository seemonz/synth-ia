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
    $('#timer').toggleClass('set-on');
    setTimeout(function(){
      $('#timer').toggleClass('set-on');
    }, 100);
  });

  // plays rhythm 1
  socket.on('rhythm1', function(){
    triggerNote(1, 'drumkit');
    $('#rhythm').toggleClass('set-on');
    setTimeout(function(){
      $('#rhythm').toggleClass('set-on');
    }, 100);
  });

  // plays rhythm 2
  socket.on('rhythm2', function(){
    triggerNote(2, 'drumkit');
  });

  // on button press, trigger musical note based on instrument
  // grab mouse x mouse y and current instrument to pass as object
  $('#note-1').on('click', function(){
    var randomNote = getRandomNote();
    socket.emit('playerOnePlay', { note: randomNote });
  });

  $('#note-2').on('click', function(){
    var randomNote = getRandomNote();
    socket.emit('playerTwoPlay', { note: randomNote });
  });

  // get notes from server for all players to play on next beat
  socket.on('playerOnePlay', function(data){
    $('#note-box-1').toggleClass('set-on');
    setTimeout(function(){
      $('#note-box-1').toggleClass('set-on');
    }, 100);
    console.log(data);
    // data.note.note is temporary
    // data = { note: { note: 'number'} }, eventually becomes data = { note: { x: 'number', y: 'number' } }
    triggerNote(data.note.note, 'piano');
    // should become triggerNote(data.note.x, data.note.y, data.note.instrument)
  });

  socket.on('playerTwoPlay', function(data){
    $('#note-box-2').toggleClass('set-on');
    setTimeout(function(){
      $('#note-box-2').toggleClass('set-on');
    }, 100);
    triggerNote(data.note.note, 'piano');
  });

});
