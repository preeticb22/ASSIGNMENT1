const fs = require('fs');
const logFile = process.env.LOG_FILE || 'completed_events.log';

exports.logCompletedEvent = (event) => {
    const logEntry = `${new Date().toISOString()} - Event Completed: ${JSON.stringify(event)}\n`;
    fs.appendFile(logFile, logEntry, (err) => {
        if (err) console.error("Error writing to log file:", err);
    });
};
