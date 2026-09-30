import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  ArrowRight,
  Edit2,
  Trash2
} from 'lucide-react';
import SummaryCard from '../components/SummaryCard';
import BudgetProgress from '../components/BudgetProgress';
import { ExpenseCategoryChart, IncomeVsExpenseChart } from '../components/ChartCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { getTransactions, getBudget, updateBudget, deleteTransaction } from '../services/api';
import { formatCurrency, formatDate } from '../utils/formatters';

const Dashboard = ({
  onOpenAddModal,
  onOpenEditModal,
  onOpenBudgetModal,
  showToast,
  refreshTrigger
}) => {
  const [transactions, setTransactions] = useState([]);
  const [budgetAmount, setBudgetAmount] = useState(30000);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard data (Transactions & Monthly Budget)
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [txRes, budgetRes] = await Promise.all([
        getTransactions(),
        getBudget()
      ]);

      if (txRes.success) {
        setTransactions(txRes.data);
      }
      if (budgetRes.success && budgetRes.data) {
        setBudgetAmount(budgetRes.data.amount);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setError('Unable to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData, refreshTrigger]);

  // Calculations
  const totalIncome = transactions
    .filter((t) => t.type === 'Income')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpenses = transactions
    .filter((t) => t.type === 'Expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const remainingBudget = budgetAmount - totalExpenses;
  const savings = totalIncome - totalExpenses;

  // Recent 5 transactions
  const recentTransactions = transactions.slice(0, 5);

  if (loading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  if (error) {
    return (
      <div className="section-card" style={{ textAlign: 'center', color: '#ef4444', padding: '2rem' }}>
        <p>{error}</p>
        <button className="btn-secondary" style={{ marginTop: '1rem' }} onClick={fetchData}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Overview of your monthly budget, income & expenses</p>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="summary-grid">
        <SummaryCard
          title="Monthly Budget"
          amount={budgetAmount}
          icon={Wallet}
          type="budget"
          subtext="Set for current month"
        />
        <SummaryCard
          title="Total Income"
          amount={totalIncome}
          icon={TrendingUp}
          type="income"
          subtext="Total earnings"
        />
        <SummaryCard
          title="Total Expenses"
          amount={totalExpenses}
          icon={TrendingDown}
          type="expense"
          subtext="Total spending"
        />
        <SummaryCard
          title="Remaining Budget"
          amount={remainingBudget}
          icon={PiggyBank}
          type={remainingBudget < 0 ? 'negative' : 'remaining'}
          subtext={`Savings: ${formatCurrency(savings)}`}
        />
      </div>

      {/* Budget Progress Bar */}
      <BudgetProgress
        budget={budgetAmount}
        totalExpenses={totalExpenses}
        onOpenBudgetModal={onOpenBudgetModal}
      />

      {/* Charts Grid */}
      <div className="charts-grid">
        <ExpenseCategoryChart transactions={transactions} />
        <IncomeVsExpenseChart totalIncome={totalIncome} totalExpenses={totalExpenses} />
      </div>

      {/* Recent Transactions List */}
      <div className="section-card">
        <div className="section-header">
          <h2 className="section-title">Recent Transactions</h2>
          <Link to="/transactions" className="btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
            View All Transactions <ArrowRight size={14} />
          </Link>
        </div>

        {recentTransactions.length === 0 ? (
          <EmptyState onAddClick={onOpenAddModal} />
        ) : (
          <div className="table-wrapper">
            <table className="transaction-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Type</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((tx) => (
                  <tr key={tx._id}>
                    <td style={{ fontWeight: 600 }}>{tx.title}</td>
                    <td>
                      <span className="category-tag">{tx.category}</span>
                    </td>
                    <td>
                      <span className={`amount-display ${tx.type === 'Income' ? 'income' : 'expense'}`}>
                        {tx.type === 'Income' ? '+ ' : '- '}
                        {formatCurrency(tx.amount)}
                      </span>
                    </td>
                    <td>{formatDate(tx.date)}</td>
                    <td>
                      <span className={`type-badge ${tx.type === 'Income' ? 'income' : 'expense'}`}>
                        {tx.type}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
