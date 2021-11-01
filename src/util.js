'use strict';

/**
 * @function clone
 * Return a shallow copy of an object
 * @param {Object} obj the object to clone
 * @returns {Object}
 */
function clone(obj) {
  let result = {};
  for (const [key, value] of Object.entries(obj)) {
    result[key] = value;
  }
  return result;
}

/**
 * @function delay
 * Return a promise that resolves after `ms` milliseconds
 * @param {Number} ms 
 * @returns {Promise}
 */
function delay(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

/**
 * @function has
 * from lodash
 * @param {Object} object the object to query
 * @param {string} key the key to look for
 * @returns {boolean}
 */
function has(object, key) {
  return object != null && Object.prototype.hasOwnProperty.call(object, key);
}

module.exports = {
  clone,
  delay,
  has
}