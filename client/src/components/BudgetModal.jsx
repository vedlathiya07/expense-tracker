import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const BudgetModal = ({ isOpen, onClose, onSave, currentBudget = 30000, isSubmitting = false }) => {
  const [amount, setAmount] = useState(currentBudget);
  const [error, setError] = useState('');

  useEffect(() => {
    setAmount(currentBudget);
    setError('');
  }, [currentBudget, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const num = Number(amount);
    if (isNaN(num) || num < 0) {
      setError('Please enter a valid budget amount (0 or greater).');
      return;
    }

    onSave(num);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Set Monthly Budget</h2>
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
          <div className="form-group">
            <label className="form-label" htmlFor="budget-amount">Amount (₹)</label>
            <input
              id="budget-amount"
              type="number"
              min="0"
              className="form-control"
              placeholder="e.g. 30000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Budget'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BudgetModal;
