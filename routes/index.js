const helpers = require('../lib/helpers');
const users = require('./users');
const tokens = require('./tokens');

// Define handlers
const handlers = {
    users,
    tokens
};

// Ping handler
handlers.ping = async (data) => {
    return {
        statusCode: 200
    };
};

// Not found handler
handlers.notFound = async (data) => {
    return {
        statusCode: 404
    };
};

module.exports.chosenHandler = async (data) => {
    // Choose the handler this request should go to. If one is not found then choose the not found handler
    try {
        const chosenHandler = typeof (handlers[data.trimmedPath]) !== 'undefined'
            ? handlers[data.trimmedPath]
            : handlers.notFound;

        return await chosenHandler(data);
    } catch (err) {
        console.error(err);
        return helpers.responsObject(500, {Error: 'Sorry, unexptected error, occur'});
    }
};
