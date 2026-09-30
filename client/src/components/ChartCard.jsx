import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import { formatCurrency } from '../utils/formatters';

const CATEGORY_COLORS = {
  Food: '#f59e0b',
  Transport: '#3b82f6',
  Shopping: '#ec4899',
  Bills: '#8b5cf6',
  Entertainment: '#06b6d4',
  Health: '#10b981',
  Education: '#6366f1',
  Other: '#64748b'
};

const DEFAULT_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4', '#6366f1', '#64748b'];

export const ExpenseCategoryChart = ({ transactions }) => {
  // Aggregate expenses by category
  const expensesByCategory = (transactions || [])
    .filter((t) => t.type === 'Expense')
    .reduce((acc, curr) => {
      const cat = curr.category || 'Other';
      acc[cat] = (acc[cat] || 0) + Number(curr.amount);
      return acc;
    }, {});

  const data = Object.keys(expensesByCategory).map((cat) => ({
    name: cat,
    value: expensesByCategory[cat]
  }));

  const hasExpenses = data.length > 0;

  return (
    <div className="chart-card">
      <h3 className="chart-header">Expenses by Category</h3>
      <div className="chart-container">
        {hasExpenses ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={CATEGORY_COLORS[entry.name] || DEFAULT_COLORS[index % DEFAULT_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [formatCurrency(value), 'Amount']}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
              />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="empty-state" style={{ padding: '2rem' }}>
            <p className="empty-desc">No expense records found for chart visualization.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export const IncomeVsExpenseChart = ({ totalIncome, totalExpenses }) => {
  const data = [
    {
      name: 'Income',
      amount: Number(totalIncome) || 0,
      fill: '#10b981'
    },
    {
      name: 'Expense',
      amount: Number(totalExpenses) || 0,
      fill: '#ef4444'
    }
  ];

  return (
    <div className="chart-card">
      <h3 className="chart-header">Income vs Expense</h3>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="name" tickLine={false} />
            <YAxis tickFormatter={(val) => `₹${val}`} axisLine={false} tickLine={false} />
            <Tooltip
              formatter={(value) => [formatCurrency(value), 'Amount']}
              contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
            />
            <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`bar-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
