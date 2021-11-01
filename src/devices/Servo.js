'use strict';

const fs = require('fs');
const Device = require('./Device');

class Servo extends Device {

  constructor (options) {
    super();
    this.plugin = require('./servo-plugins/'+options.plugin);
    this.pin = options.pin;
    
    console.log('Servo: options', options);
    console.log('Servo: pin', this.pin);
    console.log('Servo: plugin', this.plugin);

    this.fifo = fs.createWriteStream(
      '/dev/pi-blaster',
      {flags: 'w', encoding: 'ascii'});

    this.period = this.plugin.period || 10000;
    this.maxPulse = this.plugin.maxPulse || this.period;
    this.minPulse = this.plugin.minPulse || 0;
    this.sweep = this.plugin.sweep || 90;
  }

  async _pulse(pulseWidth) {

    console.log('pulse', pulseWidth);
    this.fifo.write(`${this.pin}=${pulseWidth}\n`);

  }

  async angle(degrees) {

    console.log('Servo::angle', degrees);

    let sweepPct = Math.min(Math.max(1.0*degrees/this.sweep, 0), 1);

    let period = this.period || 10000;
    // let minPulse = 0;
    // let maxPulse = period;
    let pulseSize = sweepPct * (this.maxPulse - this.minPulse) + this.minPulse;
    let pulse = pulseSize/period;

    console.log('angle', degrees, pulse);
    this._pulse(pulse);

  }

  async angleZero() {

    if (this.minPulse && this.minPulse < this.period) {
      let pct = (1.0 * this.minPulse)/this.period;
      console.log('angleZero', pct);
      this._pulse(pct);
    } else {
      console.log('angleZero');
      this._pulse(0);
    }

  }

  async angleMax() {

    if (this.maxPulse && this.maxPulse < this.period) {
      let pct = (1.0 * this.maxPulse)/this.period;
      console.log('angleMax', pct);
      this._pulse(pct);
    } else {
      console.log('angleMax');
      this._pulse(1);
    }

  }
}

module.exports = Servo;
