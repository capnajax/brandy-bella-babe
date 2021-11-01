'use strict';

const http = require('http');
const Input = require('./Input');
const u = require('../util');
const YAML = require('yaml');

class Api extends Input {

  constructor(config) {
    super();
    let self = this;

    self.config = config;

    self.server = http.createServer(async function(req, res) {
      switch (req.method) {
      case 'POST':
        return self.getBody(req, res)
          .then(function(body) {
            self.doPost(req, res, body);
          });
      case 'PUT':
        return self.getBody(req, res)
          .then(function(body) {
            self.doPut(req, res, body);
          });
      default:
        res.statusCode = 405;
        res.end();
        return;
      }
    });
    
    self.server.on('clientError', (err, socket) => {
      socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
    });
    
    self.server.listen(self.config.port);
    console.log('Listening on port', self.config.port);
  }

  /**
   * @method getBody
   * Get the body of the request. If the `Content-Type` header is set, parse it.
   * @param {*} req 
   * @returns {Object}
   */
   getBody(req, res) { 
    return new Promise((resolve, reject) => {
      let rawData = '';
      let result;
      let contentType = req.headers['content-type'];
      let rejectBody = (status, message, reason) => {
        res.statusCode = status;
        res.end();
        reject({status, message, reason});
      }
      req.on('data', chunk => {
        rawData += chunk;
      });
      req.on('end', () => {
        switch (contentType) {
        case 'application/json':
          try {
            result = JSON.parse(rawData);
          } catch(e) {
            return rejectBody(400, 'Failed to parse JSON', e);
          }
          break;
        case 'application/x-yaml':
          try {
            result = YAML.parse(rawData);
          } catch(e) {
            return rejectBody(400, 'Failed to parse YAML', e);
          }
          break;
        default:
          { let message = contentType
              ? `Content-Type ${contentType} not supported`
              : 'Content-Type not provided';
            return rejectBody(415, message);
          }
        }
        resolve(result);
      });
    });
  }

  /**
   * @method doPut
   * Handle a PUT request. Every PUT request also works as a POST request, it just
   * forwards the call to `doPost`
   * @param {*} req 
   * @param {*} res 
   * @param {Object} body an already-parsed message body
   * @returns 
   */
  doPut(req, res, body) {
    return this.doPost(req, res, body);
  }

  /**
   * @method doPost
   * Handle an POST request. Most incoming messages will use this method
   * @param {*} req 
   * @param {*} res 
   * @param {Object} body an already-parsed message body
   */
  doPost(req, res, body) {
    
    // message body should have the following:
    //  sender -- (required) the app that sent the message
    //  message/messages -- an array, each member having a type and,
    //    optionally, a free-form object named after the type. 
    //    messages is an object or an array, message is an object

    // if it doesn't have those, it's an invalid message with a 400

    let errors = [];
    let messages = [];
    let validateHas = (obj, fieldName, message) => {
      if (!u.has(obj, fieldName)) {
        errors.push(message);
      }
    };

    let validateMessage = (message) => {
      validateHas(message, 'type', 'Message must have a type');
      let eventMessage = u.clone(message);
      eventMessage.sender = body.sender;
      messages.push(eventMessage);
    };

    validateHas(body, 'sender', 'Body must have a sender');

    if (u.has(body, 'messages')) {
      if (Array.isArray(body.messages)) {
        for (let m of body.messages) {
          validateMessage(body.message)
        }
      } else {
        validateMessage(body.messages);
      }  
    }
    if (u.has(body, 'message')) {
      validateMessage(body.message);
    }

    if (errors.length) {
      res.statusCode = 400;
      res.end();
    } else {

      messages.forEach(m => {
        this.emit('message', m);
      })
      
      res.statusCode = 204;
      res.end();
    }
  }
}

module.exports = Api;
