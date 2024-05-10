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

const vegetables = [
    "Carrot", "Broccoli", "Spinach", "Cabbage", "Potato", "Tomato", "Lettuce", "Onion", "Garlic", "Cauliflower",
    "Cucumber", "Pepper", "Pumpkin", "Radish", "Sweet Potato", "Turnip", "Zucchini", "Asparagus", "Bean", "Beet",
    "Celery", "Corn", "Eggplant", "Kale", "Leek", "Okra", "Parsnip", "Pea", "Squash", "Watercress"
];
let vegetableIndex = 0;

const INTERVAL = 1000;

const byteLength = (str) => new TextEncoder().encode(str).length;

io.on('connection', (clientSocket) => {
    console.log('New client connected');

    let totalBytesSent = 0;
    let totalBytesReceived = 0;

    const sendVegetable = () => {
        const vegetable = vegetables[vegetableIndex];
        const dataSize = byteLength(vegetable);
        totalBytesSent += dataSize;

        try {
            clientSocket.emit('dataFromServer', {
                vegetable,
                dataSize,
                totalBytesSent,
                details: {
                    Status: "Active",
                    Transferred: `${totalBytesSent} B`,
                    Connection: "WebSocket",
                    Protocol: "WebSocket",
                }
            });
        } catch (err) {
            console.error("Error sending vegetable data to client:", err);
        }

        vegetableIndex = (vegetableIndex + 1) % vegetables.length;
    };

    clientSocket.on('dataFromClient', (data) => {
        try {
            const fruit = data.fruit;
            const dataSize = byteLength(fruit);
            totalBytesReceived += dataSize;

            clientSocket.emit('serverStats', {
                fruit,
                dataSize,
                totalBytesReceived,
                details: {
                    Status: "Active",
                    Received: `${totalBytesReceived} B`,
                    Connection: "WebSocket",
                    Protocol: "WebSocket",
                }
            });
        } catch (err) {
            console.error("Error receiving fruit data from client:", err);
        }
    });

    setInterval(sendVegetable, INTERVAL);
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
