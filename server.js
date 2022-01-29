const express = require("express");
const cors = require('cors');
const http = require('http');
const ws = require('ws');
const bodyParser = require('body-parser');
require('dotenv').config();

const connectToMongodb = require('./config/mongoConfig');
//const wss = require('./lib/webSocket');

const app = express();

app.use(cors());
app.use(function(req, res, next) { //allow cross origin requests
    res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
    res.header("Access-Control-Allow-Origin", "http://127.0.0.1:3000"); //decide later
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Credentials", true);
    next();
});

app.use(bodyParser.json());
app.use(express.json({ extended: false }));

const PORT = process.env.PORT || 5000;

connectToMongodb();

const server = http.createServer(app);
const wss = new ws.Server({server});
//const wss = new ws.WebSocketServer({ port: 8080 });
wss.on('connection', function connection(ws) {
    /**
     * ping messages can be used as a means to verify that the remote endpoint is still responsive.
     * Pong messages are automatically sent in response to ping messages as required by the spec.
     */
    ws.isAlive = true;
    ws.on('pong', () => {
        ws.isAlive = true;
    });
    ws.on('message', function message(data) {
        console.log('received: %s', data);
    });
    ws.send('Something...');
    const interval = setInterval( function ping() {
        wss.clients.forEach( function each(ws) {
            if (!ws.isAlive) return ws.terminate();
            ws.isAlive = false;
            ws.ping();
        });
    }, 10000);
    wss.on('close', function close() {
        console.log('Closing WebSocket connection..');
        clearInterval(interval);
    })
})

//app.listen(PORT, () => {console.info(`Server is listening on port ${PORT}`)});
server.listen(PORT, () => {console.info(`Server is listening on port ${PORT}`)});

app.get('/', (req, res) => {
    res.send('Welcome to chat house.')
})
