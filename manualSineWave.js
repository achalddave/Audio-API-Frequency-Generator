// this was simply a test to manually create a sine wave, without
// the oscillator class
function manualPlaySineWave(frequency) {

  var context = new webkitAudioContext();

  var bufferSize = 1024;
  var buffer = context.createBuffer(1, bufferSize, context.sampleRate);
  var bufferSource = context.createBufferSource();
  bufferSource.buffer = buffer;

  var bufferData = buffer.getChannelData(0);
  for (var i = 0; i < bufferData.length; i++) {
    // 1 sine wave in buffer
    bufferData[i] = Math.sin((i/bufferSize)*(2*Math.PI));
  }

  bufferSource.loop = true;
  // calculate the frequency we want
  bufferSource.playbackRate.value = frequency / (context.sampleRate / bufferSize);
  bufferSource.connect(context.destination);
  bufferSource.noteOn(0);
}
