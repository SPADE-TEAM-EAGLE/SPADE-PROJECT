const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRoutes = require("./routes/userRoutes");
const { connect } = require("./config/connection");
const http = require("http");
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
    methods: ["GET", "POST"],
  },
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/spade", userRoutes);
connect();
recurringController.start();

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("joinRoom", (data) => {
    const roomId = data.chatId; // Access the 'chatId' property from the received object
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });
  socket.on("chatMessage", (data) => {
    console.log(
        `User ${socket.id} sent message to room ${data.chatId} and message ${data.message}`
    );
    const roomId = data.chatId;
    
    // Emit the chat message to everyone in the room, including the sender
    io.to(roomId).emit("chatMessage", data.message);
});
//   socket.emit("notification", { message: "New notification received!" });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
module.exports = io;
