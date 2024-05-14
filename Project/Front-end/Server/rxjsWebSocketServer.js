const express = require('express');
const http = require('http');
const cors = require('cors');
const { setupRxJSWebSocket } = require('./socketLibraries/rxjsWebSocket');

const app = express();
app.use(cors());

const server = http.createServer(app);

// Setup RxJS WebSocket
setupRxJSWebSocket(server);

const PORT = process.env.PORT || 4002; // Port for RxJS WebSocket server
server.listen(PORT, () => console.log(`RxJS WebSocket Server running on port ${PORT}`));
