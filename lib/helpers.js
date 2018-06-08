/**
 *  Helpers for various tasks
 *
 */

const crypto = require('crypto');
const config = require('../config');

const helpers = {};

// Crete a SHA256 hash
helpers.hash = (str) => {
    if (typeof (str) === 'string' && str.trim().length > 0) {
        return crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex');
    } else {
        return false;
    }
};

// Parse a JSON string to an object
helpers.parseJsonToObject = (str) => {
    try {
        return JSON.parse(str);
    } catch (e) {
        return {};
    }
};

helpers.responsObject = (statusCode, data = {}) => {
    return {
        statusCode,
        data
    };
};

// Create a string of random alphanumeric characters, of a given length
helpers.createRandomString = (stringLength) => {
    stringLength = typeof stringLength === 'number' && stringLength > 0 ? stringLength : false;
    if (stringLength) {
// Define all th possible charcters that could go into a string
        const possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';

        let str = '';
        for (let i = 0; i < stringLength; i++) {
            str += possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
        }
        return str;
    } else {
        return false;
    }
};

module.exports = helpers;
