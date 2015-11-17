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
	})

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

	var rhythmCounter = {};
	for (var key in synthia) {
	  rhythmCounter[key] = 0;
	}

	// function playSynthia(tempo){
	//   for (rhythmCounter)
	// }

	function startMetronome(start,tempo){
	  console.log(rhythmCounter)
	  time = 0,
	  elapsed = '0.0';
	  function instance() {
	    time += tempo;
	    elapsed = Math.floor(time / tempo) / 10;
	    if(Math.round(elapsed) == elapsed) { elapsed += '.0'; }
	    var diff = (new Date().getTime() - start) - time;
	    window.setTimeout(instance, (tempo - diff));
	    triggerNotes();
	    // playSynthia(tempo);
	  } 
	  window.setTimeout(instance, tempo);
	}

/***/ },
/* 3 */
/***/ function(module, exports) {

	$(function() {
	  var frameWidth = document.getElementById('main-frame').clientWidth;
	  var frameHeight = document.getElementById('main-frame').clientHeight;
	  var circleRadius = frameHeight * 0.05;
	  var maxBarHeight = frameHeight * 0.25;
	  var minBarHeight = frameHeight * 0.01;
	  var barWidth = frameHeight * 0.01;
	  var lowerLimit = frameWidth * 0.6;
	  var upperLimit = frameWidth * 0.8;
	  var mouseX = 0;
	  var mouseY = frameHeight / 2;
	  var percent = 0.5;
	  var down = false;
	  var clickAndReleased = false;
	  var fadeOutCounter = 0;
	  var fadeInCounter = 0;
	  var fadeOut;
	  var currentNote;

	  var dataset = [1]

	  // sets the canvas
	  var mainSVG = d3.select("#main-frame")
	    .append("svg")
	    .attr("width", frameWidth)
	    .attr("height", frameHeight);

	  //music ladder
	  for (var i = 1; i < 12; i++) {
	    mainSVG.append("line")
	      .style("stroke", "gray")
	      .style("stroke-width", 3)
	      .attr("x1", 0)
	      .attr("y1", frameHeight / 12 * i)
	      .attr("x2", frameWidth)
	      .attr("y2", frameHeight / 12 * i);
	  }

	  //upper & lower limit lines
	  mainSVG.append("line")
	    .style("stroke", "gray")
	    .attr("x1", lowerLimit)
	    .attr("y1", 0)
	    .attr("x2", lowerLimit)
	    .attr("y2", frameHeight);

	  mainSVG.append("line")
	    .style("stroke", "gray")
	    .attr("x1", upperLimit)
	    .attr("y1", 0)
	    .attr("x2", upperLimit)
	    .attr("y2", frameHeight);

	  //main controller circle
	  mainSVG.append("circle")
	    .style("stroke", "gray")
	    .style("fill", "white")
	    .attr("r", circleRadius)
	    .attr("cx", lowerLimit + (upperLimit - lowerLimit) / 2)
	    .attr("cy", frameHeight / 2)
	    .on("mouseover", function() {
	      d3.select(this).style("fill", "aliceblue");
	    })
	    .on("mouseout", function() {
	      d3.select(this).style("fill", "white");
	    });

	  function generateTrail(x, y, height) {
	    mainSVG.append("rect")
	      .style("fill", function() {
	        if (down || fadeOutCounter > 0) {
	          return "green";
	        } else {
	          return "white";
	        }
	      })
	      .style("stroke", "green")
	      .attr("width", barWidth)
	      .attr("height", height)
	      .attr("x", x)
	      .attr("y", y)
	      .transition()
	      .ease("linear")
	      .duration(3000)
	      .attr("x", -100)
	      .remove()
	  }

	  $(document).on("mousemove", function(e) {
	    mouseX = e.pageX - $('#main-frame').offset().left;
	    mouseY = e.pageY - $('#main-frame').offset().top;
	    mainSVG.select('circle').attr("cy", mouseY)
	      .attr("cx", withinBoundaries(mouseX));
	    percent = (mainSVG.select('circle').attr("cx") - lowerLimit) / (upperLimit - lowerLimit);
	    setCurrentNote(mouseY);
	  });

	  function setCurrentNote(y) {
	    currentNote = Math.round(-1 * ((y - circleRadius) / (frameHeight / 12) - 12));
	  }

	  function withinBoundaries(x) {
	    return function() {
	      if (x < (upperLimit - circleRadius) && x > (lowerLimit + circleRadius)) {
	        return x;
	      } else if (x >= (upperLimit - circleRadius)) {
	        return upperLimit - circleRadius;
	      } else if (x <= (lowerLimit + circleRadius)) {
	        return lowerLimit + circleRadius;
	      }
	    }
	  }

	  $(document).on('mousedown', function(e) {
	    down = true;
	    fadeInCounter = 0;
	  });

	  $(document).on('mouseup', function(e) {
	    down = false;
	    clickAndReleased = true;
	    fadeOutCounter = 10;
	  });

	  setInterval(function() {
	    if (!down) {
	      clickAndReleased = false;
	    }
	    function setBarHeight() {
	      if (down) {
	        if ((minBarHeight * Math.pow(2.5, fadeInCounter)) < (maxBarHeight * percent)) {
	          return minBarHeight * Math.pow(2.5, fadeInCounter);
	        } else {
	          return maxBarHeight * percent;
	        }
	      } else if (fadeOutCounter > 0) {
	        return maxBarHeight * percent * Math.pow(0.80, -(fadeOutCounter - 10));
	      } else {
	        return minBarHeight;
	      }
	    }
	    var x = lowerLimit - 2 * 10;
	    generateTrail(x, mouseY - setBarHeight() / 2, setBarHeight());
	    if (down) {
	      // triggerNote(currentNote);
	    }
	    if (fadeOutCounter > 0) {
	      fadeOutCounter -= 1;
	    }
	    if (fadeInCounter < 10) {
	      fadeInCounter += 1;
	    }
	  }, 30);

	});


/***/ },
/* 4 */
/***/ function(module, exports) {

	var currentAudio;
	var playerAudio;
	var currentInstrument;
	var synthia;

	$(function(){
	  var socket = io();
	  var playerId = 0;
	  currentInstrument = 'earth-harp';

	  // receive playerId from server
	  socket.on('assignPlayerId', function(data){
	    if (playerId === 0){
	      playerId = data.id;
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

	  socket.on('synthiaNotes', function(data){
	    synthia = data;
	    console.log(synthia);
	  });

	  // gets public id from server
	  socket.on('assignPlayerId', function(data){
	    if (playerId === 0){
	      playerId = data.id;
	    }
	  });

	  socket.on('currentAudio', function(data){
	    currentAudio = data;
	  });

	  // $('.notes').on('mouseover', function(){
	  //   currentKey = $(this).data('key');
	  // });


	  $('body').on('keypress', function(event){
	      if (event.keyCode == 32) {
	        console.log("spacebar'd");
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


/***/ }
/******/ ]);