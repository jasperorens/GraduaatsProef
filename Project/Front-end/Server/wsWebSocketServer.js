const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('ws');

const vegetables = [
    "Carrot", "Broccoli", "Spinach", "Cabbage", "Potato", "Tomato", "Lettuce", "Onion", "Garlic", "Cauliflower",
    "Cucumber", "Pepper", "Pumpkin", "Radish", "Sweet Potato", "Turnip", "Zucchini", "Asparagus", "Bean", "Beet",
    "Celery", "Corn", "Eggplant", "Kale", "Leek", "Okra", "Parsnip", "Pea", "Squash", "Watercress"
];
let vegetableIndex = 0;
let intervalId = null;

const INTERVAL = 1;

const byteLength = (str) => new TextEncoder().encode(str).length;

const app = express();
app.use(cors());

const server = http.createServer(app);

const wss = new Server({ server });

wss.on('connection', (ws) => {
    console.log('WS: New client connected');

    let totalBytesSent = 0;
    let totalBytesReceived = 0;
    let maxSendSpeed = 0;
    let maxReceiveSpeed = 0;

    const sendVegetable = () => {
        if (vegetableIndex >= vegetables.length) vegetableIndex = 0;
        const vegetable = vegetables[vegetableIndex];
        const dataSize = byteLength(vegetable);
        totalBytesSent += dataSize;
        maxSendSpeed = Math.max(maxSendSpeed, dataSize);

        try {
            console.log(`WS: Sending vegetable: ${vegetable}, size: ${dataSize} bytes`);
            ws.send(JSON.stringify({
                vegetable,
                dataSize,
                totalBytesSent,
                maxSendSpeed,
                details: {
                    Status: "Active",
                    Transferred: totalBytesSent,
                    Connection: "WebSocket",
                    Protocol: "ws",
                }
            }));
        } catch (err) {
            console.error("WS: Error sending vegetable data to client:", err);
        }

        vegetableIndex = (vegetableIndex + 1) % vegetables.length;
    };

    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            const fruit = data.fruit;
            const dataSize = byteLength(fruit);
            totalBytesReceived += dataSize;
            maxReceiveSpeed = Math.max(maxReceiveSpeed, dataSize);

            console.log(`WS: Received fruit: ${fruit}, size: ${dataSize} bytes`);

            ws.send(JSON.stringify({
                fruit,
                dataSize,
                totalBytesReceived,
                maxReceiveSpeed,
                details: {
                    Status: "Active",
                    Received: totalBytesReceived,
                    Connection: "WebSocket",
                    Protocol: "ws",
                }
            }));

            sendVegetable();
        } catch (err) {
            console.error("WS: Error receiving fruit data from client:", err);
        }
    });

    intervalId = setInterval(sendVegetable, INTERVAL);

    ws.on('close', () => {
        clearInterval(intervalId);
        console.log('WS: Client disconnected');
    });
});

const PORT = process.env.PORT || 4003;
server.listen(PORT, () => console.log(`WS Server running on port ${PORT}`));
