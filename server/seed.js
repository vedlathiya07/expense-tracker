const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Transaction = require('./models/Transaction');
const Budget = require('./models/Budget');

dotenv.config();

const sampleTransactions = [
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
  },
  {
    title: 'Freelance Project',
    amount: 15000,
    category: 'Income',
    date: new Date('2026-09-22'),
    type: 'Income'
  },
  {
    title: 'Health Insurance',
    amount: 3500,
    category: 'Health',
    date: new Date('2026-09-25'),
    type: 'Expense'
  },
  {
    title: 'Online Course',
    amount: 1200,
    category: 'Education',
    date: new Date('2026-09-28'),
    type: 'Expense'
  }
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/expense_tracker');
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await Transaction.deleteMany({});
    await Budget.deleteMany({});

    // Insert sample transactions
    await Transaction.insertMany(sampleTransactions);
    console.log('Sample transactions inserted!');

    // Insert sample budget for current month YYYY-MM
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    await Budget.create({
      amount: 30000,
      month: currentMonth
    });
    console.log(`Sample budget (₹30,000) inserted for month ${currentMonth}!`);

    console.log('Database Seeding Completed Successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`Seeding error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
