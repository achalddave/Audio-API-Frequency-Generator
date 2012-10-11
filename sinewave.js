var audioContext = (function() {
  // cross browser some day?
  return window.AudioContext ||
          window.mozAudioContext ||
          window.msAudioContext ||
          window.oAudioContext ||
          window.webkitAudioContext;
})();

var context = new audioContext(); // AND THEN THERE WAS SOUND
