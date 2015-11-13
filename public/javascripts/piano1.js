$( 'button' ).on('click', function() {
  var random_note = Math.floor(Math.random() * 11) + 1;
  playNote(random_note);
});

function playNote(actual_note) {
  var note = ('audio/piano1/note'+actual_note+'.wav')
  var audio = new Audio(note);
  audio.volume = 0.1;
  audio.play();
  console.log(note);
}