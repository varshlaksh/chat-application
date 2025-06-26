const express = require("express");
const router = express.Router();
const Message = require("../models/Message");

// Create message
router.post("/", async (req, res) => {
  try {
    const newMsg = new Message(req.body);
    const saved = await newMsg.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: "Failed to send message", details: err });
  }
});

// Get all messages
router.get("/", async (req, res) => {
  try {
    const messages = await Message.find().sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages", details: err });
  }
});

module.exports = router;
