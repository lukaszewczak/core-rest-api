/*
 *  Primary file for the API
 *
 */

// Dependencies

const http = require('http');

// The server should responde to all requests with a string
const server = http.createServer((req, res) => {
    res.end('Hello world\n');
});

// Start the server, and have it listen on port 3000
server.listen(3000, () => console.log('The server is listenning on port 300 now'));
