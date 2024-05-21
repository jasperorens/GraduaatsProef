const express = require('express');
const Pusher = require('pusher');
const cors = require('cors');

const app = express();

// Configure CORS
app.use(cors({
    origin: 'http://localhost:5173', // Replace with your frontend's URL
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true
}));

app.use(express.json());

const pusher = new Pusher({
    appId: '1806141',
    key: 'cdffdac27fe6636df8ef',
    secret: '554b8f41dbb0e41b3147',
    cluster: 'eu',
    useTLS: true
});

app.post('/pusher/auth', (req, res) => {
    const socketId = req.body.socket_id;
    const channel = req.body.channel_name;
    const auth = pusher.authenticate(socketId, channel);
    res.send(auth);
});

const PORT = process.env.PORT || 4004;
app.listen(PORT, () => {
    console.log(`Pusher server running on port ${PORT}`);
});
