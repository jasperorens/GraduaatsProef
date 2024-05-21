const sockjs = require('sockjs');

const vegetables = [
    "Carrot", "Broccoli", "Spinach", "Cabbage", "Potato", "Tomato", "Lettuce", "Onion", "Garlic", "Cauliflower",
    "Cucumber", "Pepper", "Pumpkin", "Radish", "Sweet Potato", "Turnip", "Zucchini", "Asparagus", "Bean", "Beet",
    "Celery", "Corn", "Eggplant", "Kale", "Leek", "Okra", "Parsnip", "Pea", "Squash", "Watercress"
];
let vegetableIndex = 0;
let intervalId = null;

const INTERVAL = 50; // Adjust interval for speed

const byteLength = (str) => new TextEncoder().encode(str).length;

const setupSockJS = (server) => {

    const sockjsServer = sockjs.createServer();

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
            try {
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
            } catch (err) {
                console.error("SockJS: Error processing received data:", err);
            }
        });

        conn.on('close', () => {
            clearInterval(intervalId);
            intervalId = null;
            console.log('SockJS: Client disconnected');
        });

        conn.on('error', (err) => {
            console.error('SockJS: Connection error:', err);
        });
    });

    sockjsServer.on('error', (err) => {
        console.error('SockJS: Server error:', err);
    });

    sockjsServer.installHandlers(server, { prefix: '/sockjs' });
};

module.exports = { setupSockJS };
