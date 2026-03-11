const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');

const PORT = process.env.PORT;

app.use(express.static(path.join(__dirname, 'dist')));
app.use(cors({
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
}));

app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const server = app.listen(PORT, () => console.log('Application started on port:', PORT));

process.on('SIGINT', () => {
    console.warn("Got SIGINT! Interrupting");
    process.exit(0);
})

process.on('SIGTERM', function onSigterm () {
    console.info('Got SIGTERM. Graceful shutdown', new Date().toISOString())

    server.close((err) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }

        process.exit(0);
    });
});

