// function triggerNote(note, instrument) {
//   var note = ('audio/' +instrument+ '/note' +note+ '.wav')
//   var audio = new Audio(note);
//   audio.volume = 0.1;
//   audio.play();
//   // console.log(note);
// }
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  context = new AudioContext();
// triggerNote will have note = number, instrument
function triggerNote(note, instrument) {
  var soundfile = ['audio/' +instrument+ '/note' +note+ '.wav']
  bufferLoader = new BufferLoader(context, soundfile, startNote);
  bufferLoader.load();
}

function startNote(bufferList) {
  var source = context.createBufferSource();
  source.buffer = bufferList[0];
  gainNode.gain.value = .9;
  source.connect(gainNode);
  gainNode.connect(compressor);
  compressor.connect(context.destination);
  source.start(0);
}
var gainNode = context.createGain();

var compressor = context.createDynamicsCompressor();
compressor.threshold.value = -20;
compressor.knee.value = 25;
compressor.ratio.value = 12;
compressor.reduction.value = -30;
compressor.attack.value = 0;
compressor.release.value = .2;
