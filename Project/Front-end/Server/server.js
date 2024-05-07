const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

socket.on('connection', (clientSocket) => {
    let totalBytesSent = 0;

    const sendData = () => {
        const data = { /* your data object */ };
        const dataSize = Buffer.byteLength(JSON.stringify(data));
        totalBytesSent += dataSize;

        console.log('Emitting data with details:', {
            name: "exampleSocket",
            incoming: data,
            outgoing: dataSize,
            details: {
                Status: "Active",
                Transferred: `${totalBytesSent} B`,
                Connection: "WebSocket",
                Protocol: "WebSocket",
            }
        });

        clientSocket.emit('dataReceived', {
            name: "exampleSocket",
            incoming: data,
            outgoing: dataSize,
            details: {
                Status: "Active",
                Transferred: `${totalBytesSent} B`,
                Connection: "WebSocket",
                Protocol: "WebSocket",
            }
        });
    };

    setInterval(sendData, 1000);


    const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
