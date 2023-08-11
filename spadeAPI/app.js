const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRoutes = require("./routes/userRoutes");
const { connect } = require("./config/connection");
const http = require('http');
const recurringController = require("./controllers/recurringController"); 
const { Server } = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const path = require('path');
app.use(cookieParser());
app.use(bodyParser.json());

app.use(cors());
app.use((req, res, next) => {
    res.header("Cache-Control", "no-cache, no-store, must-revalidate");
    res.header("Pragma", "no-cache");
    res.header("Expires", "0");
    next();
});

app.use("/api/spade", userRoutes);
connect();
recurringController.start();
io.on('connection', socket => {
    console.log('A user connected');

    socket.on('message', message => {
        console.log('Received message:', message);
        // Broadcast the message to all connected clients
        io.emit('message', message);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

app.listen(3000, () => {
    console.log('listening on *:3000');
});
