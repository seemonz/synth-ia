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
  });
}
