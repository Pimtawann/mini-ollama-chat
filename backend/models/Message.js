const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true,
    enum: ['user', 'ai']
  },
  content: {
    type: String,
    required: true,
    maxlength: 500
  },
  createAt: {
    type: Date,
    default: Date.now
  }
}, {
  versionKey: false
});

module.exports = mongoose.model('Message', messageSchema);
