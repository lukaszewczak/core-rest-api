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
    console.log(parsedUrl);
    // Get the path
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');// remove slash on start and end

    // Send the response
    res.end('Hello world\n');

    // Log the request path
    console.log(`Reuest received on path: ${trimmedPath}`);

});

// Start the server, and have it listen on port 3000
server.listen(3000, () => console.log('The server is listenning on port 300 now'));
