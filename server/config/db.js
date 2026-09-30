const mongoose = require('mongoose');

// Seed default sample data if database is empty
const seedInitialData = async () => {
  try {
    const Transaction = require('../models/Transaction');
    const Budget = require('../models/Budget');

    const count = await Transaction.countDocuments();
    if (count === 0) {
      await Transaction.insertMany([
        {
          title: 'Monthly Salary',
          amount: 45000,
          category: 'Income',
          date: new Date('2026-09-01'),
          type: 'Income'
        },
        {
          title: 'Restaurant Lunch',
          amount: 250,
          category: 'Food',
          date: new Date('2026-09-05'),
          type: 'Expense'
        },
        {
          title: 'Bus Pass',
          amount: 500,
          category: 'Transport',
          date: new Date('2026-09-08'),
          type: 'Expense'
        },
        {
          title: 'Shopping at Mall',
          amount: 2500,
          category: 'Shopping',
          date: new Date('2026-09-12'),
          type: 'Expense'
        },
        {
          title: 'Electricity Bill',
          amount: 2000,
          category: 'Bills',
          date: new Date('2026-09-15'),
          type: 'Expense'
        },
        {
          title: 'Movie Tickets',
          amount: 500,
          category: 'Entertainment',
          date: new Date('2026-09-20'),
          type: 'Expense'
        }
      ]);
      console.log('Sample data auto-seeded into database.');
    }

    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const budgetCount = await Budget.countDocuments({ month: currentMonth });
    if (budgetCount === 0) {
      await Budget.create({
        amount: 30000,
        month: currentMonth
      });
      console.log(`Default budget (₹30,000) created for month ${currentMonth}.`);
    }
  } catch (err) {
    console.error('Error seeding initial data:', err.message);
  }
};

const connectDB = async () => {
  const primaryUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/expense_tracker';

  try {
    console.log(`Connecting to MongoDB at ${primaryUri}...`);
    const conn = await mongoose.connect(primaryUri, {
      serverSelectionTimeoutMS: 3000
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    await seedInitialData();
  } catch (error) {
    console.warn(`Primary MongoDB connection failed (${error.message}). Attempting MongoMemoryServer fallback...`);

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      await mongoose.connect(mongoUri);
      console.log(`Connected to In-Memory MongoDB at ${mongoUri}`);
      await seedInitialData();
    } catch (memError) {
      console.error('Could not connect to MongoDB or MongoMemoryServer:', memError.message);
      console.error('Please ensure MongoDB is running or MONGODB_URI in server/.env is valid.');
    }
  }
};

module.exports = connectDB;
