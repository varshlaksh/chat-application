const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const socketIO = require("socket.io");

const connectDB = require("./config/db");
const chatRoutes = require("./routes/chatRoutes"); // Make sure this exists and exports router
const { handleSocket } = require("./sockets/socketHandler"); // Optional: if using separate file for socket logic

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const server = http.createServer(app);

// Setup Socket.IO
const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middlewares
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/chat", chatRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("✅ Chat API is running.");
});

// Socket.IO connections
io.on("connection", (socket) => {
  console.log("New client connected");

  // Optional: handle chat logic in separate file
  if (handleSocket) {
    handleSocket(socket, io);
  }

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
