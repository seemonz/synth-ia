window.AudioContext = window.AudioContext || window.webkitAudioContext;
context = new AudioContext();
var package
$(function(){
  initSpaceLeeds();
})

function initSpaceLeeds() {
  var leed = [
        'audio/space-leed/note1.mp3',
        'audio/space-leed/note2.mp3',
        'audio/space-leed/note3.mp3',
        'audio/space-leed/note4.mp3',
        'audio/space-leed/note5.mp3',
        'audio/space-leed/note6.mp3',
        'audio/space-leed/note7.mp3',
        'audio/space-leed/note8.mp3',
        'audio/space-leed/note9.mp3',
        'audio/space-leed/note10.mp3',
        'audio/space-leed/note11.mp3',
        'audio/space-leed/note12.mp3'
  ]
  bufferLoader = new BufferLoader(context, leed, saveLeeds);
  bufferLoader.load();
}

var sounds = {}

function saveLeeds(bufferlist){
  sounds['space-leed'] = bufferlist
}

function triggerNote(note, instrument, volume,player) {
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
      triggerNotes()
  } 
  window.setTimeout(instance, tempo);
}