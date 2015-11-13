function playRhythmNote(actualNote) {
  var note = ('audio/rhythm/note'+actualNote+'.wav')
  var audio = new Audio(note);
  audio.volume = 0.1;
  audio.play();
  console.log(note);
}
