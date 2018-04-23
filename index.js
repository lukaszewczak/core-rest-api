/*
 *  Primary file for the API
 *
 */

// Dependencies

const http = require('http');
const url = require('url');

// The server should responde to all requests with a string
const server = http.createServer((req, res) => {

    // Get the URL and parse it
    // urlParse(url, parseQueryString) parseQueryString=true is using querystring core module
    const parsedUrl = url.parse(req.url, true);
    console.log(parsedUrl.query);
    // Get the path
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');// remove slash on start and end

    // Get the query string as an object
    const queryStringObject = parsedUrl.query;

    // Get the HTTP Method
    const method = req.method.toLowerCase();

    // Get the headers as an object
    const headers = req.headers;

    // Send the response
    res.end('Hello world\n');

    // Log the request path
    console.log(
        `Request received on path: ${trimmedPath} with method: ${method} and with these query 
        string parameters ${JSON.stringify(queryStringObject)}`);

    console.log('Request received with these headers', headers);

});

// Start the server, and have it listen on port 3000
server.listen(3000, () => console.log('The server is listenning on port 300 now'));
