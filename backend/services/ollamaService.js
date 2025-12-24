const axios = require('axios');

const OLLAMA_API_URL = process.env.OLLAMA_API_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3';

async function chat(messages) {
  try {
    // Convert 'ai' role to 'assistant' for Ollama API
    const ollamaMessages = messages.map(msg => ({
      role: msg.role === 'ai' ? 'assistant' : msg.role,
      content: msg.content
    }));

    const response = await axios.post(`${OLLAMA_API_URL}/api/chat`, {
      model: OLLAMA_MODEL,
      messages: ollamaMessages,
      stream: false
    });

    return response.data.message.content;
  } catch (error) {
    console.error('Ollama API error:', error.message);
    throw new Error('Failed to get response from Ollama');
  }
}

module.exports = { chat };
