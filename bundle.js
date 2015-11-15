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

	// function triggerNote(note, instrument) {
	//   var note = ('audio/' +instrument+ '/note' +note+ '.wav')
	//   var audio = new Audio(note);
	//   audio.volume = 0.1;
	//   audio.play();
	//   // console.log(note);
	// }
	  window.AudioContext = window.AudioContext || window.webkitAudioContext;
	  context = new AudioContext();
	  var volume = 0;
	// triggerNote will have note = number, instrument
	function triggerNote(note, instrument, setVolume) {
	  volume = setVolume;
	  var soundfile = ['audio/' +instrument+ '/note' +note+ '.mp3']
	  bufferLoader = new BufferLoader(context, soundfile, startNote);
	  bufferLoader.load();
	}

	function startNote(bufferList) {
	  var source = context.createBufferSource();
	  var gainNode = context.createGain();
	  source.buffer = bufferList[0];
	  gainNode.gain.value = volume;
	  source.connect(gainNode);
	  gainNode.connect(compressor);
	  compressor.connect(context.destination);
	  source.start(0);
	}

	var compressor = context.createDynamicsCompressor();
	compressor.threshold.value = -20;
	compressor.knee.value = 25;
	compressor.ratio.value = 12;
	compressor.reduction.value = -30;
	compressor.attack.value = 0;
	compressor.release.value = .2;


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
	      .style("stroke", "black")
	      .style("stroke-width", 3)
	      .attr("x1", 0)
	      .attr("y1", frameHeight / 12 * i)
	      .attr("x2", frameWidth)
	      .attr("y2", frameHeight / 12 * i);
	  }

	  //upper & lower limit lines
	  mainSVG.append("line")
	    .style("stroke", "black")
	    .attr("x1", lowerLimit)
	    .attr("y1", 0)
	    .attr("x2", lowerLimit)
	    .attr("y2", frameHeight);

	  mainSVG.append("line")
	    .style("stroke", "black")
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

	$(function(){
	  var socket = io();
	  var playerId = 0;

	  // currentPlayers current intrument
	  var currentInstrument = 'space-bass';

	  function getRandomNote(){
	    return Math.floor(Math.random() * 11) + 1;
	  }

	  // function playNote(x, y, instrument){}
	  // function playNote(randomNote, instrument){
	  //   play{instrument}(randomNote);
	  // use switch? instrument === piano1
	  // playPiano1(randomNote);
	  // }

	  // receive playerId from server
	  socket.on('assignPlayerId', function(data){
	    if (playerId === 0){
	      playerId = data.id;
	    }
	  });

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

	  // instrument change
	  $('.instruments').on('click', function(){
	    currentInstrument = $(this).data('instrument');
	  });


	  // note trigger on spacebar
	  $('body').on('keydown', function(event){
	      if (event.keyCode == 32) {
	        socket.emit('playedNote', { note: currentKey, id: playerId, instrument: currentInstrument, volume: 0.5 });
	        console.log(currentNote);
	      }
	  });

	  // 12 notes for 12 keys o the board
	  $('body').on('keydown', function(event){
	    // Q
	    if (event.keyCode == 81) {
	      socket.emit('playedNote', { note: 12, id: playerId, instrument: currentInstrument, volume: 0.5 });
	    }
	    // W
	    if (event.keyCode == 87) {
	      socket.emit('playedNote', { note: 11, id: playerId, instrument: currentInstrument, volume: 0.5 });
	    }
	    // E
	    if (event.keyCode == 69) {
	      socket.emit('playedNote', { note: 10, id: playerId, instrument: currentInstrument, volume: 0.5 });
	    }
	    // R
	    if (event.keyCode == 82) {
	      socket.emit('playedNote', { note: 9, id: playerId, instrument: currentInstrument, volume: 0.5 });
	    }
	    // A
	    if (event.keyCode == 65) {
	      socket.emit('playedNote', { note: 8, id: playerId, instrument: currentInstrument, volume: 0.5 });
	    }
	    // S
	    if (event.keyCode == 83) {
	      socket.emit('playedNote', { note: 7, id: playerId, instrument: currentInstrument, volume: 0.5 });
	    }
	    // D
	    if (event.keyCode == 68) {
	      socket.emit('playedNote', { note: 6, id: playerId, instrument: currentInstrument, volume: 0.5 });
	    }
	    // F
	    if (event.keyCode == 70) {
	      socket.emit('playedNote', { note: 5, id: playerId, instrument: currentInstrument, volume: 0.5 });
	    }
	    // Z
	    if (event.keyCode == 90) {
	      socket.emit('playedNote', { note: 4, id: playerId, instrument: currentInstrument, volume: 0.5 });
	    }
	    // X
	    if (event.keyCode == 88) {
	      socket.emit('playedNote', { note: 3, id: playerId, instrument: currentInstrument, volume: 0.5 });
	    }
	    // C
	    if (event.keyCode == 67) {
	      socket.emit('playedNote', { note: 2, id: playerId, instrument: currentInstrument, volume: 0.5 });
	    }
	    // V
	    if (event.keyCode == 86) {
	      socket.emit('playedNote', { note: 1, id: playerId, instrument: currentInstrument, volume: 0.5 });
	    }
	  });

	  // get notes from server for all players to play on next beat
	  socket.on('notesPerTempo', function(data){
	    for (var player in data){
	      triggerNote(data[player].note, data[player].instrument, data[player].volume);
	    }
	  });

	  socket.on('rhythmPerTempo', function(data){
	    triggerNote(data.note, data.instrument, data.volume);
	  });

	});


/***/ }
/******/ ]);