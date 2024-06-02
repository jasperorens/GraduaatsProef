const express = require('express');
const https = require('https');
const fs = require('fs');
const cors = require('cors');
const { Server } = require('ws');

const vegetables = [
    "Carrot", "Broccoli", "Spinach", "Cabbage", "Potato", "Tomato", "Lettuce", "Onion", "Garlic", "Cauliflower",
    // Add more vegetables here
];
let vegetableIndex = 0;
let intervalId = null;

const INTERVAL = 1000;

const byteLength = (str) => new TextEncoder().encode(str).length;

const app = express();
app.use(cors());

const server = https.createServer({
    key: fs.readFileSync('path/to/your/private.key'),
    cert: fs.readFileSync('path/to/your/certificate.crt')
}, app);

const wss = new Server({ server });

wss.on('connection', (ws) => {
    console.log('WSS: New client connected');

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
            console.log(`WSS: Sending vegetable: ${vegetable}, size: ${dataSize} bytes`);
            ws.send(JSON.stringify({
                vegetable,
                dataSize,
                totalBytesSent,
                maxSendSpeed,
                details: {
                    Status: "Active",
                    Transferred: totalBytesSent,
                    Connection: "WebSocket",
                    Protocol: "wss",
                }
            }));
        } catch (err) {
            console.error("WSS: Error sending vegetable data to client:", err);
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

            console.log(`WSS: Received fruit: ${fruit}, size: ${dataSize} bytes`);

            ws.send(JSON.stringify({
                fruit,
                dataSize,
                totalBytesReceived,
                maxReceiveSpeed,
                details: {
                    Status: "Active",
                    Received: totalBytesReceived,
                    Connection: "WebSocket",
                    Protocol: "wss",
                }
            }));

            sendVegetable();
        } catch (err) {
            console.error("WSS: Error receiving fruit data from client:", err);
        }
    });

    intervalId = setInterval(sendVegetable, INTERVAL);

    ws.on('close', () => {
        clearInterval(intervalId);
        console.log('WSS: Client disconnected');
    });
});

const PORT = process.env.PORT || 4004;
server.listen(PORT, () => console.log(`WSS Server running on port ${PORT}`));
