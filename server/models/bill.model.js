const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['unpaid', 'paid', 'pending'],
    default: 'unpaid',
  },
  flat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Flat',
    required: true,
  },
  resident: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  paymentDate: {
    type: Date,
  }
}, { timestamps: true });

const Bill = mongoose.model('Bill', billSchema);

module.exports = Bill;
