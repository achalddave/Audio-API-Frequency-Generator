// global context from audioSetup.js
function StringNote (frequency) {
  this.frequency = typeof frequency === "undefined" ? 440 : frequency;
  this.context = context;
  this.node = context.createJavaScriptNode(4096, 0, 1);
  this.playing = false;

}

StringNote.prototype.play = function () {
  var self = this,
      N = Math.round(this.N),
      signal = new Float32Array(N),
      signalOffset = 0,
      noiseOffset = 0,
      noise = 0;

  this.node.onaudioprocess = function(e) {
    var output = e.outputBuffer.getChannelData(0);

    for (var i = 0; i < e.outputBuffer.length; i++) {
      if (noise < N) {
        output[i] = signal[signalOffset] = 2*(Math.random() - 0.5);
        noise++;
      } else {
        output[i] = signal[signalOffset] = (signal[signalOffset] + signal[(signalOffset+1) % N]) / 2;
      }
      // wrap around if necessary
      signalOffset = (signalOffset+1) % N;
    }
  }

  // see diagram: http://upload.wikimedia.org/wikipedia/commons/9/9d/Karplus-strong-schematic.png

  this.node.connect(this.context.destination);
  this.playing = true;
}

StringNote.prototype.pause = function () {
  this.playing = false;
}

StringNote.prototype.setFrequency = function (frequency) {
  this.frequency = frequency;
  this.N = context.sampleRate / frequency;
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
