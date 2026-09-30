import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { formatDateForInput } from '../utils/formatters';

const CATEGORIES = [
  'Food',
  'Transport',
  'Shopping',
  'Bills',
  'Entertainment',
  'Health',
  'Education',
  'Other'
];

const TransactionFormModal = ({ isOpen, onClose, onSubmit, initialData = null, isSubmitting = false }) => {
  const isEdit = Boolean(initialData && initialData._id);

  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'Food',
    date: formatDateForInput(new Date()),
    type: 'Expense'
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        amount: initialData.amount || '',
        category: initialData.category || 'Food',
        date: formatDateForInput(initialData.date || new Date()),
        type: initialData.type || 'Expense'
      });
    } else {
      setFormData({
        title: '',
        amount: '',
        category: 'Food',
        date: formatDateForInput(new Date()),
        type: 'Expense'
      });
    }
    setError('');
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      // If user switches type to Income, set default category to 'Income' or keep custom
      if (name === 'type' && value === 'Income') {
        updated.category = 'Income';
      } else if (name === 'type' && value === 'Expense' && prev.category === 'Income') {
        updated.category = 'Food';
      }
      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim() || formData.title.trim().length < 2) {
      setError('Title must be at least 2 characters long.');
      return;
    }

    const numAmount = Number(formData.amount);
    if (!formData.amount || isNaN(numAmount) || numAmount <= 0) {
      setError('Amount must be a valid number greater than 0.');
      return;
    }

    if (!formData.date) {
      setError('Please select a valid date.');
      return;
    }

    onSubmit({
      ...formData,
      amount: numAmount
    });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">{isEdit ? 'Edit Transaction' : 'Add Transaction'}</h2>
          <button className="close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#fef2f2',
            color: '#ef4444',
            padding: '0.6rem 0.8rem',
            borderRadius: '6px',
            fontSize: '0.85rem',
            marginBottom: '1rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Type Selector */}
          <div className="form-group">
            <label className="form-label">Type</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="type"
                  value="Expense"
                  checked={formData.type === 'Expense'}
                  onChange={handleChange}
                />
                Expense
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="type"
                  value="Income"
                  checked={formData.type === 'Income'}
                  onChange={handleChange}
                />
                Income
              </label>
            </div>
          </div>

          {/* Title */}
          <div className="form-group">
            <label className="form-label" htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              name="title"
              className="form-control"
              placeholder="e.g. Lunch, Bus Pass, Salary"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          {/* Amount */}
          <div className="form-group">
            <label className="form-label" htmlFor="amount">Amount (₹)</label>
            <input
              id="amount"
              type="number"
              step="0.01"
              name="amount"
              className="form-control"
              placeholder="e.g. 250"
              value={formData.amount}
              onChange={handleChange}
              required
            />
          </div>

          {/* Category */}
          <div className="form-group">
            <label className="form-label" htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              className="form-control"
              value={formData.category}
              onChange={handleChange}
              required
            >
              {formData.type === 'Income' ? (
                <option value="Income">Income</option>
              ) : (
                CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Date */}
          <div className="form-group">
            <label className="form-label" htmlFor="date">Date</label>
            <input
              id="date"
              type="date"
              name="date"
              className="form-control"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          {/* Actions */}
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : isEdit ? 'Update Transaction' : 'Save Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionFormModal;
