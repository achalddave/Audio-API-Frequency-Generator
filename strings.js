function runStrings() {
  var frequency = 220; // frequency you want to play
                       // this is not tuned properly :(

  var context = new webkitAudioContext();
  var destination = context.destination;

  var delaySamples = (context.sampleRate / frequency);
  
  // bufferSize needs to be larger than the delay
  var bufferSize = 2048;
  if (delaySamples > bufferSize) {
    alert("I can't play that frequency...");
    return;
  }

  var buffer = context.createBuffer(1, bufferSize, context.sampleRate);
  var bufferSource = context.createBufferSource();
  bufferSource.buffer = buffer;

  var bufferData = buffer.getChannelData(0);
  for (var i = 0; i < delaySamples+1; i++) {
    bufferData[i] = 2*(Math.random()-0.5); // random noise
  }

  var delayNode = context.createDelayNode(); //delay filter
  var delaySeconds = 1/(frequency); // delaySamples/context.sampleRate
  delayNode.delayTime.value = delaySeconds;

  var lowpassFilter = context.createBiquadFilter();
  lowpassFilter.frequency.value = 20000; // make things sound better

  var gainNode = context.createGainNode();
  gainNode.gain.value = 0.996; // mostly for string to die off quicker

  // see diagram: http://upload.wikimedia.org/wikipedia/commons/9/9d/Karplus-strong-schematic.png
  bufferSource.connect(destination);
  bufferSource.connect(delayNode);
  delayNode.connect(lowpassFilter);
  lowpassFilter.connect(gainNode);
  gainNode.connect(delayNode);
  gainNode.connect(destination);

  bufferSource.noteOn(0);
}
