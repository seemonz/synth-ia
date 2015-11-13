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

  // on button press, trigger musical note based on instrument
  // grab mouse x mouse y and current instrument to pass as object
  $('#note-1').on('click', function(){
    var randomNote = getRandomNote();
    socket.emit('note1', { note: randomNote });
  });

  $('#note-2').on('click', function(){
    var randomNote = getRandomNote();
    socket.emit('note2', { note: randomNote });
  });

  // get notes from server for all players to play on next beat
  socket.on('note1', function(data){
    $('#note-box-1').toggleClass('set-on');
    setTimeout(function(){
      $('#note-box-1').toggleClass('set-on');
    }, 100);
    console.log(data);
    // data.note.note is temporary
    // data = { note: { note: 'number'} }, eventually becomes data = { note: { x: 'number', y: 'number' } }
    playNote(data.note.note);
    // should become playNote(data.note.x, data.note.y, data.note.instrument)
  });

  socket.on('note2', function(data){
    $('#note-box-2').toggleClass('set-on');
    setTimeout(function(){
      $('#note-box-2').toggleClass('set-on');
    }, 100);
    playNote(data.note.note);
  });

});
