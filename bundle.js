/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	(__webpack_require__(1));
	(__webpack_require__(2));
	(__webpack_require__(3));
	(__webpack_require__(4));
	(__webpack_require__(5));


/***/ },
/* 1 */
/***/ function(module, exports) {

	function BufferLoader(context, urlList, callback) {
	  this.context = context;
	  this.urlList = urlList;
	  this.onload = callback;
	  this.bufferList = new Array();
	  this.loadCount = 0;
	}

	BufferLoader.prototype.loadBuffer = function(url, index) {
	  // Load buffer asynchronously
	  var request = new XMLHttpRequest();
	  request.open("GET", url, true);
	  request.responseType = "arraybuffer";

	  var loader = this;

	  request.onload = function() {
	    // Asynchronously decode the audio file data in request.response
	    loader.context.decodeAudioData(
	      request.response,
	      function(buffer) {
	        if (!buffer) {
	          alert('error decoding file data: ' + url);
	          return;
	        }
	        loader.bufferList[index] = buffer;
	        if (++loader.loadCount == loader.urlList.length)
	          loader.onload(loader.bufferList);
	      },
	      function(error) {
	        console.error('decodeAudioData error', error);
	      }
	    );
	  }

	  request.onerror = function() {
	    alert('BufferLoader: XHR error');
	  }

	  request.send();
	}

	BufferLoader.prototype.load = function() {
	  for (var i = 0; i < this.urlList.length; ++i)
	  this.loadBuffer(this.urlList[i], i);
	}


/***/ },
/* 2 */
/***/ function(module, exports) {

	window.AudioContext = window.AudioContext || window.webkitAudioContext;
	context = new AudioContext();

	$(function(){
	  initInstrument('earth-harp');
	  initInstrument('earth-piano');
	  initInstrument('earth-rhode');
	  initInstrument('earth-glock');
	  initInstrument('space-leed');
	  initInstrument('space-bass');
	  initInstrument('space-accordian');
	  initInstrument('space-pad');
	});

	function initInstrument(instrument) {
	  var files = [
	        'audio/'+instrument+'/note1.mp3',
	        'audio/'+instrument+'/note2.mp3',
	        'audio/'+instrument+'/note3.mp3',
	        'audio/'+instrument+'/note4.mp3',
	        'audio/'+instrument+'/note5.mp3',
	        'audio/'+instrument+'/note6.mp3',
	        'audio/'+instrument+'/note7.mp3',
	        'audio/'+instrument+'/note8.mp3',
	        'audio/'+instrument+'/note9.mp3',
	        'audio/'+instrument+'/note10.mp3',
	        'audio/'+instrument+'/note11.mp3',
	        'audio/'+instrument+'/note12.mp3'
	  ]
	  bufferLoader = new BufferLoader(context, files, function(bufferlist){
	    sounds[instrument] = bufferlist

	  });
	  bufferLoader.load()
	}

	var sounds = {}

	function playNote(note, instrument, volume, player) {
	  var source = context.createBufferSource();
	  var gainNode = context.createGain();
	  source.buffer = sounds[instrument][note - 1];
	  gainNode.gain.value = volume;
	  source.connect(gainNode);
	  gainNode.connect(compressor);
	  compressor.connect(context.destination);
	  source.start(0);
	  currentAudio[player].sound = ""
	}

	var compressor = context.createDynamicsCompressor();
	compressor.threshold.value = -20;
	compressor.knee.value = 25;
	compressor.ratio.value = 12;
	compressor.reduction.value = -30;
	compressor.attack.value = 0;
	compressor.release.value = .2;

	function triggerNotes () {
	  if (currentAudio) {
	    // console.log(currentAudio); 
	    Object.keys(currentAudio).forEach(function(key){
	      var player = currentAudio[key]
	      if (player.sound){
	        playNote(player.sound, player.instrument, player.volume, player.player)
	      }
	    })
	    playerAudio = null;
	  }
	}
	var changeCount = 0
	var instrumentcounter = {}
	var rhythmCounter = {};

	function playSynthia(tempo){
	  for (var key in rhythmCounter) {
	    rhythmCounter[key] += tempo;
	    if (rhythmCounter[key] >= synthia[key].tempo) {
	      rhythmCounter[key] = 0;
	      var count = instrumentcounter[synthia[key].instrument]
	      count > 7 ? count = 0 : null
	      var note = noteArray[count]
	      count++
	      instrumentcounter[synthia[key].instrument] = count
	      changeCount++
	      if (changeCount === 512) {
	        changeCount = 0;
	      }
	      // synthia playNote function
	      if (synthia[key].state) {
	        var source = context.createBufferSource();
	        var gainNode = context.createGain();
	        source.buffer = sounds[synthia[key].instrument][note];
	        gainNode.gain.value = synthia[key].volume;
	        source.connect(gainNode); 
	        gainNode.connect(compressor);
	        compressor.connect(context.destination);
	        source.start(0);
	      }
	    }
	  }
	}

	function startMetronome(start,tempo,noteArray){
	  // init synthia's rhythmCounter
	  for (var key in synthia) {
	    rhythmCounter[key] = synthia[key].tempo;
	  }
	  time = 0,
	  elapsed = '0.0';
	  function instance() {
	    time += tempo;
	    elapsed = Math.floor(time / tempo) / 10;
	    if(Math.round(elapsed) == elapsed) { elapsed += '.0'; }
	    var diff = (new Date().getTime() - start) - time;
	    window.setTimeout(instance, (tempo - diff));
	    if (Object.keys(sounds).length === 8) {
	      triggerNotes();
	      playSynthia(tempo);
	    }
	    // requestAnimationFrame(playerLoop)
	    // clearInterval(playerLoop);
	    // playerLoop = setInterval(startTrail, 25);
	  } 
	  window.setTimeout(instance, tempo);
	  scene.forEach(function(instrument) {
	    instrumentcounter[instrument] = 0;
	    console.log(instrumentcounter);
	  });
	}


/***/ },
/* 3 */
/***/ function(module, exports) {

	var currentNote;
	var playerLoop;
	var mainSVG;
	var currentX;
	var currentY;

	var maxBarHeight;
	var minBarHeight;
	var barWidth;
	var lowerLimit;
	var upperLimit;

	function startTrail(){
	  generateTrail(currentX, currentY, 10);
	}

	function generateTrail(x, y, height){
	  var rect = mainSVG.append("rect");
	  rect.style("fill", "green")
	    .style("stroke", "green")
	    .style("stroke-width", 3)
	    .attr("width", barWidth)
	    .attr("height", height)
	    .attr("x", x)
	    .attr("y", y)
	    .attr("ry", 5)
	    .transition()
	    .ease("linear")
	    .duration(2000)
	    .attr("x", -50)
	    .remove()
	}

	$(function() {

	  var frameWidth = document.getElementById('main-frame').clientWidth;
	  var frameHeight = document.getElementById('main-frame').clientHeight;
	  console.log(frameWidth + 'x' + frameHeight)
	  maxBarHeight = frameHeight * 0.25;
	  minBarHeight = frameHeight * 0.01;
	  barWidth = frameHeight * 0.005;
	  lowerLimit = frameWidth * 0.6;
	  upperLimit = frameWidth * 0.8;

	  mainSVG = d3.select("#main-frame")
	    .append("svg")
	    .attr("width", frameWidth)
	    .attr("height", frameHeight)

	  //music ladder
	  for (var i = 1; i < 12; i++) {
	    mainSVG.append("line")
	      .style("stroke", "gray")
	      .style("stroke-width", 2)
	      .attr("x1", 0)
	      .attr("y1", frameHeight / 12 * i)
	      .attr("x2", frameWidth)
	      .attr("y2", frameHeight / 12 * i);
	  }

	  // mouse image
	  var imgs = mainSVG.selectAll("image").data([0]);
	  imgs.enter()
	    .append("svg:image")
	    .attr("id", "nyan-cat")
	    .attr("xlink:href", "../images/nyan_cat.gif")
	    .attr("height", 100)
	    .attr("width", 100)
	    .attr("x", frameWidth * 0.7)
	    .attr("y", frameHeight * 0.35)

	  // update current mouse X, Y to pass for visualization
	  $(document).on('mousemove', function(e) {
	    currentX = e.pageX - $('#main-frame').offset().left;
	    currentY = e.pageY - $('#main-frame').offset().top;
	    mainSVG.select('#nyan-cat').attr("y", snappyTransition(currentY) - 50)
	      .attr("x", currentX - 50);
	    setCurrentNote(currentY);
	  });

	  function setCurrentNote(y) {
	    currentNote = Math.round(-1 * (y / (frameHeight / 12) - 12));
	  }

	  function snappyTransition(y) {
	    var noteAreaHeight = (frameHeight / 12);
	    for (var i = 1; i <= 12; i++) {
	      if (y <= noteAreaHeight * i) {
	        return noteAreaHeight / 2 * (2 * i - 1);
	      }
	    }
	  }

	  $('body').on('keydown', function(event) {
	    // the keys are / Z X C V / A S D F / Q W E R /
	    var keycodes = [90, 88, 67, 86, 65, 83, 68, 70, 81, 87, 69, 82];
	    var noteAreaHeight = (frameHeight / 12);
	    for (var i = 0; i <= 12; i++) {
	      if (keycodes.indexOf(event.keyCode) === (-1 * (i - 12))) {
	        currentY = noteAreaHeight / 2 * (2 * i - 1);
	        mainSVG.select('#nyan-cat').attr("y", currentY - 50)
	      }
	    }
	  });

	  setInterval(startTrail, 25);

	});


/***/ },
/* 4 */
/***/ function(module, exports) {

	var currentAudio;
	var playerAudio;
	var currentInstrument;
	var synthia;
	var scene;
	var noteArray;


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
	    console.log(data);
	    scene = data;
	    currentInstrument = data[0];

	    // set player instrument names
	    var playerButtons = $('.player-instruments');
	    var count = 0;
	    for(var i=0; i<playerButtons.length; i++){
	      var element = playerButtons.eq(i);
	      element.text(data[count]);
	      count += 1;
	    }

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
	      data = $(this).text();
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


/***/ },
/* 5 */
/***/ function(module, exports) {

	
	  // bring up modal box
	function modalRender() {
	  $('body').append('<div id="overlay"></div>');
	  $('body').append('<div id="modal"><h1>Choose your Scene!</h1><button class="scenes">earth</button><button class="scenes">space</button><button class="scenes">Deigo</button><button class="scenes">Synth</button></div>');
	}
	  // scene selection close
	$(function(){
	  $(document).on('click', '.scenes', function(){
	    $('#modal').remove();
	    $('#overlay').remove();
	  });
	});


/***/ }
/******/ ]);