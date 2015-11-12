console.info('Loaded Sockets.js')
$(function(){
  var socket = io();

  // sends the button click down to the server
  $('button').on('click', function() {
    socket.emit('button click');
  });
  // receives the button broadcast back from the server
  socket.on('button click', function(){
    alert('a user clicked the button');
  });

});
