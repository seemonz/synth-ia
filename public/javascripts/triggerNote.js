function triggerNote(note, instrument) {
  var note = ('audio/' +instrument+ '/note' +note+ '.wav')
  var audio = new Audio(note);
  audio.volume = 0.1;
  audio.play();
  // console.log(note);
}

// triggerNote will have note = number, instrument
// function triggerNote(note, instrument) {
//   var soundfile = ['audio/' +instrument+ '/note' +note+ '.wav']
//   bufferLoader = new BufferLoader(context, soundfile, startNote);
//   bufferLoader.load();
// }
//
// function startNote(bufferList) {
//   var source = context.createBufferSource();
//   source.buffer = bufferList[0];
//   source.connect(context.destination);
//   source.start(0);
// }
