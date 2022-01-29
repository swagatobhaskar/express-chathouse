//const ws = require('ws');
import * as ws from 'ws';

const wss = new ws.WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws) {
    ws.on('message', function message(data) {
        console.log('received: %s', data);
    });

    ws.send('something...');
})

export default wss;