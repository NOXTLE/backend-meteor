const express = require("express");
const cors = require("cors");
const path = require("path");
const connect = require("./config/db");
const router = require("./Routes/userRoute"); // Assuming server.js is in 'backend' and Routes is in 'backend/Routes'
const server = express();
const dotenv = require("dotenv");
dotenv.config();
const chatrouter = require("./Routes/chatRoute"); // CORRECTED PATH
const messageRouter = require("./Routes/messageRouter"); // CORRECTED PATH
connect();
server.use(express.json());

// --- CORRECTED EXPRESS CORS CONFIGURATION ---
server.use(
  cors({
    origin:
      "https://frontend-meteor-git-master-adityas-projects-dcce7ebc.vercel.app", // NO TRAILING SLASH HERE, specific origin
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods for your API
    credentials: true, // If you're sending cookies or auth headers
  })
);

const PORT = process.env.PORT || 8080;
// server.use(cors()); // REMOVE THIS LINE - it's replaced by the configured cors middleware above

server.use("/api/user", router);
server.use("/api/chat", chatrouter);
server.use("/api/message", messageRouter);

// --- REMOVE OR KEEP COMMENTED THE FRONTEND DEPLOYMENT BLOCK ---
// const __dirname1 = path.resolve();
// if (process.env.NODE_ENV === "production") {
//   server.use(express.static(path.join(__dirname1, "/client/dist")));
//   server.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname1, "client", "dist", "index.html"));
//   });
// } else {
//   server.get("/", (req, res) => {
//     res.send("API SUCCESS");
//   });
// }
// -----------------------------------------------------------

// A basic root route to confirm backend is running (optional)
server.get("/", (req, res) => {
  res.send("Backend API is running!");
});

const app = server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const io = require("socket.io")(app, {
  pingTimeout: 60000,
  cors: {
    origin:
      "https://frontend-meteor-git-master-adityas-projects-dcce7ebc.vercel.app", // CORRECTED: NO TRAILING SLASH HERE
    methods: ["GET", "POST"], // Socket.IO typically uses GET/POST for handshake
    credentials: true,
  },
});

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

  // --- CORRECTED DISCONNECT HANDLING ---
  socket.on("disconnect", () => {
    // Listen for the 'disconnect' event
    console.log("USER DISCONNECTED from socket");
    // No need to explicitly leave rooms here, Socket.IO handles it
  });
});
