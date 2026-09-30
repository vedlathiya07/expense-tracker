import React from 'react';
import { formatCurrency } from '../utils/formatters';
import { Edit3, AlertTriangle } from 'lucide-react';

const BudgetProgress = ({ budget, totalExpenses, onOpenBudgetModal }) => {
  const safeBudget = Number(budget) || 0;
  const safeExpenses = Number(totalExpenses) || 0;

  const rawPercentage = safeBudget > 0 ? (safeExpenses / safeBudget) * 100 : 0;
  const percentage = Math.round(rawPercentage * 10) / 10;
  const visualPercentage = Math.min(percentage, 100);

  const isExceeded = safeExpenses > safeBudget && safeBudget > 0;
  const isWarning = percentage >= 80 && !isExceeded;

  let progressClass = '';
  if (isExceeded) progressClass = 'exceeded';
  else if (isWarning) progressClass = 'warning';

  return (
    <div className="budget-bar-section">
      <div className="budget-header">
        <div className="budget-title-area">
          <span className="budget-title">Budget Used</span>
          {isExceeded && (
            <span className="badge-exceeded" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
              <AlertTriangle size={13} /> Budget Exceeded
            </span>
          )}
        </div>
        <button
          className="btn-secondary btn-sm"
          onClick={onOpenBudgetModal}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
        >
          <Edit3 size={14} /> Edit Budget
        </button>
      </div>

      <div className="progress-track">
        <div
          className={`progress-fill ${progressClass}`}
          style={{ width: `${visualPercentage}%` }}
        ></div>
      </div>

      <div className="budget-stats">
        <span>
          {formatCurrency(safeExpenses)} / {formatCurrency(safeBudget)}
        </span>
        <span style={{ fontWeight: 600 }}>{percentage}%</span>
      </div>
    </div>
  );
};

export default BudgetProgress;
