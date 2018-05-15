/*
 *  Primary file for the API
 *
 */

// Dependencies

const http = require('http');
const https = require('https');
const fs = require('fs');

const config = require('./config');
const unifiedServer = require('./server');

//  Instantiate the HTTP server
const httpServer = http.createServer(unifiedServer);

// Start the HTTP server
httpServer.listen(config.httpPort,
    () => console.log(`The http server is listenning on port ${config.httpPort}`));

//  Instantiate the HTTPS server
const httpsServerOptions = {
    key: fs.readFileSync('./https/key.pem'),
    cert: fs.readFileSync('./https/cert.pem'),
};
const httpsServer = https.createServer(httpsServerOptions, unifiedServer);

// Start the HTTPS server
httpsServer.listen(config.httpsPort,
    () => console.log(`The https server is listenning on port ${config.httpsPort}`));
