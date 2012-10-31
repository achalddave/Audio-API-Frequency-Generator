var context = new AudioContext(), // AND THEN THERE WAS SOUND
    sineOscillator = new SineOscillator(context),
    stringNote = new StringNote();

var freq = document.getElementById("freq"),
    sineButton = document.getElementById("sinewave"),
    stringButton = document.getElementById("strings");

sineButton.onclick = function () {
  sineOscillator.setFrequency(freq.value)
  sineOscillator.togglePlay();
}

stringButton.onclick = function () {
  stringNote.setFrequency(freq.value);
  stringNote.play();
}
