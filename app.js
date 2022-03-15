const express = require('express')
const app = express()
const WebSocket = require('ws').Server
const wss = new WebSocket({port:3001})
const expressPort = 3000;
/*
WebSocket
https://ivvve.github.io/2020/08/17/etc/why-websocket-server-doesnt-emit-close-event/
 */
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})
app.listen(expressPort, () => {
    console.log(`listening on port ${expressPort}`)
})

function heartbeat() {
    this.isAlive = true;
}
wss.on('connection', (ws, req) => {
    const ip = req.socket.remoteAddress;
    console.log('ip=',ip)
    ws.isAlive = true;
    ws.on('message', (message) => {
        const sendData = {
            event: 'response',
            data: null
        };
        console.log('message')
        console.log(message.toString())
        switch(message.event) {
            case 'open':
                console.log('open')
                console.log(message);
                break;
            case 'request':
                sendData.data = 'some data...';
                ws.send(JSON.stringify(sendData));
                break;
        }
    })
    ws.on('pong', function (event) {
        console.log('pong')
        heartbeat.bind(this)()
    })
    ws.on('close', (event) => {
        console.log('close')
    })
})

const interval = setInterval(function ping() {
    wss.clients.forEach(function each(ws) {
      if (ws.isAlive === false) return ws.terminate();
  
      ws.isAlive = false;
      ws.ping();
      console.log('ping')
    });
}, 2000);
