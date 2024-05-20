const express = require('express');
const http = require('http');
const cors = require('cors');
const sockjs = require('sockjs');

const app = express();
app.use(cors());

const sockjsServer = sockjs.createServer();

const vegetables = [
    "Carrot", "Broccoli", "Spinach", "Cabbage", "Potato", "Tomato", "Lettuce", "Onion", "Garlic", "Cauliflower",
    "Cucumber", "Pepper", "Pumpkin", "Radish", "Sweet Potato", "Turnip", "Zucchini", "Asparagus", "Bean", "Beet",
    "Celery", "Corn", "Eggplant", "Kale", "Leek", "Okra", "Parsnip", "Pea", "Squash", "Watercress"
];
let vegetableIndex = 0;
let intervalId = null;

const INTERVAL = 50; // Adjust interval for speed

const byteLength = (str) => new TextEncoder().encode(str).length;

sockjsServer.on('connection', (conn) => {
    console.log('SockJS: New client connected');

    let totalBytesSent = 0;
    let totalBytesReceived = 0;

    const sendVegetable = () => {
        if (vegetableIndex >= vegetables.length) vegetableIndex = 0;
        const vegetable = vegetables[vegetableIndex];
        const dataSize = byteLength(vegetable);
        totalBytesSent += dataSize;

        try {
            console.log(`SockJS: Sending vegetable: ${vegetable}, size: ${dataSize} bytes`);
            conn.write(JSON.stringify({
                vegetable,
                dataSize,
                totalBytesSent,
                details: {
                    Status: "Active",
                    Transferred: `${totalBytesSent} B`,
                    Connection: "SockJS",
                    Protocol: "SockJS",
                }
            }));
        } catch (err) {
            console.error("SockJS: Error sending vegetable data to client:", err);
        }

        vegetableIndex = (vegetableIndex + 1) % vegetables.length;
    };

    conn.on('data', (message) => {
        const data = JSON.parse(message);
        const fruit = data.fruit;
        const dataSize = byteLength(fruit);
        totalBytesReceived += dataSize;

        console.log(`SockJS: Received fruit: ${fruit}, size: ${dataSize} bytes`);

        conn.write(JSON.stringify({
            fruit,
            dataSize,
            totalBytesReceived,
            details: {
                Status: "Active",
                Received: `${totalBytesReceived} B`,
                Connection: "SockJS",
                Protocol: "SockJS",
            }
        }));

        if (!intervalId) {
            intervalId = setInterval(sendVegetable, INTERVAL);
        }
    });

    conn.on('close', () => {
        clearInterval(intervalId);
        intervalId = null;
        console.log('SockJS: Client disconnected');
    });
});

const server = http.createServer(app);
sockjsServer.installHandlers(server, { prefix: '/sockjs' });

const PORT = process.env.PORT || 4003; // Port for SockJS server
server.listen(PORT, () => console.log(`SockJS Server running on port ${PORT}`));
