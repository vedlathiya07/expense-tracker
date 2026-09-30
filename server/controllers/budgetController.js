const mongoose = require('mongoose');
const Budget = require('../models/Budget');

const getCurrentMonth = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

// In-Memory Fallback Budget Store
const memBudgets = {};

const isDbConnected = () => mongoose.connection.readyState === 1;

// @desc    Get current monthly budget
// @route   GET /api/budget
// @access  Public
const getBudget = async (req, res, next) => {
  try {
    const month = req.query.month || getCurrentMonth();

    if (isDbConnected()) {
      let budget = await Budget.findOne({ month });
      if (!budget) {
        budget = { amount: 30000, month: month, isDefault: true };
      }
      return res.status(200).json({ success: true, data: budget });
    }

    if (!memBudgets[month]) {
      memBudgets[month] = { amount: 30000, month, isDefault: true };
    }

    return res.status(200).json({
      success: true,
      data: memBudgets[month]
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create or update monthly budget
// @route   PUT /api/budget
// @access  Public
const updateBudget = async (req, res, next) => {
  try {
    const { amount, month: requestedMonth } = req.body;

    if (amount === undefined || amount === null || isNaN(amount) || amount < 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid budget amount greater than or equal to 0'
      });
    }

    const targetMonth = requestedMonth || getCurrentMonth();

    if (isDbConnected()) {
      const budget = await Budget.findOneAndUpdate(
        { month: targetMonth },
        { amount: Number(amount), month: targetMonth },
        { new: true, upsert: true, runValidators: true }
      );
      return res.status(200).json({ success: true, message: 'Monthly budget updated successfully', data: budget });
    }

    memBudgets[targetMonth] = {
      _id: String(Date.now()),
      amount: Number(amount),
      month: targetMonth,
      updatedAt: new Date().toISOString()
    };

    return res.status(200).json({
      success: true,
      message: 'Monthly budget updated successfully',
      data: memBudgets[targetMonth]
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBudget,
  updateBudget
};
