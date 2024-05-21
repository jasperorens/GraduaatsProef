const express = require('express');
const http = require('http');
const cors = require('cors');
const { setupSockJS } = require('./socketLibraries/sockJS');

const app = express();
app.use(cors());

const server = http.createServer(app);
console.log("boom");
setupSockJS(server);

const PORT = process.env.PORT || 4003; // Port for SockJS server

server.listen(PORT, () => {
    console.log(`SockJS Server running on port ${PORT}`);
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Express error:', err);
    next(err); // Just log the error and proceed without sending a custom response
});

// Server error handling
server.on('error', (error) => {
    console.error(`HTTP server error: ${error.message}`);
});
