
const childProcess = require('child_process');
const fs = require('fs').promises;

class Servo {

  constructor (plugin, pin, options) {
    this.plugin = plugin;
    this.pin = pin;

    // if (undefined === options.outStream || null === options.outStream) {
    //   // this.fifo_p = fs.open('/dev/pi-plaster', 'w');
    // } else if ('-' === options.outStream) {
    //   this.fifo_p = Promise.resolve(process.stdout);
    // } else {
    //   this.fifo_p = fs.open(options.outStream, 'a');
    // }

    this.period = this.plugin.period || 10000;
    this.maxPulse = this.plugin.maxPulse || this.period;
    this.minPulse = this.plugin.minPulse || 0;
    this.sweep = this.plugin.sweep || 90;
  }

  async _pulse(pulseWidth) {

    console.log('pulse', pulseWidth);
    childProcess.execSync(`echo ${this.pin}=${pulseWidth} > /dev/pi-blaster`);

  }

  async angle(degrees) {


    let sweepPct = Math.min(Math.max(1.0*degrees/this.sweep, 0), 1);

    let period = this.period || 10000
    let minPulse = 0;
    let maxPulse = period;
    let pulseSize = sweepPct * (maxPulse - minPulse) + minPulse;
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
