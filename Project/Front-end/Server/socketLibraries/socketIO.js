const socketIo = require('socket.io');

const vegetables = [
    "Carrot", "Broccoli", "Spinach", "Cabbage", "Potato", "Tomato", "Lettuce", "Onion", "Garlic", "Cauliflower",
    "Cucumber", "Pepper", "Pumpkin", "Radish", "Sweet Potato", "Turnip", "Zucchini", "Asparagus", "Bean", "Beet",
    "Celery", "Corn", "Eggplant", "Kale", "Leek", "Okra", "Parsnip", "Pea", "Squash", "Watercress"
];
let vegetableIndex = 0;
let intervalId = null;

const INTERVAL = 50000;

const byteLength = (str) => new TextEncoder().encode(str).length;

function setupSocketIO(server) {
    const io = socketIo(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (clientSocket) => {
        console.log('Socket.IO: New client connected');

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
                console.log(`Socket.IO: Sending vegetable: ${vegetable}, size: ${dataSize} bytes`);
                clientSocket.emit('dataFromServer', {
                    vegetable,
                    dataSize,
                    totalBytesSent,
                    maxSendSpeed,
                    details: {
                        Status: "Active",
                        Transferred: totalBytesSent,
                        Connection: "WebSocket",
                        Protocol: "WebSocket",
                    }
                });
            } catch (err) {
                console.error("Socket.IO: Error sending vegetable data to client:", err);
            }

            vegetableIndex = (vegetableIndex + 1) % vegetables.length;
        };

        clientSocket.on('startSending', () => {
            if (!intervalId) {
                intervalId = setInterval(sendVegetable, INTERVAL);
                console.log('Socket.IO: Started sending data');
            }
        });

        clientSocket.on('stopSending', () => {
            if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
                console.log('Socket.IO: Stopped sending data');
            }
        });

        clientSocket.on('dataFromClient', (data) => {
            try {
                const fruit = data.fruit;
                const dataSize = byteLength(fruit);
                totalBytesReceived += dataSize;
                maxReceiveSpeed = Math.max(maxReceiveSpeed, dataSize);

                console.log(`Socket.IO: Received fruit: ${fruit}, size: ${dataSize} bytes`);

                clientSocket.emit('serverStats', {
                    fruit,
                    dataSize,
                    totalBytesReceived,
                    maxReceiveSpeed,
                    details: {
                        Status: "Active",
                        Received: totalBytesReceived,
                        Connection: "WebSocket",
                        Protocol: "WebSocket",
                    }
                });
            } catch (err) {
                console.error("Socket.IO: Error receiving fruit data from client:", err);
            }
        });
    });
}

module.exports = { setupSocketIO };
