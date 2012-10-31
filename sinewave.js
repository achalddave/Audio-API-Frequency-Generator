// global context from audioSetup.js
function OscillatorWrapper(context) {
  this.context = context;
  this.oscillator;
  this.type;
  this.wavetable;
  this.frequency;
}

OscillatorWrapper.prototype.setFrequency = function(frequency) {
  console.log(frequency);
  this.frequency = frequency;
}

OscillatorWrapper.prototype.play = function() {
  var context = this.context,
      oscillator = context.createOscillator();

  console.log(this.frequency);
  oscillator.frequency.value = this.frequency || 440;
  oscillator.connect(context.destination);

  oscillator.type = oscillator[this.type];
  if (this.wavetable) {
    oscillator.setWaveTable(this.wavetable)
  }

  oscillator.noteOn(0);

  this.oscillator = oscillator;
}

OscillatorWrapper.prototype.pause = function() {
  this.oscillator.noteOff(0);
  // can only play once per oscillator node
}

OscillatorWrapper.prototype.togglePlay = function() {
  if (this.isPlaying()) {
    this.pause();
  } else {
    this.play();
  }
}

OscillatorWrapper.prototype.isPlaying = function() {
  return typeof(this.oscillator) === "undefined" ? false : true;
}

SineOscillator.prototype = new OscillatorWrapper;
SineOscillator.prototype.constructor = SineOscillator;

function SineOscillator(context) {
  this.type = 'SINE';
  this.context = context;
}

// WavetableSineOscillator : can be used to play a wave by specifying
// the Fourier Series coefficients (!)
//
// Not currently used

WavetableSineOscillator.prototype = new OscillatorWrapper;
WavetableSineOscillator.prototype.constructor = WavetableSineOscillator;

function WavetableSineOscillator(context) {
  // Example: 
  //  var realArr = new Float32Array([0, 0]);
  //  var imagArr = new Float32Array([0, 1]);
  //
  //  plays a sine wave (a_0 = 0, a_1 = 0 // b_0 = 0 [undefined], b_1 = 1)
  
  var realArr = new Float32Array(),
      imagArr = new Float32Array();
  this.wavetable = context.createWaveTable(realArr, imagArr);
  console.log(this.wavetable);
  this.context = context;
}

