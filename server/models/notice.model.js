const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  expiryDate: {
    type: Date,
  },
}, { timestamps: true });

const Notice = mongoose.model('Notice', noticeSchema);

module.exports = Notice;