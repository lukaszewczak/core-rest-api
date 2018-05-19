// Define handlers
const handlers = {};

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

// Define a request router
const router = {
    ping: handlers.ping
};

module.exports = {
    handlers,
    router
};
