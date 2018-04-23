/*
 *  Primary file for the API
 *
 */

// Dependencies

const http = require('http');
const url = require('url');
const {StringDecoder} = require('string_decoder');

// The server should responde to all requests with a string
const server = http.createServer((req, res) => {

    // Get the URL and parse it
    // urlParse(url, parseQueryString) parseQueryString=true is using querystring core module
    const parsedUrl = url.parse(req.url, true);

    // Get the path
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');// remove slash on start and end

    // Get the query string as an object
    const queryStringObject = parsedUrl.query;

    // Get the HTTP Method
    const method = req.method.toLowerCase();

    // Get the headers as an object
    const headers = req.headers;

    // Get the payload, if any
    const decoder = new StringDecoder('utf-8');
    let payload = '';
    req.on('data', (data) => {// data event will not be fired if ther is no payload
        payload += decoder.write(data);
    });

    req.on('end', () => { // end event will always be called
        payload += decoder.end();

        // Choose the handler this request should go to. If one is not found then choose the not found handler
        const chosenHandler = typeof (router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

        // Construct the data object to send to the handler
        const data = {
            trimmedPath,
            queryStringObject,
            method,
            headers,
            payload
        };

        // Route hte request to the handler specified in the router
        chosenHandler(data, (statusCode, responsePayload) => {
            // Use the status code called back by the handler, or default to the 200
            statusCode = typeof (statusCode) === 'number' ? statusCode : 200;

            // Use the response payload called back by the router, or default to an empty object
            responsePayload = typeof (responsePayload) === 'object' ? responsePayload : {};

            // Convert the response Payload to a string
            const payloadString = JSON.stringify(responsePayload);

            // Return the response
            res.writeHead(statusCode);
            res.end(payloadString);

            // Log the response
            console.log(`Returning this response: ${statusCode} ${payloadString}`);
        });

    });

});

// Start the server, and have it listen on port 3000
server.listen(3000, () => console.log('The server is listenning on port 300 now'));

// Define handlers
const handlers = {};

// Sample handler
handlers.sample = (data, callback) => {
// Callback a http status code, and a payload object
    callback(406, {'name': 'sample handler'});
};

// Not found handler
handlers.notFound = (data, callback) => {
    callback(404);
};

// Define a request router
const router = {
    'sample': handlers.sample
};
