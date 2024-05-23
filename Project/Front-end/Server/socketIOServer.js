const express = require('express');
const http = require('http');
const cors = require('cors');
const { setupSocketIO } = require('./socketLibraries/socketIO');

const app = express();
app.use(cors());

const server = http.createServer(app);

// Setup Socket.IO
setupSocketIO(server);

const PORT = process.env.PORT || 4001;
server.listen(PORT, () => console.log(`Socket.IO Server running on port ${PORT}`));
