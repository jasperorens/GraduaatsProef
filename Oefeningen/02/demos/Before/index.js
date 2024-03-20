const express = require('express');
const app = express();
const port = 3000;

const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
app.use(jsonParser);
app.use(bodyParser.urlencoded({ extended: false }));

const dbfile = './data/globoticket.db';
const sqlite3 = require("sqlite3").verbose();
let db = new sqlite3.Database(dbfile);

app.use('/', express.static('public'));

app.get('/', (req, res) => res.sendFile('public/index.html'));
app.get('/cart', (req, res) => res.sendFile('public/cart.html'));

app.get('/ping', (req, res) => {
    res.send('pong');
});

app.get('/api/events', (req, res) => {
    let sql = 'SELECT * FROM event ORDER BY date ASC';
    db.all(sql, (err, rows) => {
        res.send(rows);
    });
});

app.listen(port, () => {
  console.log(`Globoticket app listening on port ${port}`);
});