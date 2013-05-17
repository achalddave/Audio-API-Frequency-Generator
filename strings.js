// global context from audioSetup.js
function StringNote (frequency) {
  this.duration = 2;
  this.frequency = frequency;
  this.N = Math.round(context.sampleRate / this.frequency);
  this.node = context.createJavaScriptNode(4096, 0, 1);
  this.playing = false;
  this.timeoutId = null;

}

StringNote.prototype.play = function () {
  var self = this,
      N = Math.round(this.N),
      signal = new Float32Array(N),
      signalOffset = 0,
      noiseOffset = 0,
      noise = 0;
  this.timeoutId = setTimeout(function() { self.pause(); } , 1000 * self.duration);

  this.node.onaudioprocess = function(e) {
    var output = e.outputBuffer.getChannelData(0);

    for (var i = 0; i < e.outputBuffer.length; i++) {
      if (noise < N) {
        output[i] = signal[signalOffset] = 2*(Math.random() - 0.5);
        noise++;
      } else {
        output[i] = signal[signalOffset] = self.decay*(signal[signalOffset] + signal[(signalOffset+1) % N]) / 2;
      }
      // wrap around if necessary
      signalOffset = (signalOffset+1) % N;
    }
  }

  this.node.connect(context.destination);
  this.playing = true;
}

StringNote.prototype.pause = function () {
  console.log("pausing");
  clearTimeout(this.timeoutId);
  this.node.disconnect(context.destination);
  this.playing = false;
}

StringNote.prototype.setFrequency = function (frequency) {
  this.frequency = frequency;
  this.N = context.sampleRate / frequency;

  /*
   * The decay after the n^th pass through delay + low pass is
   *    (cos(pi * f * T_f)*decay)^n
   * where T_f is the inverse of the sample rate. 
   * 
   * We care about the decay per time t, since we want to be able to play a
   * string for a particular duration. With a sampling rate of s, we go
   * through n samples in time t = n / s. Furthermore, in one pass, we go
   * through N + 1/2 samples (the 1/2 comes about as the phase delay from
   * the averaging low pass). 
   *
   * The number of seconds until the magnitude is below audible levels
   * (generally -60dB) can then be calculated (or rather approximated as):
   * ln(1000) * t_f where t_f is the "time constant" (time until the
   * magnitude reaches 1/e the initial value).
   *
   * The duration for a given decay then comes out to:
   *  dur = -(N + 0.5) * ln(1000) / (ln(decay*cos(pi * freq / s)) * s);
   * where s is the sampleRate
   *
   * We can use this to get a decay given the user input duration:
   *  decay = e^{(-(N + 0.5) * ln(1000)) / (dur * s)} / cos(pi * freq / s);
   *    
   * Derivations from 
   *   Jaffe and Smith "Extensions of the Karplus-Strong Plucked-String
   *   Algorithm"
   */

  // variables to make equation more readable
  var f = this.frequency,
      s = context.sampleRate,
      pi = Math.PI,
      powE = function(x) { return Math.pow(Math.E, x); },
      cos = Math.cos,
      dur = this.duration,
      N = this.N;

  // 6.908 ~= ln(1000);
  this.decay = powE((-(N + 0.5) * 6.908) / (dur * s)) / cos(pi * f / s);
  console.log("f: " + f + "; duration: " + dur + "; decay: " + this.decay);
}

/*
StringNote.prototype.togglePlay = function () {
  console.log(this.playing);
  if (this.playing) {
    this.pause();
  } else {
    this.play();
  }
}
*/
