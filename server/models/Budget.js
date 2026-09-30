const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: [true, 'Please add a budget amount'],
      min: [0, 'Budget amount cannot be negative']
    },
    month: {
      type: String,
      required: [true, 'Please specify the month (YYYY-MM)'],
      trim: true
    }
  },
  {
    timestamps: true
  }
);

// Ensure unique budget entry per month
budgetSchema.index({ month: 1 }, { unique: true });

module.exports = mongoose.model('Budget', budgetSchema);
