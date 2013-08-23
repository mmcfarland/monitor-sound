var Sound = function() {
    this.ac = new webkitAudioContext();    
}

Sound.prototype.play = function(freq) {
    this.osc = this.ac.createOscillator();
    this.osc.frequency.value = freq;
    this.osc.connect(this.ac.destination);
    this.osc.noteOn(0);
}

Sound.prototype.playChord = function(freqs) {
    var self = this;
    this.curChord = [];
    freqs.forEach(function(f) {
        var o = self.ac.createOscillator();
        o.frequency.value = f;
        o.connect(self.ac.destination);
        self.curChord.push(o);
    });

    this.curChord.forEach(function(o) {
        o.noteOn(0);
    });
}

Sound.prototype.stop = function() {
    this.osc.noteOff(0);
}

Sound.prototype.stopChord = function() {
    this.curChord.forEach(function(o) {
        o.noteOff(0);
    });
}

