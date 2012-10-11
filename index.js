var context = new AudioContext(); // AND THEN THERE WAS SOUND
var s = new SineOscillator(context);

var playButton = document.getElementById("play");
playButton.onclick = function() {
  s.togglePlay();
}
