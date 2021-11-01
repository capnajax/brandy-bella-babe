'use strict';

const u = require('./util');

const deviceClasses = {
  servo: require('./devices/Servo')
};

const effectClasses = {
  messageDolls: require('./effects/MessageDolls'),
  moveServo: require('./effects/MoveServo')
};

const dispatcherClasses = {
  messageDolls: require('./dispatchers/MessageDolls'),
  moveServo: require('./dispatchers/MoveServo')
};

const inputClasses = {
  api: require('./inputs/Api'),
  motionSensor: require('./inputs/MotionSensor')
};

class DispatchOperator {

  constructor(config) {

    this.devices = {};
    this.inputs = {};
    this.effects = {};
    this.dispatchers = {};

    for (let device of config.devices) {
      this.devices[device.name] = 
        new (deviceClasses[device.class])(device.options);
    }

    // read through inputs and initialize
    for (let input of config.inputs) {
      this.inputs[input.name] =
        new (inputClasses[input.class])(input.options);
    }

    // read through effects and initialize 
    for (let effect of config.effects) {
      let newEffect = new (effectClasses[effect.class])(effect.options);
      this.effects[effect.name] = newEffect;
        
      if (u.has(effect, 'devices')) {
        for (let device of effect.devices) {
          newEffect.addDevice(device, this.devices[device]);
        }
      }
    }

    console.log('this.effects ==', this.effects);

    // read through actions and initialize
    for (let dispatcher of config.dispatchers) {
      let newDispatcher =
        new dispatcherClasses[dispatcher.class](dispatcher.options);
      this.dispatchers[dispatcher.name] = newDispatcher;

      newDispatcher.setInput(this.inputs[dispatcher.input]);
      if (u.has(dispatcher, 'effects')) {
        for (let effect of dispatcher.effects) {
          newDispatcher.addEffect(
            this.effects[effect.name],
            effect.options);
        }
      }

      console.log('dispatcher:', newDispatcher);

      
    }
  }
}

module.exports = DispatchOperator;