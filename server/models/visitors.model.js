const mongoose = require('mongoose');

const visitorsSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  type: {
    type: String,
    enum: ['delivery', 'electrician', 'guest', 'plumber', 'other'],
    required: true,
  },
  phone: {
    type: Number,
  },
  purpose: {
    type: String,
  },
  flat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Flat',
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  },
  checkIn: {
    type: Date,
  },
  checkOut: {
    type: Date,
  },
  registeredBy:  {
    type : mongoose.Schema.Types.ObjectId ,
    ref : 'User'
  }
});

const Visitor = mongoose.model('Visitor', visitorsSchema);

module.exports = Visitor;