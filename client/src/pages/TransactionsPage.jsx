import React, { useState, useEffect, useCallback } from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import TransactionFilter from '../components/TransactionFilter';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import ConfirmDialog from '../components/ConfirmDialog';
import { getTransactions, deleteTransaction } from '../services/api';
import { formatCurrency, formatDate } from '../utils/formatters';

const TransactionsPage = ({
  onOpenAddModal,
  onOpenEditModal,
  showToast,
  refreshTrigger
}) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters state
  const [filters, setFilters] = useState({
    search: '',
    type: 'All',
    category: 'All',
    startDate: '',
    endDate: ''
  });

  // Delete modal state
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getTransactions(filters);
      if (res.success) {
        setTransactions(res.data);
      }
    } catch (err) {
      console.error('Failed to load transactions:', err);
      setError('Unable to load transactions. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions, refreshTrigger]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      type: 'All',
      category: 'All',
      startDate: '',
      endDate: ''
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;

    try {
      setIsDeleting(true);
      const res = await deleteTransaction(deleteTargetId);
      if (res.success) {
        showToast('Transaction deleted successfully.', 'success');
        setDeleteTargetId(null);
        fetchTransactions();
      }
    } catch (err) {
      console.error('Delete transaction failed:', err);
      showToast('Failed to delete transaction. Please try again.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="transactions-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Transactions</h1>
          <p className="page-subtitle">View, filter, edit and manage all your income & expenses</p>
        </div>
        <button className="btn-primary" onClick={onOpenAddModal}>
          + Add Transaction
        </button>
      </div>

      {/* Filter Toolbar */}
      <TransactionFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {/* Transactions List / Table */}
      <div className="section-card">
        {loading ? (
          <LoadingSpinner message="Loading transactions..." />
        ) : error ? (
          <div style={{ textAlign: 'center', color: '#ef4444', padding: '2rem' }}>
            <p>{error}</p>
            <button className="btn-secondary" style={{ marginTop: '1rem' }} onClick={fetchTransactions}>
              Retry
            </button>
          </div>
        ) : transactions.length === 0 ? (
          <EmptyState
            message={
              filters.search || filters.type !== 'All' || filters.category !== 'All'
                ? 'No transactions match your filter criteria.'
                : 'Start tracking your expenses by adding your first transaction.'
            }
            onAddClick={onOpenAddModal}
          />
        ) : (
          <div className="table-wrapper">
            <table className="transaction-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Amount</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th>Date</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx._id}>
                    <td style={{ fontWeight: 600 }}>{tx.title}</td>
                    <td>
                      <span className={`amount-display ${tx.type === 'Income' ? 'income' : 'expense'}`}>
                        {tx.type === 'Income' ? '+ ' : '- '}
                        {formatCurrency(tx.amount)}
                      </span>
                    </td>
                    <td>
                      <span className="category-tag">{tx.category}</span>
                    </td>
                    <td>
                      <span className={`type-badge ${tx.type === 'Income' ? 'income' : 'expense'}`}>
                        {tx.type}
                      </span>
                    </td>
                    <td>{formatDate(tx.date)}</td>
                    <td>
                      <div className="action-buttons" style={{ justifyContent: 'flex-end' }}>
                        <button
                          className="btn-icon edit"
                          onClick={() => onOpenEditModal(tx)}
                          title="Edit Transaction"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          className="btn-icon delete"
                          onClick={() => setDeleteTargetId(tx._id)}
                          title="Delete Transaction"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={Boolean(deleteTargetId)}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default TransactionsPage;
