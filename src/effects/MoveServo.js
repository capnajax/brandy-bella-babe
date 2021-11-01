'use strict';

const Effect = require('./Effect');

class MoveServo extends Effect {
  constructor() {
    super();
  }

  perform(options, message) {
    console.log('Effect MoveServo', options);
    this.devices.headServo.angle(options.angle);
  }
}

module.exports = MoveServo;
