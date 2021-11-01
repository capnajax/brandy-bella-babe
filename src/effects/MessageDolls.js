'use strict';

const Effect = require('./Effect');
const http = require('http');

class MessageDolls extends Effect {
  constructor() {
    super();
  }

  perform(options, message) {

    const req = http.request({
      host: options.host,
      port: 80,
      path: '/',
      method: 'PUT',
    });
    req.setHeader('Content-Type', 'application/json');
    req.end(JSON.stringify({
      sender:'pi4',
      message: {
        type:"presense" ,
        presence: (message === 'motion')
      }
    }));

    console.log('Effect MessageDolls', message);
  }
}

module.exports = MessageDolls;
