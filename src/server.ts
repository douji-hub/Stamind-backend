import app from './app';
import mongoose from 'mongoose';
import { Socket } from 'net';
import { createServer, IncomingMessage } from 'http';
import { getHttpsOptions } from './config/httpsConfig';
import { handleUpgrade } from './config/webSocketConfig';
import './config/mongodbConfig';


const PORT = process.env.PORT || 3000;

// setting https or http
const httpsOptions = getHttpsOptions();
let server;

if (httpsOptions) {
    server = require('https').createServer(httpsOptions, app);
    console.log('Running in HTTPS mode');
} else {
    server = createServer(app);
    console.log('Running in HTTP mode');
}


// MongoDB 
mongoose.connection.on('error', (err) => console.error('Connection error', err));
mongoose.connection.once('open', () => console.log('Connected to MongoDB'));

// If the workspaceId exists, call the handleUpgrade function to upgrade the request to a WebSocket connection.
// If the workspaceId does not exist, this is an incorrect request and use socket.destroy() to terminate the connection
server.on('upgrade', (req: IncomingMessage, socket: Socket, head: Buffer) => {
    const workspaceId = new URL(req.url || '', `http://${req.headers.host}`).searchParams.get(
        'workspaceId'
    );
    if (workspaceId) {
        handleUpgrade(workspaceId, req, socket, head);
    } else {
        socket.destroy();
    }
});

server.listen(PORT, () => {
    console.log(`Server is running at ${httpsOptions ? 'https' : 'http'}://localhost:${PORT}`);
    console.log(`Swagger is running at ${httpsOptions ? 'https' : 'http'}://localhost:${PORT}/api-docs`);
});