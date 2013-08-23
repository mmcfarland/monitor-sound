var Signal = function(name) {
    this.name = name;
    this.maximum = null;
    this.minimum = null;
    this.value = null;
    this.setTransform(Signal.prototype.linearTransform);
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
    this.value = newValue;
    return this.transform(this.value);
}

Signal.prototype.getValue = function() {
    return this.transform(this.value);
}
