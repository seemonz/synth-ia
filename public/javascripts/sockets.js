console.info('Loaded Sockets.js')
$(function(){
  var socket = io();


  // sends the button click down to the server
  $('#synth').on('click', function() {
    socket.emit('button click');
  });
  // receives the button broadcast back from the server
  socket.on('button click', function(){
    $('#timer').toggleClass('set-on');
    setTimeout(function(){
      $('#timer').toggleClass('set-on');
    }, 100);
  });

  $('#note-1').on('click', function(){
    socket.emit('play1');
  });

  socket.on('play1', function(){
    $('#note-box-1').toggleClass('set-on');
    setTimeout(function(){
      $('#note-box-1').toggleClass('set-on');
    }, 100);
  });

  $('#note-2').on('click', function(){
    socket.emit('play2');
  });

  socket.on('play2', function(){
    $('#note-box-2').toggleClass('set-on');
    setTimeout(function(){
      $('#note-box-2').toggleClass('set-on');
    }, 100);
  });

});
