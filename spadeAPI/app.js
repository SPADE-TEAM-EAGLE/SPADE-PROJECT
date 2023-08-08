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

io.on("connection", (socket) => {
    console.log("Connected to socket.io");
    socket.on('join chat', (room) => {
        socket.join(room);
        console.log("User Joined Room: " + room);
    });

    socket.on("leave chat", (room) => {
        socket.leave(room);
        console.log("User left Room: " + room);
    });
    
    socket.on("new message", (data) => {
        console.log(data);
        const senderId = data.chat._id;
        console.log('room id', senderId);
        chats = data.chat;

        io.in(data.chat._id).emit("message-recieved", data);
    });
})

app.listen(3000, () => {
    console.log('listening on *:3000');
});
