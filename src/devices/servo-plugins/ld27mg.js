'use strict';

const plugin = {
  sweep: 270,
  method: 'pwm',
  minPulse: 500, // pulse width in μs 
  maxPulse: 2500, // pulse witdh in μs

  // pi-blaster does not allow for configuring the period at run time, so the
  // setting here must be the same as the CYCLE_TIME_US in pi-blaster.
  period: 20000, // pulse period in μs
};

module.exports = plugin;
