// basic set up
var AudioContext = (function() {
  // cross browser some day?
  return window.AudioContext ||
          window.mozAudioContext ||
          window.msAudioContext ||
          window.oAudioContext ||
          window.webkitAudioContext;
})();

context = new AudioContext();
