import React from 'react';
import { Search, RotateCcw } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Food',
  'Transport',
  'Shopping',
  'Bills',
  'Entertainment',
  'Health',
  'Education',
  'Other'
];

const TransactionFilter = ({ filters, onFilterChange, onReset }) => {
  return (
    <div className="filter-toolbar">
      {/* Search Input */}
      <div className="filter-group" style={{ flex: 2 }}>
        <label className="filter-label">Search Title</label>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            className="filter-input"
            style={{ width: '100%', paddingLeft: '2.2rem' }}
            placeholder="Search by transaction title..."
            value={filters.search || ''}
            onChange={(e) => onFilterChange('search', e.target.value)}
          />
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '0.7rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#94a3b8'
            }}
          />
        </div>
      </div>

      {/* Type Filter */}
      <div className="filter-group">
        <label className="filter-label">Type</label>
        <select
          className="filter-select"
          value={filters.type || 'All'}
          onChange={(e) => onFilterChange('type', e.target.value)}
        >
          <option value="All">All Types</option>
          <option value="Income">Income</option>
          <option value="Expense">Expense</option>
        </select>
      </div>

      {/* Category Filter */}
      <div className="filter-group">
        <label className="filter-label">Category</label>
        <select
          className="filter-select"
          value={filters.category || 'All'}
          onChange={(e) => onFilterChange('category', e.target.value)}
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat === 'All' ? 'All Categories' : cat}
            </option>
          ))}
        </select>
      </div>

      {/* From Date */}
      <div className="filter-group">
        <label className="filter-label">From Date</label>
        <input
          type="date"
          className="filter-input"
          value={filters.startDate || ''}
          onChange={(e) => onFilterChange('startDate', e.target.value)}
        />
      </div>

      {/* To Date */}
      <div className="filter-group">
        <label className="filter-label">To Date</label>
        <input
          type="date"
          className="filter-input"
          value={filters.endDate || ''}
          onChange={(e) => onFilterChange('endDate', e.target.value)}
        />
      </div>

      {/* Reset Button */}
      <div className="filter-group" style={{ flex: '0 0 auto', justifyContent: 'flex-end' }}>
        <button
          type="button"
          className="btn-secondary btn-sm"
          onClick={onReset}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', height: '38px', marginTop: 'auto' }}
          title="Reset filters"
        >
          <RotateCcw size={14} /> Reset
        </button>
      </div>
    </div>
  );
};

export default TransactionFilter;
