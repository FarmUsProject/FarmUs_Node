const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
/*
    chatRoomID:{
        type: String
    }*/
  name: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Chat', chatSchema);
