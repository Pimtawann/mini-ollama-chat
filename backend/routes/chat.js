const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const Session = require('../models/Session');
const { chat } = require('../services/ollamaService');

// GET all sessions
router.get('/sessions', async (req, res) => {
  try {
    const sessions = await Session.find().sort({ updatedAt: -1 });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

// POST create new session
router.post('/sessions', async (req, res) => {
  try {
    const { sessionId, title } = req.body;

    const session = new Session({
      sessionId: sessionId || `session_${Date.now()}`,
      title: title || 'New Chat'
    });

    await session.save();
    res.json(session);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create session' });
  }
});

// GET all messages for a session
router.get('/messages/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const messages = await Message.find({ sessionId }).sort({ createAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// POST new chat message
router.post('/chat', async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    if (message.length > 500) {
      return res.status(400).json({ error: 'Message must not exceed 500 characters' });
    }

    // Verify session exists or create it
    let session = await Session.findOne({ sessionId });
    if (!session) {
      session = new Session({ sessionId });
      await session.save();
    }

    // Save user message to database
    const userMessage = new Message({
      sessionId,
      role: 'user',
      content: message
    });
    await userMessage.save();

    // Get all previous messages for this session
    const allMessages = await Message.find({ sessionId }).sort({ createAt: 1 });

    // Format messages for Ollama API
    const ollamaMessages = allMessages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    // Get response from Ollama
    const aiResponse = await chat(ollamaMessages);

    // Save AI response to database
    const aiMessage = new Message({
      sessionId,
      role: 'ai',
      content: aiResponse
    });
    await aiMessage.save();

    // Update session's updatedAt
    session.updatedAt = Date.now();
    await session.save();

    res.json({
      userMessage,
      aiMessage
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to process chat message' });
  }
});

// DELETE clear session messages
router.delete('/sessions/:sessionId/messages', async (req, res) => {
  try {
    const { sessionId } = req.params;
    await Message.deleteMany({ sessionId });
    res.json({ message: 'Messages cleared successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to clear messages' });
  }
});

// DELETE session
router.delete('/sessions/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    await Message.deleteMany({ sessionId });
    await Session.deleteOne({ sessionId });
    res.json({ message: 'Session deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete session' });
  }
});

module.exports = router;
