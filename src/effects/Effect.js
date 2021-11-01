'use strict';

class Effect {
  constructor() {
    this.devices = {};
  }

  addDevice(deviceName, device) {
    this.devices[deviceName] = device;
  }

  perform() {}

}

module.exports = Effect;
