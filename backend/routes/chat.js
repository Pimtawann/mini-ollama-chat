const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const { chat } = require('../services/ollamaService');

// GET all messages
router.get('/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// POST new chat message
router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (message.length > 500) {
      return res.status(400).json({ error: 'Message must not exceed 500 characters' });
    }

    // Save user message to database
    const userMessage = new Message({
      role: 'user',
      content: message
    });
    await userMessage.save();

    // Get all previous messages for context
    const allMessages = await Message.find().sort({ createAt: 1 });

    // Format messages for Ollama API
    const ollamaMessages = allMessages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    // Get response from Ollama
    const aiResponse = await chat(ollamaMessages);

    // Save AI response to database
    const aiMessage = new Message({
      role: 'ai',
      content: aiResponse
    });
    await aiMessage.save();

    res.json({
      userMessage,
      aiMessage
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to process chat message' });
  }
});

module.exports = router;
