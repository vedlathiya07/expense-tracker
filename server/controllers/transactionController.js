const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');

// In-Memory Fallback Data Store (active whenever Mongoose is not connected to a live database)
let memTransactions = [
  {
    _id: '1',
    title: 'Monthly Salary',
    amount: 45000,
    category: 'Income',
    date: new Date('2026-09-01').toISOString(),
    type: 'Income',
    createdAt: new Date('2026-09-01').toISOString()
  },
  {
    _id: '2',
    title: 'Restaurant Lunch',
    amount: 250,
    category: 'Food',
    date: new Date('2026-09-05').toISOString(),
    type: 'Expense',
    createdAt: new Date('2026-09-05').toISOString()
  },
  {
    _id: '3',
    title: 'Bus Pass',
    amount: 500,
    category: 'Transport',
    date: new Date('2026-09-08').toISOString(),
    type: 'Expense',
    createdAt: new Date('2026-09-08').toISOString()
  },
  {
    _id: '4',
    title: 'Shopping at Mall',
    amount: 2500,
    category: 'Shopping',
    date: new Date('2026-09-12').toISOString(),
    type: 'Expense',
    createdAt: new Date('2026-09-12').toISOString()
  },
  {
    _id: '5',
    title: 'Electricity Bill',
    amount: 2000,
    category: 'Bills',
    date: new Date('2026-09-15').toISOString(),
    type: 'Expense',
    createdAt: new Date('2026-09-15').toISOString()
  },
  {
    _id: '6',
    title: 'Movie Tickets',
    amount: 500,
    category: 'Entertainment',
    date: new Date('2026-09-20').toISOString(),
    type: 'Expense',
    createdAt: new Date('2026-09-20').toISOString()
  }
];

const isDbConnected = () => mongoose.connection.readyState === 1;

// @desc    Get all transactions (with optional search and filters)
// @route   GET /api/transactions
// @access  Public
const getTransactions = async (req, res, next) => {
  try {
    const { search, type, category, startDate, endDate } = req.query;

    if (isDbConnected()) {
      const query = {};
      if (search) query.title = { $regex: search, $options: 'i' };
      if (type && type !== 'All') query.type = type;
      if (category && category !== 'All') query.category = category;
      if (startDate || endDate) {
        query.date = {};
        if (startDate) query.date.$gte = new Date(startDate);
        if (endDate) {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          query.date.$lte = end;
        }
      }

      const transactions = await Transaction.find(query).sort({ date: -1, createdAt: -1 });
      return res.status(200).json({ success: true, count: transactions.length, data: transactions });
    }

    // In-memory fallback filtering
    let results = [...memTransactions];

    if (search) {
      const q = search.toLowerCase();
      results = results.filter((t) => t.title.toLowerCase().includes(q));
    }
    if (type && type !== 'All') {
      results = results.filter((t) => t.type === type);
    }
    if (category && category !== 'All') {
      results = results.filter((t) => t.category === category);
    }
    if (startDate) {
      results = results.filter((t) => new Date(t.date) >= new Date(startDate));
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      results = results.filter((t) => new Date(t.date) <= end);
    }

    results.sort((a, b) => new Date(b.date) - new Date(a.date));

    return res.status(200).json({
      success: true,
      count: results.length,
      data: results
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single transaction by ID
// @route   GET /api/transactions/:id
// @access  Public
const getTransactionById = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      const transaction = await Transaction.findById(req.params.id);
      if (!transaction) return res.status(404).json({ success: false, message: 'Transaction not found' });
      return res.status(200).json({ success: true, data: transaction });
    }

    const transaction = memTransactions.find((t) => t._id === req.params.id);
    if (!transaction) return res.status(404).json({ success: false, message: 'Transaction not found' });
    return res.status(200).json({ success: true, data: transaction });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new transaction
// @route   POST /api/transactions
// @access  Public
const createTransaction = async (req, res, next) => {
  try {
    const { title, amount, category, date, type } = req.body;

    if (isDbConnected()) {
      const transaction = await Transaction.create({ title, amount, category, date: date || new Date(), type });
      return res.status(201).json({ success: true, message: 'Transaction added successfully', data: transaction });
    }

    const newTx = {
      _id: String(Date.now()),
      title,
      amount: Number(amount),
      category,
      date: date ? new Date(date).toISOString() : new Date().toISOString(),
      type,
      createdAt: new Date().toISOString()
    };
    memTransactions.unshift(newTx);

    return res.status(201).json({
      success: true,
      message: 'Transaction added successfully',
      data: newTx
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update transaction
// @route   PUT /api/transactions/:id
// @access  Public
const updateTransaction = async (req, res, next) => {
  try {
    const { title, amount, category, date, type } = req.body;

    if (isDbConnected()) {
      let transaction = await Transaction.findById(req.params.id);
      if (!transaction) return res.status(404).json({ success: false, message: 'Transaction not found' });

      transaction = await Transaction.findByIdAndUpdate(
        req.params.id,
        { title, amount, category, date, type },
        { new: true, runValidators: true }
      );
      return res.status(200).json({ success: true, message: 'Transaction updated successfully', data: transaction });
    }

    const index = memTransactions.findIndex((t) => t._id === req.params.id);
    if (index === -1) return res.status(404).json({ success: false, message: 'Transaction not found' });

    memTransactions[index] = {
      ...memTransactions[index],
      title: title !== undefined ? title : memTransactions[index].title,
      amount: amount !== undefined ? Number(amount) : memTransactions[index].amount,
      category: category !== undefined ? category : memTransactions[index].category,
      date: date !== undefined ? new Date(date).toISOString() : memTransactions[index].date,
      type: type !== undefined ? type : memTransactions[index].type,
      updatedAt: new Date().toISOString()
    };

    return res.status(200).json({
      success: true,
      message: 'Transaction updated successfully',
      data: memTransactions[index]
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
// @access  Public
const deleteTransaction = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      const transaction = await Transaction.findById(req.params.id);
      if (!transaction) return res.status(404).json({ success: false, message: 'Transaction not found' });
      await transaction.deleteOne();
      return res.status(200).json({ success: true, message: 'Transaction deleted successfully', data: {} });
    }

    const index = memTransactions.findIndex((t) => t._id === req.params.id);
    if (index === -1) return res.status(404).json({ success: false, message: 'Transaction not found' });

    memTransactions.splice(index, 1);
    return res.status(200).json({ success: true, message: 'Transaction deleted successfully', data: {} });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction
};
