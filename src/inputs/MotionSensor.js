'use strict';

const Input = require('./Input');
const u = require('../util');
const Gpio = require('pigpio').Gpio;

class MotionSensor extends Input {

  constructor(config) {
    super();
    let self = this;

    self.config = config;
    self.pin = config.pin || 4;

    // set up GPIO to listen to specified pin
    self.sensor = new Gpio(config.pin, {
      mode: Gpio.INPUT,
      pullUpDown: Gpio.PUD_DOWN,
      edge: Gpio.EITHER_EDGE
    });

    self.sensor.on('interrupt', level => {
      console.log(`MotionSensor interrupt: ${level}`);
      switch (level) {
      case 0:
        this.emit('message', 'still');
        break;
      case 1:
        this.emit('message', 'motion');
        break;
      default:
        break;
      }
    });
  }



}

module.exports = MotionSensor;
