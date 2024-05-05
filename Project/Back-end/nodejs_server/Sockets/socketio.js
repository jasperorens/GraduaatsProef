const socketio = (server, PORT, app, io) => {

    server.listen(PORT, () => {
        console.log("Server listening on PORT:", PORT);
    });

    io.on('connection', (socket) => {
        console.log('A user connected');

        // Simulate data transfer
        setInterval(() => {
            const data = {
                speed: Math.random() * 100 // Random speed for demonstration
            };
            socket.emit('speedUpdate', data);
        }, 1000); // Send data every second

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });

    // Endpoint to serve the HTML page
    app.get('/', (req, res) => {
        res.sendFile(__dirname + '/index.html');
    });
};

export default socketio;
