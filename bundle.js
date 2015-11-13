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

	// function playNote(actualNote) {
	//   var note = ('audio/piano1/note'+actualNote+'.wav')
	//   var audio = new Audio(note);
	//   audio.volume = 0.1;
	//   audio.play();
	//   console.log(note);
	// }



	// triggerNote will have note = number, instrument
	function triggerNote(note, instrument) {
	  var soundfile = ['audio/' +instrument+ '/note' +note+ '.wav']
	  bufferLoader = new BufferLoader(context, soundfile, startNote);
	  bufferLoader.load();
	}

	function startNote(bufferList) {
	  var source = context.createBufferSource();
	  source.buffer = bufferList[0];
	  source.connect(context.destination);
	  source.start(0);
	}


/***/ },
/* 3 */
/***/ function(module, exports) {

	function playRhythmNote(actualNote) {
	  var note = ('audio/rhythm/note'+actualNote+'.wav')
	  var audio = new Audio(note);
	  audio.volume = 0.1;
	  audio.play();
	  console.log(note);
	}

	function playTempoNote(actualNote) {
	  var note = ('audio/rhythm/note'+actualNote+'.wav')
	  var audio = new Audio(note);
	  audio.volume = 0.1;
	  audio.play();
	  console.log(note);
	}


/***/ }
/******/ ]);