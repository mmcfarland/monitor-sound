var Signal = function(name) {
    this.name = name;
    this.maximum = null;
    this.minimum = null;
    this.value = null;
    this.setTransform(Signal.prototype.linearTransform);
    this.listeners = [];
}

Signal.prototype.setRange = function(min,max) {
    this.minimum = min;
    this.maximum = max;
}

Signal.prototype.linearTransform = function(value) {
    if(value > this.maximum) {
        return 2;
    } else if (value < this.minimum) {
        return -1;
    } else {
       return (value - this.minimum)/this.getSpan();
    }
}

Signal.prototype.getSpan = function() {
    return this.maximum - this.minimum;
}

Signal.prototype.setTransform = function(transformFxn) {
    this.transform = transformFxn;
}

Signal.prototype.update = function(newValue) {
    // Set new value, notify listeners
    var self = this;
    this.value = newValue;
    this.listeners.forEach(function(f) {
        f.call(self,self.getValue());
    });
}

Signal.prototype.getValue = function() {
    return this.transform(this.value);
}

Signal.prototype.register = function(fxn) {
    this.listeners.push(fxn);
}
