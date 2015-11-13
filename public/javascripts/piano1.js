var piano = []
var context;
var bufferLoader;

$(function init() {
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  context = new AudioContext();

  bufferLoader = new BufferLoader(
    context,
    [
      'audio/piano1/note1.wav',
      'audio/piano1/note2.wav',
      'audio/piano1/note3.wav',
      'audio/piano1/note4.wav',
      'audio/piano1/note5.wav',
      'audio/piano1/note6.wav',
      'audio/piano1/note7.wav',
      'audio/piano1/note8.wav',
      'audio/piano1/note9.wav',
      'audio/piano1/note10.wav',
      'audio/piano1/note11.wav',
    ],
    finishedLoading
    );

  bufferLoader.load();
}

function finishedLoading(bufferList) {
  bufferList.forEach( function(audio_file) {
    var source = context.createBufferSource();
    source.buffer = audio_file;
// CONNECTING EFFECTS HERES
    source.connect(context.destination);
    piano.push(source)
  })
});

function playNote(note_number) {
  console.log(note_number);
  piano[note_number].start(0);
}

