// global context from audioSetup.js
function StringNote (frequency) {
  this.frequency = typeof frequency === "undefined" ? 440 : frequency;
  this.context = context;
  this.delaySamples = (context.sampleRate / this.frequency);
}

StringNote.prototype.setupFilters = function () {
  // delay
  var delayNode = this.context.createDelayNode(); // delay filter
  var delaySeconds = 1/this.frequency; // delaySamples/context.sampleRate
  delayNode.delayTime.value = delaySeconds;
  
  // lowpass
  var lowpassFilter = context.createBiquadFilter();
  lowpassFilter.type = lowpassFilter.LOWPASS;
  lowpassFilter.frequency.value = 20000; // make things sound better

  // gain
  var gainNode =  context.createGainNode();
  gainNode.gain.value = 0.996; // mostly for string to die off quicker

  this.lowpassFilter = lowpassFilter;
  this.delayNode = delayNode;
  this.gainNode = gainNode;

  this.playing = false;
}

StringNote.prototype.setupBuffer = function () {
  // noise
  
  // bufferSize just needs to be larger than the delay
  var bufferSize = 2048;

  var buffer = context.createBuffer(1, bufferSize, context.sampleRate);
  var bufferSource = context.createBufferSource();
  bufferSource.buffer = buffer;

  var delaySamples = this.delaySamples;
  if (delaySamples > bufferSize) {
    alert("I can't play that frequency...");
    return;
  }
  var bufferData = buffer.getChannelData(0);
  for (var i = 0; i < delaySamples+1; i++) {
    bufferData[i] = 2*(Math.random()-0.5); // random noise
  }

  this.bufferSource = bufferSource;
}

StringNote.prototype.play = function () {
  this.setupFilters();
  this.setupBuffer(); // noise

  var context = this.context,
      destination = context.destination,
      delayNode = this.delayNode,
      lowpassFilter = this.lowpassFilter,
      gainNode = this.gainNode,
      bufferSource = this.bufferSource;
  // see diagram: http://upload.wikimedia.org/wikipedia/commons/9/9d/Karplus-strong-schematic.png
  bufferSource.connect(destination);
  bufferSource.connect(delayNode);
  delayNode.connect(lowpassFilter);
  lowpassFilter.connect(gainNode);
  gainNode.connect(delayNode);
  gainNode.connect(destination);

  bufferSource.noteOn(0);
  this.playing = true;
}

StringNote.prototype.pause = function () {
  this.playing = false;
  this.bufferSource.noteOff(0);
  
  // disconnect all the things
  this.delayNode.disconnect();
  this.lowpassFilter.disconnect();
  this.gainNode.disconnect();
}

StringNote.prototype.setFrequency = function (frequency) {
  this.frequency = frequency;
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
