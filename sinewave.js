// basic set up
var AudioContext = (function() {
  // cross browser some day?
  return window.AudioContext ||
          window.mozAudioContext ||
          window.msAudioContext ||
          window.oAudioContext ||
          window.webkitAudioContext;
})();

var context = new AudioContext();
// deprecated noteOn/noteOff fix
var tmpOscillator = context.createOscillator();
if (typeof(tmpOscillator.start) == "undefined") {
  tmpOscillator.constructor.prototype.start = tmpOscillator.constructor.prototype.noteOn;
  tmpOscillator.constructor.prototype.stop = tmpOscillator.constructor.prototype.noteOff;
}
delete context;
delete tmpOscillator;

function OscillatorWrapper(context) {
  this.context = context;
  this.oscillator;
  this.type;
}

OscillatorWrapper.prototype.play = function() {
  var context = this.context,
      oscillator = context.createOscillator();

  oscillator.connect(context.destination);
  oscillator.type = oscillator[this.type];
  oscillator.start(0);
  this.oscillator = oscillator;
}

OscillatorWrapper.prototype.pause = function() {
  this.oscillator.stop(0);
  // can only start/stop once per oscillator node
  delete this.oscillator; 
}

OscillatorWrapper.prototype.togglePlay = function() {
  if (this.oscillator) {
    this.pause();
  } else {
    this.play();
  }
}

SineOscillator.prototype = new OscillatorWrapper;
SineOscillator.prototype.constructor = SineOscillator;

function SineOscillator(context) {
  this.type = 'SINE';
  this.context = context;
}
