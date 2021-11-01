'use strict';

class Dispatcher {

  constructor(options) {
    this.input = null;
    this.effects = [];
    this.options = options;
  }

  addEffect(effect, options) {
    this.effects.push({effect, options});
  }

  performEffect(effect, message) {
    console.log('performEffect:', {effect, message});
    effect.effect.perform(effect.options, message);
  }

  performEffects(message) {
    for (let effect of this.effects) {
      this.performEffect(effect, message);
    }
  }

  setInput(input) {
    this.input = input;
    this.input.on('message', message => {
      console.log('Dispatcher MoveServo', message);
      this.performEffects(message);
    });
  }

}

module.exports = Dispatcher;