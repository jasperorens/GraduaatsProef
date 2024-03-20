const express = require('express');
const app = express();
const port = 3000;

const fs = require('fs');

const session = require('express-session');
app.use(session({
    secret: 'Gl0b0t1ck€t',
    resave: false,
    saveUninitialized: true 
}));

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
app.use(jsonParser);
app.use(bodyParser.urlencoded({ extended: false }));

const xml = require('xml-js');

const dbfile = './data/globoticket.db';
const sqlite3 = require('sqlite3').verbose();
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
        res.format({
            'application/json': () => { res.type('json'); res.send(rows); },
            'text/xml': () => { res.type('xml'); res.send(xml.js2xml(rows, { compact: true })); }
        });
        //res.send(rows);
    });
});

app.get('/api/events-brittle', (req, res) => {
    if (Math.random() < 0.25) {
        res.status(500).send({ error: 'Something went wrong!' });
    } else {
        req.url = '/api/events';
        return app._router.handle(req, res);
    }
});

app.get('/api/cart', (req, res) => {
    if (req.session.id) {
        let sql = 'SELECT cartitem.*, event.artist, event.name, event.date, event.price, event.imgUrl FROM cartitem INNER JOIN event ON cartitem.event_id = event.id WHERE uuid = ?';
        db.all(sql, [req.session.id], (err, rows) => {
            res.send(rows);
        });
    } else {
        res.sendStatus(400).end();
    }
});

app.post('/api/cart', jsonParser, (req, res) => {
    if (req.session.id && req.body.id) {
        let sql = 'SELECT COUNT(*) as count FROM cartitem WHERE uuid = ? AND event_id = ?';
        db.get(
            sql, 
            [req.session.id, parseInt(req.body.id)], 
            (err, row) => {
                let cnt = row.count;
                if (cnt === 0) {
                    sql = 'INSERT INTO cartitem (uuid, event_id, quantity) VALUES (?, ?, 1)';
                } else {
                    sql = 'UPDATE cartitem SET quantity = quantity + 1 WHERE uuid = ? AND event_id = ?';
                }
                db.run(
                    sql,
                    [req.session.id, req.body.id],
                    (err) => {
                        res.sendStatus(200).end();
                    });
            });
    } else {
        res.sendStatus(400).end();
    }
});

app.get('/api/cover/:id', (req, res) => {
    if (req.params.id && !isNaN(parseInt(req.params.id))) {
        let sql = 'SELECT imgUrl FROM event WHERE id = ?';
        db.get(
            sql, 
            [parseInt(req.params.id)], 
            (err, row) => {
                if (row && row.imgUrl) {
                    setTimeout(() => {
                        const img = fs.readFileSync(`${__dirname}/public/img/${row.imgUrl}`);
                        const data = 'data:img/png;base64,' + img.toString('base64');
                        res.set({ 'Content-Length': data.length });
                        res.send(data);
                        //res.type('png');
                        //res.sendFile(`public/img/${row.imgUrl}`, { root: __dirname });
                    }, parseInt(5000 * Math.random()));
                } else {
                    res.status(404).end();
                }
            });
    }
});

app.listen(port, () => {
  console.log(`Globoticket app listening on port ${port}`);
});