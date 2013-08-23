var Sound = function() {
    this.ac = new webkitAudioContext();    
    this._volume = this.ac.createGain();
    this._volume.connect(this.ac.destination);
    this.setVolume(0.1);
    this._chords = [];
    this._numOsc = 0.0;

    this.Notes = {
        a: 220.0,
        b: 246.94,
        c: 261.63,
        d: 293.66,
        e: 329.63,
        f: 349.23,
        g: 392.00
    };

    this.Chords = {
        a: [this.Notes.a, this.Notes.d, this.Notes.e],
        b: [this.Notes.b, this.Notes.e, this.Notes.f],
        c: [this.Notes.c, this.Notes.e, this.Notes.g],
        d: [this.Notes.d, this.Notes.g, this.Notes.a],
        e: [this.Notes.e, this.Notes.a, this.Notes.b]
    }

    this.allChords = [this.Chords.c];
    //this.allChords = [this.Chords.a, this.Chords.b, this.Chords.c,
    //    this.Chords.d, this.Chords.e];
}

Sound.prototype.addOscillator = function() {
    var oldNumOsc = this._numOsc;
    this._numOsc = this._numOsc + 1.0;
    this.setVolume(this._volume.gain.value*oldNumOsc);
    return this.ac.createOscillator();
}

Sound.prototype.removeOscillator = function() {
    var oldNumOsc = this._numOsc;
    this._numOsc = this._numOsc - 1.0;
    this.setVolume(this._volume.gain.value*oldNumOsc);
}

Sound.prototype.play = function(freq) {
    this.osc = this.addOscillator();
    this.osc.frequency.value = freq;
    this.osc.connect(this.ac.destination);
    this.osc.noteOn(0);
}

Sound.prototype.playChord = function(freqs) {
    var self = this;
    var curChord = [];
    freqs.forEach(function(f) {
        var o = self.addOscillator();
        o.frequency.value = f;
        o.connect(self._volume);
        curChord.push(o);
    });

    curChord.forEach(function(o) {
        o.noteOn(0);
    });

    return self._chords.push(curChord);
}

Sound.prototype.stop = function() {
    this.osc.noteOff(0);
}

Sound.prototype.stopChord = function(i) {
    var self = this;
    function off(c) {
        c.forEach(function(o) {
            self.removeOscillator();
            o.noteOff(0);
        });
    }

    // If no index, turn off all chords, otherwise
    // turn of specific chord by index
    if (i == undefined) {
        this._chords.forEach(function(chord) {
            off(chord);
        });
    } else {
        off(this._chords[i]);
    }
}

Sound.prototype.playFile = function(url) {
    var self = this;
    var buff = 0;
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";

    var play = function(b) {
        self._bgSource = self.ac.createBufferSource()
        self._bgSource.buffer = b;
        self._bgSource.connect(self.ac.destination);
        self._bgSource.noteOn(0); 
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
    var self = this;
    clearInterval(self.bgTimer);
    self.bgTimer = 0;
    this._bgSource.noteOff(0);
}

Sound.prototype.setVolume = function(vol) {
    this._volume.gain.value = vol/this._numOsc;
    console.log(this._volume.gain.value);
}

Sound.prototype.setAdvisoryLevel = function(level) {
    // Make the number of tones a factor of the level
    var numTones = parseInt(level*10);
    for (var i = 0; i < numTones; i++) {
        this.playChord(this.allChords[i]);
    }

    // Make volume a factor of level
}
