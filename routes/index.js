const users = require('./users');

// Define handlers
const handlers = {
    users
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
    const chosenHandler = typeof (handlers[data.trimmedPath]) !== 'undefined'
        ? handlers[data.trimmedPath]
        : handlers.notFound;

    return chosenHandler(data);
};
