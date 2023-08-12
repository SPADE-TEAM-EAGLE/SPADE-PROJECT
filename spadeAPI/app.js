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
const server = http.createServer(app); // Use http.createServer to create the server
// const io = new Server(server);

app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors());

app.use((req, res, next) => {
    res.header("Cache-Control", "no-cache, no-store, must-revalidate");
    res.header("Pragma", "no-cache");
    res.header("Expires", "0");
    next();
});
const io = new Server(server, {
    cors: {
        origin: "http://127.0.0.1:5500", // Allow requests from this origin
        methods: ["GET", "POST"]
    }
});
// app.get('/socket.io/socket.io.js', (req, res) => {
//     const filePath = path.join(__dirname, 'node_modules/socket.io-client/dist/socket.io.js');

//     fs.readFile(filePath, 'utf8', (err, content) => {
//         if (err) {
//             res.status(404).send('File not found');
//         } else {
//             res.contentType('application/javascript');
//             res.send(content);
//         }
//     });
// });

app.use("/api/spade", userRoutes);
connect();
recurringController.start();

io.on('connection', socket => {
    console.log('A user connected');
    socket.on('message', message => {
        console.log('Received message from client:', message);
        // Respond to the client
        socket.emit('serverResponse', 'Message received by the server');
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
