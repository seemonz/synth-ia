window.AudioContext = window.AudioContext || window.webkitAudioContext;
context = new AudioContext();
var package
$(function(){
  initInstrument('earth-harp');
  initInstrument('earth-piano');
  initInstrument('earth-rhode');
  initInstrument('earth-glock');
})

function initInstrument(instrument) {
  var files = [
        'audio/earth/'+instrument+'/note1.wav',
        'audio/earth/'+instrument+'/note2.wav',
        'audio/earth/'+instrument+'/note3.wav',
        'audio/earth/'+instrument+'/note4.wav',
        'audio/earth/'+instrument+'/note5.wav',
        'audio/earth/'+instrument+'/note6.wav',
        'audio/earth/'+instrument+'/note7.wav',
        'audio/earth/'+instrument+'/note8.wav',
        'audio/earth/'+instrument+'/note9.wav',
        'audio/earth/'+instrument+'/note10.wav',
        'audio/earth/'+instrument+'/note11.wav',
        'audio/earth/'+instrument+'/note12.wav'
  ]
  bufferLoader = new BufferLoader(context, files, function(bufferlist){
    sounds[instrument] = bufferlist

  });
  bufferLoader.load()
}

var sounds = {}

function triggerNote(note, instrument, volume, player) {
  var source = context.createBufferSource();
  var gainNode = context.createGain();
  source.buffer = sounds[instrument][note];
  gainNode.gain.value = volume;
  source.connect(gainNode);
  gainNode.connect(compressor);
  compressor.connect(context.destination);
  source.start(0);
  game[player].key = ""
}

var compressor = context.createDynamicsCompressor();
compressor.threshold.value = -20;
compressor.knee.value = 25;
compressor.ratio.value = 12;
compressor.reduction.value = -30;
compressor.attack.value = 0;
compressor.release.value = .2;

var triggerNotes = function () {
  if(game)
  Object.keys(game).forEach(function(key){
    var player = game[key]
    if(player.key){
      triggerNote(player.key,player.instrument,player.volume,player.player)
    }
  })
  package = null
}

var startMetronome = function(start,tempo){
      time = 0,
      elapsed = '0.0';
  function instance() {
      time += tempo;
      elapsed = Math.floor(time / tempo) / 10;
      if(Math.round(elapsed) == elapsed) { elapsed += '.0'; }
      var diff = (new Date().getTime() - start) - time;
      window.setTimeout(instance, (tempo - diff));
      triggerNotes();
  } 
  window.setTimeout(instance, tempo);
}