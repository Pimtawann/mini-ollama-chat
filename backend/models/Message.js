const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    index: true
  },
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

messageSchema.index({ sessionId: 1, createAt: 1 });

module.exports = mongoose.model('Message', messageSchema);
