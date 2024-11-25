import { WebSocketServer } from 'ws';
import { redisClient, getWorkspaceCacheKey } from './redisConfig'; // Import Redis client and related utilities
import * as blockService from '../services/blockService'; // Import workspace persistence logic

// Store the WebSocket Server instances for each workspace
const workspaceSockets: Record<string, WebSocketServer> = {};

/**
 * Dynamically initialize a WebSocket server for a specific workspace
 * @param workspaceId - The unique identifier for the workspace
 */
export const configureDynamicWebSocket = (workspaceId: string) => {
    // If the WebSocket server for this workspace is already initialized, exit early
    if (workspaceSockets[workspaceId]) {
        console.log(`WebSocket already initialized for workspace: ${workspaceId}`);
        return;
    }

    // Create a new WebSocket server for the workspace
    const wss = new WebSocketServer({ noServer: true });
    workspaceSockets[workspaceId] = wss; // Store the WebSocket server instance in the record

    // Handle new client connections to the WebSocket server
    wss.on('connection', (ws) => {
        console.log(`Client connected to workspace: ${workspaceId}`);

        // Handle messages from the connected client
        ws.on('message', (message) => {
            const data = JSON.parse(message.toString()); // Parse the received message as JSON
            // Save the data to Redis cache
            redisClient.set(getWorkspaceCacheKey(workspaceId), JSON.stringify(data));

            // Broadcast the message to all clients connected to the same workspace
            wss.clients.forEach((client) => {
                if (client.readyState === client.OPEN) {
                    client.send(message.toString()); // Send the raw message to the client
                }
            });
        });

        // Handle client disconnection
        ws.on('close', async () => {
            console.log(`Client disconnected from workspace: ${workspaceId}`);

            // Check if any other clients are still connected to the workspace
            const isWorkspaceStillActive = [...wss.clients].some(
                (client) => client.readyState === client.OPEN
            );

            // If no active connections remain, clean up resources
            if (!isWorkspaceStillActive) {
                console.log(`Workspace ${workspaceId} is no longer active.`);
                delete workspaceSockets[workspaceId]; // Remove the WebSocket server instance

                // Save the Redis cache data to MongoDB
                const cache = await redisClient.get(getWorkspaceCacheKey(workspaceId));
                if (cache) {
                    // !: save block back to mongo DB
                    // TODO: save block back to mongo DB
                }
            }
        });
    });

    console.log(`WebSocket server initialized for workspace: ${workspaceId}`);
};

/**
 * Handle HTTP request upgrades to WebSocket connections
 * @param workspaceId - The unique identifier for the workspace
 * @param req - The original HTTP request
 * @param socket - The TCP socket instance
 * @param head - Additional request data
 */
export const handleUpgrade = (workspaceId: string, req: any, socket: any, head: any) => {
    // Retrieve the WebSocket server for the specified workspace
    const wss = workspaceSockets[workspaceId];

    // If no WebSocket server exists for this workspace, destroy the connection
    if (!wss) {
        socket.destroy(); // Terminate the socket
        return;
    }

    // Process the upgrade request and pass the connection to the WebSocket server
    wss.handleUpgrade(req, socket, head, (ws) => {
        wss.emit('connection', ws, req); // Manually trigger the 'connection' event
    });
};
