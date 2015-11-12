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
  });

  $('#play-button').on('click', function(){
    socket.emit('play');
  });

  socket.on('play', function(){
    $('#play').toggleClass('set-on');
  });

});
