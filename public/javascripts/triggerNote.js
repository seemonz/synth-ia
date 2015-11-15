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
