const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const pusher = require('./pusherServer');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/pusher/trigger', (req, res) => {
    const { channel, event, message } = req.body;
    pusher.trigger(channel, event, { message })
        .then(response => res.send(response))
        .catch(error => res.status(500).send(error));
});

const PORT = process.env.PORT || 4004;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
