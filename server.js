// TOP OF FILE: All your require statements and initial setup
const express = require("express");
const cors = require("cors");
const path = require("path");
const connect = require("./config/db");
const router = require("./Routes/userRoute");
const server = express();
const dotenv = require("dotenv");
dotenv.config();
const chatrouter = require("./Routes/chatRoute");
const messageRouter = require("./Routes/messageRouter");

connect();
server.use(express.json());

// EXPRESS CORS CONFIGURATION
server.use(
  cors({
    origin: [
      "https://frontend-meteor.vercel.app", // Your main Vercel production URL
      "https://frontend-meteor-git-master-adityas-projects-dcce7ebc.vercel.app", // Your Vercel preview/branch URL
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

const PORT = process.env.PORT || 8080;

// API ROUTES
server.use("/api/user", router);
server.use("/api/chat", chatrouter);
server.use("/api/message", messageRouter);

// BASIC ROOT ROUTE (optional)
server.get("/", (req, res) => {
  res.send("Backend API is running!");
});

// SERVER LISTEN
const app = server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// SOCKET.IO CONFIGURATION
const io = require("socket.io")(app, {
  pingTimeout: 60000,
  cors: {
    origin: [
      "https://frontend-meteor.vercel.app",
      "https://frontend-meteor-git-master-adityas-projects-dcce7ebc.vercel.app",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// SOCKET.IO EVENT HANDLERS
io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    console.log("User joined room:", userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User joined chat room:", room);
  });

  socket.on("new message", (newMessageReceived) => {
    const chat = newMessageReceived.chat;
    if (!chat || !chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id === newMessageReceived.sender._id) return;
      socket.to(user._id).emit("message recieved", newMessageReceived);
    });
  });

  socket.on("typing", (room) => {
    socket.in(room).emit("typing");
  });
  socket.on("stop typing", (room) => {
    socket.in(room).emit("stop typing");
  });

  socket.on("disconnect", () => {
    console.log("USER DISCONNECTED from socket");
  });
});
