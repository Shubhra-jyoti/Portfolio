let app;
try {
    app = require('../server');
} catch (err) {
    // If server.js crashes during import, create a diagnostic app
    // so we can see the actual error instead of a generic 500
    const express = require('express');
    app = express();
    app.use((req, res) => {
        res.status(500).json({
            error: 'Server initialization failed',
            message: err.message,
            stack: err.stack
        });
    });
}
module.exports = app;
