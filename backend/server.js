require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const chatRoutes = require('./routes/chat');

const app = express();
const PORT = process.env.PORT || 3001;

connectDB();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Mini Ollama Chat Backend is running!' });
});

app.use('/api', chatRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
