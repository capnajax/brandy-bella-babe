'use strict';

const Dispatcher = require('./Dispatcher');

class MessageDolls extends Dispatcher {
  constructor(input, effect, options) {
    super(input, effect, options);
  }

  // performEffects(message) {
  //   console.log('message.presence ==', JSON.stringify(message.presence));
  //   console.log('this.options.presence ==', JSON.stringify(this.options.presence));
  //   if (message.presence == this.options.presence) {
  //     console.log('performing effects')
  //     super.performEffects(message);
  //   }
  // }

}

module.exports = MessageDolls;