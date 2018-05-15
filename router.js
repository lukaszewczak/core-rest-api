// Define handlers
const handlers = {};

// Sample handler
handlers.sample = async (data) => {
// Callback a http status code, and a payload object
    return {
        statusCode: 406,
        data: {'name': 'sample handler'}
    };
};

// Not found handler
handlers.notFound = async (data, callback) => {
    return {
        statusCode: 404
    };
};

// Define a request router
const router = {
    'sample': handlers.sample
};

module.exports = {
    handlers,
    router
};
