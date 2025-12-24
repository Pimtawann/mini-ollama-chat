'use client';

import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import ConfirmModal from './components/ConfirmModal';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showClearModal, setShowClearModal] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setSessionId(newSessionId);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (e) => {
    e.preventDefault();

    if (!input.trim()) return;

    if (input.length > 500) {
      setError('Message must not exceed 500 characters');
      return;
    }

    const userMessage = input.trim();
    setInput('');
    setError('');
    setLoading(true);

    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      const response = await axios.post(`${API_URL}/api/chat`, {
        message: userMessage,
        sessionId: sessionId
      });

      setMessages(prev => [...prev, {
        role: 'ai',
        content: response.data.aiMessage.content
      }]);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send message. Please try again.');
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setShowClearModal(true);
  };

  const confirmClearChat = () => {
    setMessages([]);
    setError('');
    setShowClearModal(false);
  };

  const cancelClearChat = () => {
    setShowClearModal(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>Mini Ollama Chat</h1>
          <button
            onClick={clearChat}
            disabled={loading || messages.length === 0}
            style={{
              ...styles.clearButton,
              opacity: (loading || messages.length === 0) ? 0.5 : 1,
              cursor: (loading || messages.length === 0) ? 'not-allowed' : 'pointer',
            }}
          >
            Clear Chat
          </button>
        </div>
      </div>

      <div style={styles.messagesContainer}>
        {messages.length === 0 ? (
          <p style={styles.emptyState}>Start a conversation...</p>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              style={msg.role === 'user' ? styles.userMessageWrapper : styles.aiMessageWrapper}
            >
              <div style={msg.role === 'user' ? styles.userMessage : styles.aiMessage}>
                <strong>{msg.role === 'user' ? 'You' : 'AI'}:</strong>
                <p style={styles.messageContent}>{msg.content}</p>
              </div>
            </div>
          ))
        )}

        {loading && (
          <div style={styles.aiMessageWrapper}>
            <div style={styles.loadingMessage}>
              <strong>AI:</strong>
              <p style={styles.messageContent}>Thinking...</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div style={styles.inputContainer}>
        <form onSubmit={sendMessage} style={styles.form}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={loading}
            style={styles.input}
            maxLength={500}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            style={styles.button}
          >
            Send
          </button>
        </form>

        {error && (
          <p style={styles.errorMessage}>{error}</p>
        )}

        {loading && (
          <p style={styles.statusMessage}>AI is thinking...</p>
        )}
      </div>

      <ConfirmModal
        isOpen={showClearModal}
        onConfirm={confirmClearChat}
        onCancel={cancelClearChat}
        title="Clear Chat"
        message="Are you sure you want to clear all messages?"
      />
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    maxWidth: '800px',
    margin: '0 auto',
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#333',
    color: 'white',
    padding: '20px',
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '800px',
    margin: '0 auto',
  },
  title: {
    margin: 0,
    fontSize: '24px',
  },
  clearButton: {
    padding: '8px 16px',
    fontSize: '14px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
  },
  messagesContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px',
    backgroundColor: 'white',
  },
  emptyState: {
    textAlign: 'center',
    color: '#999',
    marginTop: '50px',
  },
  userMessageWrapper: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: '15px',
  },
  aiMessageWrapper: {
    display: 'flex',
    justifyContent: 'flex-start',
    marginBottom: '15px',
  },
  userMessage: {
    maxWidth: '70%',
    padding: '10px 15px',
    backgroundColor: '#007bff',
    color: 'white',
    borderRadius: '18px',
    borderBottomRightRadius: '4px',
  },
  aiMessage: {
    maxWidth: '70%',
    padding: '10px 15px',
    backgroundColor: '#f1f1f1',
    color: '#333',
    borderRadius: '18px',
    borderBottomLeftRadius: '4px',
  },
  loadingMessage: {
    maxWidth: '70%',
    padding: '10px 15px',
    backgroundColor: '#fff9c4',
    color: '#333',
    borderRadius: '18px',
    borderBottomLeftRadius: '4px',
  },
  messageContent: {
    margin: '5px 0 0 0',
    whiteSpace: 'pre-wrap',
  },
  inputContainer: {
    padding: '20px',
    backgroundColor: '#fff',
    borderTop: '1px solid #ddd',
  },
  form: {
    display: 'flex',
    gap: '10px',
  },
  input: {
    flex: 1,
    padding: '12px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '4px',
  },
  button: {
    padding: '12px 24px',
    fontSize: '16px',
    backgroundColor: '#333',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  errorMessage: {
    margin: '10px 0 0 0',
    color: '#d32f2f',
    fontSize: '14px',
  },
  statusMessage: {
    margin: '10px 0 0 0',
    color: '#666',
    fontSize: '14px',
  },
};
