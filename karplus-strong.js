function StringNote(context, frequency) {
  this.context = context;
  this.sampleRate = context.sampleRate;
  this.delaySamples = this.sampleRate/frequency;
  this.jsNode = context.createJavascriptNode();
}

StringNote.prototype.play = function () {
  var context = this.context;
  var source 
}
