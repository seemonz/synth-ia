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
	    sounds[instrument] = bufferlist;
	  });
	  bufferLoader.load();
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

	function triggerNotes() {
	  if (currentAudio) {
	    for (var player in currentAudio){
	      if (currentAudio[player].sound){
	        playNote(currentAudio[player].sound, currentAudio[player].instrument, currentAudio[player].volume, currentAudio[player].player);
	      }
	    }
	    playerAudio = null;
	  }
	}

	var rhythmCounter = {};
	function playSynthia(tempo){
	  for (var key in rhythmCounter) {
	    rhythmCounter[key] += tempo;
	    if (rhythmCounter[key] >= synthia[key].tempo) {
	      rhythmCounter[key] = 0;
	      var randNote = Math.floor(Math.random() * 12);

	      // synthia playNote function
	      if (synthia[key].state) {
	        var source = context.createBufferSource();
	        var gainNode = context.createGain();
	        source.buffer = sounds[synthia[key].instrument][randNote];
	        gainNode.gain.value = synthia[key].volume;
	        source.connect(gainNode);
	        gainNode.connect(compressor);
	        compressor.connect(context.destination);
	        source.start(0);
	      }
	    }
	  }
	}

	function startMetronome(start,tempo){
	  // init synthia's rhythmCounter
	  for (var key in synthia) {
	    rhythmCounter[key] = -tempo;
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
	  }
	  window.setTimeout(instance, tempo);
	}


/***/ },
/* 3 */
/***/ function(module, exports) {

	var currentNote;
	$(function() {

	  var frameWidth = document.getElementById('main-frame').clientWidth;
	  var frameHeight = document.getElementById('main-frame').clientHeight;
	  var circleRadius = frameHeight * 0.05;
	  var maxBarHeight = frameHeight * 0.25;
	  var minBarHeight = frameHeight * 0.01;
	  var barWidth = frameHeight * 0.005;
	  var lowerLimit = frameWidth * 0.6;
	  var upperLimit = frameWidth * 0.8;
	  var dataset = [1]

	  var mainSVG = d3.select("#main-frame")
	    .append("svg")
	    .attr("width", frameWidth)
	    .attr("height", frameHeight)
	    .attr("color", "yellow");

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

	  //upper & lower limit lines
	  // mainSVG.append("line")
	  //   .style("stroke", "white")
	  //   .style("stroke-width", 4)
	  //   .attr("x1", lowerLimit)
	  //   .attr("y1", 0)
	  //   .attr("x2", lowerLimit)
	  //   .attr("y2", frameHeight)
	  //   .attr("stroke-dasharray", "1,10");

	  // mainSVG.append("line")
	  //   .style("stroke", "white")
	  //   .style("stroke-width", 4)
	  //   .attr("x1", upperLimit)
	  //   .attr("y1", 0)
	  //   .attr("x2", upperLimit)
	  //   .attr("y2", frameHeight)
	  //   .attr("stroke-dasharray", "1,10");


	  var defs = mainSVG.append("defs");

	  var filter = defs.append("filter")
	    .attr("id", "drop-shadow")
	    .attr("height", "100")
	    .attr("width", "100")

	  filter.append("feGaussianBlur")
	    .attr("in", "SourceGraphic")
	    .attr("stdDeviation", 5)


	  var blurFilter = defs.append("filter")
	    .attr("id", "blur")
	    .append("feGaussianBlur")
	    .attr("in", "SourceGraphic")
	    .attr("stdDeviation", 2)



	  // filter.append("feOffset")
	  //     .attr("in", "blur")
	  //     .attr("dx", 1)
	  //     .attr("dy", 1)
	  //     .attr("result", "offsetBlur")

	  var feMerge = filter.append("feMerge")

	  feMerge.append("feMergeNode")
	    .attr("in", "offsetBlur")

	  feMerge.append("feMergeNode")
	    .attr("in", "SourceGraphic")




	  //main controller circle
	  // mainSVG.append("circle")
	  //   .style("stroke", "none" )
	  //   .style("fill", "red")
	  //   .attr("r", circleRadius)
	  //   .attr("cx", lowerLimit + (upperLimit - lowerLimit)/2)
	  //   .attr("cy", frameHeight/2)
	  //   .attr("filter", "url(#drop-shadow)")


	  var imgs = mainSVG.selectAll("image").data([0]);

	  imgs.enter()
	    .append("svg:image")
	    .attr("id", "nyan-cat")
	    .attr("xlink:href", "../images/nyan_cat.gif")
	    .attr("height", 100)
	    .attr("width", 100)
	    .attr("x", frameWidth * 0.7)
	    .attr("y", frameHeight * 0.35)



	  // mainSVG.append("rect")
	  //   .style("stroke", "yellow")
	  //   .style("fill", "yellow")
	  //   .attr("stroke-width", 3)
	  //   .attr("x", lowerLimit + (upperLimit - lowerLimit)/2 - 50)
	  //   .attr("y", frameHeight/2)
	  //   .attr("ry", 8)
	  //   .attr("rx", 8)
	  //   .attr("height", 105)
	  //   .attr("width", 3)
	  //   .attr("filter", "url(#drop-shadow)")


	  function generateTrail(x, y, height) {

	    var rect = mainSVG.append("rect");
	    // var rect = rects[barIndex];

	    rect.style("fill", function() {
	        if (down || fadeOutCounter > 0) {
	          return "green";
	        } else {
	          return "white";
	        }
	      })
	      .style("stroke", "green")
	      // .attr("filter", "url(#drop-shadow)")

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

	    // barIndex = (barIndex + 1) % NUM_BARS;
	  };

	  var mouseX = frameWidth * 0.8;
	  var mouseY = frameHeight / 2;
	  var percent = 1;
	  var down = false;
	  var clickAndReleased = false;
	  var fadeOutCounter = 0;
	  var fadeInCounter = 0;
	  var fadeOut;

	  $(document).on("mousemove", function(e) {
	    mouseX = e.pageX - $('#main-frame').offset().left;
	    mouseY = e.pageY - $('#main-frame').offset().top;

	    mainSVG.select('#nyan-cat').attr("y", snappyTransition(mouseY) - 50)
	      .attr("x", mouseX - 50);

	    // percent = (mainSVG.select('circle').attr("cx") - lowerLimit)/(upperLimit - lowerLimit);
	    setCurrentNote(mouseY);
	  });


	  function snappyTransition(y) {
	    var noteAreaHeight = (frameHeight / 12);

	    for (var i = 1; i <= 12; i++) {
	      if (y <= noteAreaHeight * i) {
	        return noteAreaHeight / 2 * (2 * i - 1);
	      }
	    }
	  }

	  function setCurrentNote(y) {
	    currentNote = Math.round(-1 * ((y - circleRadius) / (frameHeight / 12) - 12));
	  }

	  $(document).on('mousedown', function(e) {
	    down = true;
	    fadeInCounter = 0;
	  });

	  // $(document).on('keydown', function(e){
	  //    if (e.keyCode === 32){
	  //     down = true;
	  //   }
	  // });

	  $(document).on('mouseup', function(e) {
	    down = false;
	    clickAndReleased = true;
	    fadeOutCounter = 10;
	    // console.log("released")
	  });

	  // $(document).on('keyup', function(e){
	  //    if (e.keyCode === 32){
	  //       down = false;
	  //       clickAndReleased = true;
	  //       fadeOutCounter = 10;
	  //       console.log("")
	  //   }
	  // });


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

	    generateTrail(mouseX - 50, mouseY - setBarHeight() / 2, setBarHeight());


	    if (down) {}

	    if (fadeOutCounter > 0) {
	      fadeOutCounter -= 1;
	    }

	    if (fadeInCounter < 10) {
	      fadeInCounter += 1;
	    }

	  }, 20);



	  $('body').on('keydown', function(event) {
	    // the keys are / Z X C V / A S D F / Q W E R /
	    var keycodes = [90, 88, 67, 86, 65, 83, 68, 70, 81, 87, 69, 82];
	    var noteAreaHeight = (frameHeight / 12);
	    for (var i = 0; i <= 12; i++) {
	      if (keycodes.indexOf(event.keyCode) === (-1 * (i - 12))) {
	        mouseY = noteAreaHeight / 2 * (2 * i - 1);
	        mainSVG.select('#nyan-cat').attr("y", mouseY - 50)
	        down = true;
	        fadeInCounter = 0;
	      }
	    }
	  })

	  $('body').on('keyup', function(event) {
	    var keycodes = [90, 88, 67, 86, 65, 83, 68, 70, 81, 87, 69, 82];
	    if (keycodes.indexOf(event.keyCode) != -1) {
	      down = false;
	      clickAndReleased = true;
	      fadeOutCounter = 10;
	    }
	  })


	  /* =============== space shit ================== */

	  // var ctx = c.getContext("2d");
	  var stars = [];
	  var initialStars = 50;
	  var n = initialStars;
	  var incrementStars = 5;
	  var maxSize = 5;
	  // mouse = false,
	  var i;

	  var secondFrameWidth = document.getElementById('second-frame').clientWidth;
	  var secondFrameHeight = document.getElementById('second-frame').clientHeight;

	  var secondSVG = d3.select("#second-frame")
	    .append("svg")
	    .attr("width", secondFrameWidth)
	    .attr("height", secondFrameHeight)


	  function init() {
	    for (i = 0; i < initialStars; i++) {
	      stars.push({
	        x: Math.floor(Math.random() * secondFrameWidth),
	        y: Math.floor(Math.random() * secondFrameHeight),
	        size: Math.random() * maxSize,
	        speed: undefined
	      });
	    }

	    draw();
	  }



	  function draw() {
	    // ctx.clearRect(0,0,c.width,c.height);
	    // $("#mainFrame").empty();
	    // svg.selectAll("*").remove();

	    secondSVG.selectAll("*").remove();
	    for (var i = 0; i < n; i++) {
	      star = stars[i];
	      secondSVG.append("circle")
	        // .style("stroke", "none" )
	        .style("fill", "white")
	        .attr("r", star.size / 2)
	        .attr("cx", star.x)
	        .attr("cy", star.y)


	    }
	  }


	  function update() {
	    for (var i = 0; i < n; i++) {
	      star = stars[i];
	      star.speed = star.size;

	      // if (mouse)
	      //   star.x-=star.speed*10;
	      // else
	      star.x -= star.speed;

	      if (star.x < 0) {
	        // delete star;
	        // console.log("must delete!!");
	        // secondSVG.select('circle')
	        star.x += secondFrameWidth;
	      }
	    }
	  }


	  function createNewStars() {
	    // n+=incrementStars;
	    // console.log(n);
	    for (var i = 0; i < incrementStars; i++) {
	      stars.push({
	        x: +Math.floor(Math.random() * secondFrameWidth),
	        y: Math.floor(Math.random() * secondFrameHeight),
	        size: Math.random() * maxSize,
	        speed: undefined
	      });
	    }
	  }


	  function main() {
	    draw();
	    update();
	    requestAnimationFrame(main);
	  }

	  setInterval(createNewStars, 500);
	  init();
	  main();



	});


/***/ },
/* 4 */
/***/ function(module, exports) {

	var currentAudio;
	var playerAudio;
	var currentInstrument;
	var synthia;
	var scene;
	var currentX;
	var currentY;

	$(function(){
	  var socket = io();
	  var playerId = 0;
	  currentInstrument = '';

	  // update current mouse X, Y to pass for visualization
	  // $('#main-frame').on("mousemove", function(e) {
	  //   currentX = e.clientX - $('#main-frame').offset().left;
	  //   currentY = e.clientY - $('#main-frame').offset().top;
	  //   console.log(currentX + ',' + currentY)
	  // });

	  // receive playerId from server
	  socket.on('assignPlayerId', function(data){
	    if (playerId === 0){
	      playerId = data.id;
	    }
	  });

	  // gets scene info
	  socket.on('sceneData', function(data){
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

	$( function(){
	  // bring up modal box
	  $('body').append('<div id="overlay"></div>');
	  $('body').append('<div id="modal"><h1>Choose your Scene!</h1><button class="scenes">Earth</button><button class="scenes">Space</button><button class="scenes">Deigo</button><button class="scenes">Synth</button></div>');

	  // scene selection
	  var sceneButtons = $('.scenes');
	  sceneButtons.on('click', function(){
	    currentScene = $(this).text();
	  });

	});


/***/ }
/******/ ]);