import React from 'react';
import { PlusCircle, Inbox } from 'lucide-react';

const EmptyState = ({ message, onAddClick }) => {
  return (
    <div className="empty-state">
      <div className="empty-icon" style={{ display: 'flex', justifyContent: 'center' }}>
        <Inbox size={48} />
      </div>
      <h3 className="empty-title">No transactions yet</h3>
      <p className="empty-desc">
        {message || 'Start tracking your expenses by adding your first transaction.'}
      </p>
      {onAddClick && (
        <button className="btn-primary" onClick={onAddClick}>
          <PlusCircle size={18} />
          <span>+ Add Transaction</span>
        </button>
      )}
    </div>
  );
};

export default EmptyState;
