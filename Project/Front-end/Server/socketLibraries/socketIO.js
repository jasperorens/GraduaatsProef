const INTERVAL = 50; // Reduced interval to 50 ms

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

        const sendVegetable = () => {
            const vegetable = vegetables[vegetableIndex];
            const dataSize = byteLength(vegetable);
            totalBytesSent += dataSize;

            try {
                console.log(`Socket.IO: Sending vegetable: ${vegetable}, size: ${dataSize} bytes`);
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

                console.log(`Socket.IO: Received fruit: ${fruit}, size: ${dataSize} bytes`);

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
                console.error("Socket.IO: Error receiving fruit data from client:", err);
            }
        });
    });
}
