var context = new AudioContext(), // AND THEN THERE WAS SOUND
    sineOscillator = new SineOscillator(context);

gsine = sineOscillator;

var freqRange = document.getElementById("freq"),
    playButton = document.getElementById("play");

playButton.onclick = function() {
  sineOscillator.setFrequency(freqRange.value)
  sineOscillator.togglePlay();
}

freqRange.onmousedown = function() {
  if (sineOscillator.isPlaying()) {
    paused = true;
    sineOscillator.pause();
  }
}

freqRange.onmouseup = function() {
  if (typeof paused !== "undefined" && paused) {
    sineOscillator.setFrequency(440);
    sineOscillator.play();
    paused = false;
  }
}

// STRINGS
var stringButton = document.getElementById('strings');
stringButton.onclick = runStrings;
