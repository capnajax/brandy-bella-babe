
const fs = require('fs').promises;

class Servo {

  constructor (plugin, pin, options) {
    this.plugin = plugin;
    this.pin = pin;

    if (undefined === options.outStream || null === options.outStream) {
      this.fifo_p = fs.open('/dev/pi-plaster', 'a');
    } else if ('-' === options.outStream) {
      this.fifo_p = Promise.resolve(process.stdout);
    } else {
      this.fifo_p = fs.open(options.outStream, 'a');
    }

    this.period = this.plugin.period || 10000;
    this.maxPulse = this.plugin.maxPulse || this.period;
    this.minPulse = this.plugin.minPulse || 0;
    this.sweep = this.plugin.sweep || 90;
  }

  async _pulse(pulseWidth) {

    let fifo = await this.fifo_p;
    fifo.write(`${this.pin}=${pulseWidth}\n`);

  }

  async angle(degrees) {

    console.log('angle', degrees);

    let sweepPct = Math.min(Math.max(1.0*degrees/this.sweep, 0), 1);

    let period = this.period || 10000
    let minPulse = 0;
    let maxPulse = period;
    let pulseSize = sweepPct * (maxPulse - minPulse) + minPulse;

    this._pulse(pulseSize/period);

  }

  async angleZero() {

    console.log('angleZero');

    if (this.minPulse && this.minPulse < this.period) {
      let pct = (1.0 * this.minPulse)/this.period;
      this._pulse(pct);
    } else {
      this._pulse(0);
    }

  }

  async angleMax() {

    console.log('angleMax');

    if (this.maxPulse && this.maxPulse < this.period) {
      let pct = (1.0 * this.maxPulse)/this.period;
      this._pulse(pct);
    } else {
      this._pulse(1);
    }

  }

}

module.exports = Servo;
