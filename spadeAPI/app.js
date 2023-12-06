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
    origin: "", // Allow requests from this origin
    methods: ["GET", "POST"],
  },
});
app.use((req, res, next) => {
  req.io = io; // Attach io to the request object
  next();
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

    io.to(roomId).emit("chatMessage", data.message);
});
socket.on("notification", (data) => {
 console.log("data",data);

  io.emit("chatMessage", data);
});


  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
