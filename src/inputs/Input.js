'use strict';

const EventEmitter = require('events');

class Input extends EventEmitter {
  constructor() {
    super();
  }
}

module.exports = Input;
