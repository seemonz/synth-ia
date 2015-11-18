window.AudioContext = window.AudioContext || window.webkitAudioContext;
context = new AudioContext();

$(function(){
  initInstrument('earth-harp');
  initInstrument('earth-piano');
  initInstrument('earth-rhode');
  initInstrument('earth-glock');
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
    if (Object.keys(sounds).length === 4) {
      triggerNotes();
      playSynthia(tempo);
    }
  } 
  window.setTimeout(instance, tempo);
}