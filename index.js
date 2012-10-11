var context = new AudioContext(), // AND THEN THERE WAS SOUND
    sineOscillator = new SineOscillator(context);

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
  if (paused) {
    sineOscillator.setFrequency(freqRange.value);
    sineOscillator.play();
  }
}
