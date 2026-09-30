import React from 'react';
import { formatCurrency } from '../utils/formatters';

const SummaryCard = ({ title, amount, icon: Icon, type, subtext }) => {
  return (
    <div className="summary-card">
      <div className="card-info">
        <div className="card-title">{title}</div>
        <div className="card-amount">{formatCurrency(amount)}</div>
        {subtext && <div className="card-subtext">{subtext}</div>}
      </div>
      {Icon && (
        <div className={`card-icon ${type || ''}`}>
          <Icon size={22} />
        </div>
      )}
    </div>
  );
};

export default SummaryCard;
