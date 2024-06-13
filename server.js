///////////////////////////////////////////////
///////////// IMPORTS + VARIABLES /////////////
///////////////////////////////////////////////

const http = require('http'); 
const CONSTANTS = require('./public/constants');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');

// You may choose to use the constants defined in the file below
const { PORT, CLIENT, SERVER } = CONSTANTS;

///////////////////////////////////////////////
///////////// HTTP SERVER LOGIC ///////////////
///////////////////////////////////////////////

// Create the HTTP server
const server = http.createServer((req, res) => {
  // get the file path from req.url, or '/public/index.html' if req.url is '/'
  const filePath = ( req.url === '/' ) ? '/public/index.html' : `/public/${req.url}`;

  // determine the contentType by the file extension
  const extname = path.extname(filePath);
  console.log(`Req Url: ${req.url}`);
  console.log(`Extname: ${extname}`);
  console.log(`File Path: ${filePath}`);
  console.log(`Dir Name ${__dirname}`);
  let contentType = 'text/html';
  if (extname === '.js') contentType = 'text/javascript';
  else if (extname === '.css') contentType = 'text/css';

  // pipe the proper file to the res object
  res.writeHead(200, { 'Content-Type': contentType });
  fs.createReadStream(`${__dirname}/${filePath}`, 'utf8').pipe(res);
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
      case CLIENT.MESSAGE.NEW_USER:
        const time = new Date().toLocaleString();
        payload.time = time;
        const dataWithTime = {
          type: SERVER.BROADCAST.NEW_USER_WITH_TIME,
          payload
        }
        broadcast(JSON.stringify(dataWithTime));
        break;
      case CLIENT.MESSAGE.NEW_MESSAGE:
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

const port = process.env.port || 8080;

// Start the server listening on localhost:8080
server.listen(port, () => {
  console.log(`Listening on: ${port}`);
});

