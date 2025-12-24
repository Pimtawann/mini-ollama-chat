# Mini Ollama Chat

A full-stack chat application powered by Ollama AI, built with Next.js and Express.js. This application allows users to have conversations with AI models running locally through Ollama, with support for multiple chat sessions.

## Features

- Real-time chat with Ollama AI models
- Multi-session support (create and manage multiple conversations)
- Persistent chat history stored in MongoDB
- Session-based conversation context
- Clean and responsive UI
- Message character limit (500 characters)

## Tech Stack

### Backend
- **Express.js** - Web framework
- **MongoDB** - Database for storing messages and sessions
- **Mongoose** - ODM for MongoDB
- **Axios** - HTTP client for Ollama API
- **Ollama** - Local AI model runtime

### Frontend
- **Next.js 14** - React framework
- **React** - UI library
- **Axios** - HTTP client
- **Tailwind CSS** - Styling (if configured)

## Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v18 or higher)
- **MongoDB** (v6 or higher)
- **Ollama** - For running AI models locally

## Installing Ollama

### macOS
```bash
# Using Homebrew
brew install ollama

# Or download from https://ollama.ai
```

### Linux
```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

### Windows
Download the installer from [https://ollama.ai](https://ollama.ai)

### Pull an AI Model
After installing Ollama, pull a model:
```bash
# Pull Llama 3 (default model for this app)
ollama pull llama3

# Or pull other models
ollama pull mistral
ollama pull codellama
```

### Start Ollama Service
```bash
# Start Ollama service
ollama serve
```

The Ollama API will be available at `http://localhost:11434`

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd mini-ollama-chat
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env file with your configuration
nano .env
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local file (optional)
echo "NEXT_PUBLIC_API_URL=http://localhost:3001" > .env.local
```

### 4. Start MongoDB

Make sure MongoDB is running:

```bash
# macOS (using Homebrew)
brew services start mongodb-community

# Linux (using systemd)
sudo systemctl start mongod

# Or run MongoDB directly
mongod --dbpath /path/to/data/directory
```

## Environment Variables

### Backend (.env)

Create a `.env` file in the `backend` directory with the following variables:

```env
# Server Port
PORT=3001

# MongoDB Connection String
MONGODB_URI=mongodb://localhost:27017/mini-ollama-chat

# Ollama API Configuration
OLLAMA_API_URL=http://localhost:11434
OLLAMA_MODEL=llama3
```

### Frontend (.env.local) - Optional

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

If not set, the frontend defaults to `http://localhost:3001`

## Running the Application

### 1. Start Ollama (if not already running)
```bash
ollama serve
```

### 2. Start Backend Server

```bash
cd backend

# Development mode (with auto-reload)
npm run dev

# Or production mode
npm start
```

The backend will run on `http://localhost:3001`

### 3. Start Frontend

In a new terminal:

```bash
cd frontend

# Development mode
npm run dev

# Or production build
npm run build
npm start
```

The frontend will run on `http://localhost:3000`

### 4. Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

## API Endpoints

### Sessions

- `GET /api/sessions` - Get all chat sessions
- `POST /api/sessions` - Create a new session
  ```json
  {
    "sessionId": "session_123",
    "title": "My Chat"
  }
  ```
- `DELETE /api/sessions/:sessionId` - Delete a session and its messages
- `DELETE /api/sessions/:sessionId/messages` - Clear messages in a session

### Messages

- `GET /api/messages/:sessionId` - Get all messages for a session
- `POST /api/chat` - Send a message and get AI response
  ```json
  {
    "message": "Hello, how are you?",
    "sessionId": "session_123"
  }
  ```

## Project Structure

```
mini-ollama-chat/
├── backend/
│   ├── models/
│   │   ├── Message.js      # Message schema
│   │   └── Session.js      # Session schema
│   ├── routes/
│   │   └── chat.js         # API routes
│   ├── services/
│   │   └── ollamaService.js # Ollama API integration
│   ├── config/
│   │   └── db.js           # MongoDB connection
│   ├── .env.example
│   ├── server.js           # Express server
│   └── package.json
│
└── frontend/
    ├── app/
    │   ├── page.js         # Main chat component
    │   └── layout.js       # Root layout
    ├── public/
    └── package.json
```

## Troubleshooting

### Ollama Connection Issues
- Make sure Ollama is running: `ollama serve`
- Verify the model is installed: `ollama list`
- Check Ollama API URL in `.env` matches your setup

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check MongoDB URI in `.env`
- Verify MongoDB is accessible: `mongosh`

### Port Already in Use
- Change `PORT` in backend `.env`
- For frontend, use: `npm run dev -- -p 3001`

## License

ISC

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
