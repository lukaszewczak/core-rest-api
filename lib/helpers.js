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

module.exports = helpers;
