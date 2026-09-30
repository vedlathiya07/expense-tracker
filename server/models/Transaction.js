const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
      minlength: [2, 'Title must be at least 2 characters long']
    },
    amount: {
      type: Number,
      required: [true, 'Please add an amount'],
      min: [0.01, 'Amount must be greater than 0']
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      trim: true
    },
    date: {
      type: Date,
      required: [true, 'Please select a date'],
      default: Date.now
    },
    type: {
      type: String,
      required: [true, 'Please specify the transaction type'],
      enum: {
        values: ['Income', 'Expense'],
        message: 'Type must be either Income or Expense'
      }
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Transaction', transactionSchema);
