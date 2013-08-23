var Sound = function() {
    this.ac = new webkitAudioContext();    
    this._volume = this.ac.createGain();
    this._volume.connect(this.ac.destination);
    this.setVolume(0.1);

    this.Notes = {
        a: 220.0,
        b: 246.94,
        c: 261.63,
        d: 293.66,
        e: 329.63,
        f: 349.23
    };
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
        o.connect(self._volume);
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

Sound.prototype.playFile = function(url) {
    var self = this;
    var buff = 0;
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";

    var play = function(b) {
        source = self.ac.createBufferSource()
        source.buffer = b;
        source.connect(self.ac.destination);
        source.noteOn(0); 
    };

    var source = self.ac.createBufferSource();
    request.onload = function() {
        // Read the white noise and play it on a loop
        self.ac.decodeAudioData(request.response,
            function(buffer) {
                play(buffer);
                self.bgTimer = setInterval(function() {
                    play(buffer);
                }, 8000);
            }    
        );

    }

    request.send();
}

Sound.prototype.stopBackground = function() {
    clearInterval(self.bgTimer);
}

Sound.prototype.setVolume = function(vol) {
    this._volume.gain.value = vol;
    console.log(vol);
}
