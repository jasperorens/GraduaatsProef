const express = require('express');
const http = require('http');
const sockjs = require('sockjs');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);

const sockjsServer = sockjs.createServer({ prefix: '/sockjs' });

sockjsServer.on('connection', (conn) => {
    console.log('SockJS: New client connected');

    conn.on('data', (message) => {
        console.log('SockJS: Received message:', message);
        conn.write(message); // Echo the message back
    });

    conn.on('close', () => {
        console.log('SockJS: Client disconnected');
    });

    conn.on('error', (err) => {
        console.error('SockJS: Connection error:', err);
    });
});

sockjsServer.on('error', (err) => {
    console.error('SockJS: Server error:', err);
});

sockjsServer.installHandlers(server, { prefix: '/sockjs' });

const PORT = process.env.PORT || 4003;
server.listen(PORT, () => {
    console.log(`SockJS Server running on port ${PORT}`);
});

server.on('error', (error) => {
    console.error(`HTTP server error: ${error.message}`);
});
