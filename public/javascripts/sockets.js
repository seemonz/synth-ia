console.info('Loaded Sockets.js')
$(function(){
  var socket = io();


  // sends the button click down to the server
  $('#synth').on('click', function() {
    socket.emit('button click');
  });
  // receives the button broadcast back from the server
  socket.on('button click', function(timeZero){
    // console.log(timeZero);
    // console.log(Date.now());
    setInterval(function() {
      if (Date.now() >= timeZero + 100){
        console.log(timeZero);
        console.log(Date.now());
        $('#timer').toggleClass('set-on');
        setTimeout(function(){
          $('#timer').toggleClass('set-on');
        }, 100);
      }
    }, 1);
  });

  $('#play-button').on('click', function(){
    socket.emit('play');
  });

  socket.on('play', function(){
    $('#play').toggleClass('set-on');
  });

});
