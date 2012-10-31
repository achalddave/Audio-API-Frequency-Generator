function runStrings() {
  var frequency = 220;

  var context = new webkitAudioContext();
  var destination = context.destination;

  var delaySamples = (context.sampleRate / frequency);
  // delaySamples should be less than this almost all the time
  // (only need more samples if frequency is lower than 21
  var bufferSize = 2048;
  if (delaySamples > bufferSize) {
    alert("I can't play that frequency...");
    return;
  }

  var buffer = context.createBuffer(1, bufferSize, context.sampleRate);
  var bufferSource = context.createBufferSource();
  bufferSource.buffer = buffer;

  var bufferData = buffer.getChannelData(0);
  console.log(delaySamples);
  for (var i = 0; i < delaySamples+1; i++) {
    bufferData[i] = 2*(Math.random()-0.5); // random noise
  }

  var delayNode = context.createDelayNode(); //delay filter
  //var delaySeconds = (delaySamples/context.sampleRate);
  var delaySeconds = 1/(frequency);
  console.log(delaySamples, delaySeconds);
  delayNode.delayTime.value = delaySeconds; // delay time

  var lowpassFilter = context.createBiquadFilter(); // lowpass
  lowpassFilter.type = lowpassFilter.LOWPASS;
  lowpassFilter.frequency.value = 20000;

  var gainNode = context.createGainNode();
  gainNode.gain.value = 0.996;

  //bufferSource.loop = true;
  bufferSource.connect(destination);
  bufferSource.connect(delayNode);
  delayNode.connect(lowpassFilter);
  lowpassFilter.connect(gainNode);
  gainNode.connect(delayNode);
  gainNode.connect(destination);

  //delayNode.connect(destination);
  //delayNode.connect(delayNode);
  bufferSource.noteOn(0);
}
