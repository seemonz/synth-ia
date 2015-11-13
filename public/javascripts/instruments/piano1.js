function playNote(actualNote) {
  var note = ('audio/piano1/note'+actualNote+'.wav')
  var audio = new Audio(note);
  audio.volume = 0.1;
  audio.play();
  console.log(note);
}
