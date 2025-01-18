const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const WebSocket = require('ws');
const cron = require('node-cron');
const eventRoutes = require('./routes/eventRoutes');
const notificationService = require('./services/notificationService');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/events', eventRoutes);

app.get('/', (req, res) => {
    res.send("Welcome to the Real-Time Event Notifier API!");
});

// WebSocket server
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
notificationService.initializeWebSocket(wss);

// Periodic notifications
cron.schedule('* * * * *', notificationService.checkAndNotifyEvents);

// Start the server
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
