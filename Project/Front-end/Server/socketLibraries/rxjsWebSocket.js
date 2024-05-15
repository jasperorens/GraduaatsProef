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

function setupRxJSWebSocket(server) {
    const wss = new Server({ server, path: '/rxjs-websocket' });

    wss.on('connection', (ws) => {
        console.log('RxJS WebSocket: New client connected');

        let totalBytesSent = 0;
        let totalBytesReceived = 0;

        const sendVegetable = () => {
            if (vegetableIndex >= vegetables.length) vegetableIndex = 0;
            const vegetable = vegetables[vegetableIndex];
            const dataSize = byteLength(vegetable);
            totalBytesSent += dataSize;

            try {
                console.log(`RxJS WebSocket: Sending vegetable: ${vegetable}, size: ${dataSize} bytes`);
                ws.send(JSON.stringify({
                    vegetable,
                    dataSize,
                    totalBytesSent,
                    details: {
                        Status: "Active",
                        Transferred: `${totalBytesSent} B`,
                        Connection: "WebSocket",
                        Protocol: "WebSocket",
                    }
                }));
            } catch (err) {
                console.error("RxJS WebSocket: Error sending vegetable data to client:", err);
            }

            vegetableIndex = (vegetableIndex + 1) % vegetables.length;
        };

        ws.on('message', (message) => {
            try {
                const data = JSON.parse(message);
                const fruit = data.fruit;
                const dataSize = byteLength(fruit);
                totalBytesReceived += dataSize;

                console.log(`RxJS WebSocket: Received fruit: ${fruit}, size: ${dataSize} bytes`);

                ws.send(JSON.stringify({
                    fruit,
                    dataSize,
                    totalBytesReceived,
                    details: {
                        Status: "Active",
                        Received: `${totalBytesReceived} B`,
                        Connection: "WebSocket",
                        Protocol: "WebSocket",
                    }
                }));

                sendVegetable();
            } catch (err) {
                console.error("RxJS WebSocket: Error receiving fruit data from client:", err);
            }
        });

        intervalId = setInterval(sendVegetable, INTERVAL);

        ws.on('close', () => {
            clearInterval(intervalId);
            console.log('RxJS WebSocket: Client disconnected');
        });
    });
}

module.exports = { setupRxJSWebSocket };
