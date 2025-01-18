const events = require('../data/events'); // Simulate in-memory event storage
const logger = require('../utils/logger');

let wss;

// Initialize the WebSocket server
const initializeWebSocket = (webSocketServer) => {
    wss = webSocketServer;
    console.log("WebSocket server initialized");
};

// Function to send notifications to WebSocket clients
const notifyClients = (message) => {
    if (wss) {
        wss.clients.forEach((client) => {
            if (client.readyState === 1) { // WebSocket.OPEN
                client.send(JSON.stringify(message));
            }
        });
    }
};

// Function to check and notify events based on time
const checkAndNotifyEvents = () => {
    const now = new Date();

    events.forEach((event) => {
        const eventTime = new Date(event.time);
        const timeDiff = (eventTime - now) / (1000 * 60); // Time difference in minutes

        // Notify 5 minutes before event start
        if (timeDiff > 0 && timeDiff <= 5 && !event.notified) {
            notifyClients({ 
                type: 'notification', 
                message: `Reminder: Event "${event.title}" starts at ${event.time}.` 
            });
            event.notified = true;
        }

        // Log completed events once they pass
        if (timeDiff <= 0 && !event.completed) {
            logger.logCompletedEvent(event);
            event.completed = true;
        }
    });

    // Check for overlapping events
    const overlappingEvents = events.filter((event) => {
        const eventTime = new Date(event.time);
        return (
            events.some((e) => 
                e.id !== event.id && new Date(e.time).getTime() === eventTime.getTime()
            )
        );
    });

    // Notify clients about overlapping events
    if (overlappingEvents.length > 1) {
        notifyClients({ type: 'warning', message: 'Overlapping events detected!' });
    }
};

module.exports = { initializeWebSocket, checkAndNotifyEvents };
