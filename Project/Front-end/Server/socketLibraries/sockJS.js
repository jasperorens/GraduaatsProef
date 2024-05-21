const express = require('express');
const http = require('http');
const sockjs = require('sockjs');

const app = express();
const server = http.createServer(app);

// Create a SockJS server
const sockjsServer = sockjs.createServer({ prefix: '/sockjs' });

sockjsServer.on('connection', (conn) => {
    console.log('SockJS: New client connected');

    conn.on('data', (message) => {
        console.log('SockJS: Received message:', message);
        // Echo the message back
        conn.write(message);
    });

    conn.on('close', () => {
        console.log('SockJS: Client disconnected');
    });
});

// Attach SockJS server to HTTP server
sockjsServer.installHandlers(server);

const PORT = process.env.PORT || 4003;
server.listen(PORT, () => {
    console.log(`SockJS Server running on port ${PORT}`);
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Express error:', err.stack);
    next(err); // Just log the error and proceed without sending a custom response
});

// Server error handling
server.on('error', (error) => {
    console.error(`HTTP server error: ${error.message}`);
});
