var currentAudio;
var playerAudio;
var currentInstrument;
var synthia;
var scene;
var noteArray;
var mouseCount;


$(function(){
  var socket = io();
  var playerId = 0;
  currentInstrument = '';

  // receive playerId from server
  socket.on('assignPlayerId', function(data){
    if (playerId === 0){
      playerId = data.id;
    }
  });

  // receive scene modal if first player
  socket.on('modalRender', function(){
    modalRender();
  });

  // gets scene info
  socket.on('sceneData', function(data){
    scene = data;
    var randNum = Math.floor(Math.random() * data.length);
    currentInstrument = data[randNum];

    // buffer intruments
    startBuffer(scene);

    // set player instrument names
    var playerButtons = $('.player-instruments');
    var count = 0;
    for(var i=0; i<playerButtons.length; i++){
      var element = playerButtons.eq(i);
      element.text(data[count]);
      count += 1;
    }
    // set random current instrument element's focus
    $('.player-instruments:contains('+ currentInstrument +')').addClass('focus');

    var synthiaButtons = $('.synthia-instruments');
    var count = 0;
    for(var i=0; i<synthiaButtons.length; i++){
      var element = synthiaButtons.eq(i);
      element.text(data[count]);
      count += 1;
    }
  });

  // gets tempo from server to keep syncopation
  var init = true
  socket.on('tempo', function(data){
    if (init) {
      startMetronome(data[0],data[1]);
      init = false;
    }
  });

  //change Note Array
  socket.on('changeSynthia', function(data){
    noteArray = data;
  });

  // sends scene selection to server
  setTimeout( function(){
    $(document).on('click', '.scenes', function(){
      var data = $(this).text();
      console.log(data);
      socket.emit('selectScene', data);
    });

    $(document).on('click', '#overlay', function(){
      var allScenes = ['earth', 'space'];
      // , 'deigo', 'night', 'boats'];
      var randNum = Math.floor(Math.random() * allScenes.length);
      var data = allScenes[randNum];
      console.log(data);
      socket.emit('selectScene', data);
    });
  }, 50);


  // gets current game state of all notes in queue
  socket.on('currentAudio', function(data){
    currentAudio = data;
  });

  // gets synthia's notes when joining
  socket.on('synthiaNotes', function(data){
    synthia = data;
  });

  // turn synthia on/off
  $('#on').on('click', function(){
    for (var key in synthia) {
      synthia[key].state = true;
    }
    socket.emit('synthiaOn', synthia);
  });

  $('#off').on('click', function(){
    for (var key in synthia) {
      synthia[key].state = false;
    }
    socket.emit('synthiaOff', synthia);
  });
  mouseCount = 0;
  // player mouse tracker
  $(document).on('mousemove', function(e){
    var currentX = e.pageX - $('#main-frame').offset().left;
    var currentY = e.pageY - $('#main-frame').offset().top;
    ++mouseCount;

    if (mouseCount === 5){
      mouseCount = 0;
      socket.emit('mousePosition', currentX, currentY);
    }
  });

  socket.on('otherplayer', function(data){
    generateTrail(data[0], data[1], 10);
  });

  // synthia instrument control
  $('#synthia-instruments button').on('click', function(){
    if ($(this).hasClass('focus')) {
      for (var key in synthia) {
      if ($(this).text() === synthia[key].instrument) {
        synthia[key].state = true;
      }
    }
    } else {
      for (var key in synthia) {
        if ($(this).text() === synthia[key].instrument) {
          synthia[key].state = false;
        }
      }
    }
    socket.emit('synthiaIntrumentControl', synthia);
  });

  // mouse position
  $('#main-frame').on('click', function(){
    var note = currentNote;
    playerAudio = { sound: note, instrument: currentInstrument, player: playerId, volume: .5 }
    socket.emit('playerInput', playerAudio );
  });

  $('body').on('keypress', function(event){
      if (event.keyCode == 32) {
        console.log(event.clientX);
      }
  });

  // 12 notes for 12 keys on the board
  $('body').on('keydown', function(event){
    console.log(event.keyCode)
    // the keys are / Z X C V / A S D F / Q W E R /
    var keycodes = [90,88,67,86,65,83,68,70,81,87,69,82];
    if (keycodes.indexOf(event.keyCode) != -1){
      if (currentY != prevY) {
        socket.emit('mousePosition', currentX, currentY);
      }
      var note = keycodes.indexOf(event.keyCode) + 1;
      if (!playerAudio){
        playerAudio = { sound: note, instrument: currentInstrument, player: playerId, volume: .5 }
        socket.emit('playerInput', playerAudio );
      } else {
        if (playerAudio.sound != note){
          playerAudio = { sound: note, instrument: currentInstrument, player: playerId, volume: .5 }
          socket.emit('playerInput', playerAudio );
        }
      }
    }
  });
});
