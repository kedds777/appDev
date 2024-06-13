///////////////////////////////////////////////
///////////// IMPORTS + VARIABLES /////////////
///////////////////////////////////////////////

import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import WebSocket from 'ws';

///////////////////////////////////////////////
///////////// HTTP SERVER LOGIC ///////////////
///////////////////////////////////////////////

const app = express();
const server = createServer(app);

const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

///////////////////////////////////////////////
////////////////// WS LOGIC ///////////////////
///////////////////////////////////////////////

// TODO
// Exercise 3: Create the WebSocket Server using the HTTP server
const wsServer = new WebSocket.Server({ server });


// TODO
// Exercise 5: Respond to connection events
// Exercise 6: Respond to client messages
// Exercise 7: Send a message back to the client, echoing the message received
// Exercise 8: Broadcast messages received to all other clients

wsServer.on('connection', (socket) => {
  socket.on('message', (data) => {
    const { type, payload } = JSON.parse(data);

    switch(type) {
      case 'NEW_USER':
        const time = new Date().toLocaleString();
        payload.time = time;
        const dataWithTime = {
          type: 'NEW_USER_WITH_TIME',
          payload
        }
        broadcast(JSON.stringify(dataWithTime));
        break;
      case 'NEW_MESSAGE':
        broadcast(data, socket);
        break;
      default:
        break;
    }
  })
});


///////////////////////////////////////////////
////////////// HELPER FUNCTIONS ///////////////
///////////////////////////////////////////////

function broadcast(data, socketToOmit) {
  // TODO
  // Exercise 8: Implement the broadcast pattern. Exclude the emitting socket!
  wsServer.clients.forEach(connectedSocket => {
    if(connectedSocket.readyState === WebSocket.OPEN && connectedSocket !== socketToOmit) {
      connectedSocket.send(data);
    }
  })
}

// Start the server listening on localhost:8080
server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});

