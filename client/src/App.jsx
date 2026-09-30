import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import TransactionsPage from './pages/TransactionsPage';
import TransactionFormModal from './components/TransactionFormModal';
import BudgetModal from './components/BudgetModal';
import Toast from './components/Toast';
import { createTransaction, updateTransaction, getBudget, updateBudget } from './services/api';

function App() {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [currentBudget, setCurrentBudget] = useState(30000);
  const [isSubmittingBudget, setIsSubmittingBudget] = useState(false);

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [toast, setToast] = useState({ message: '', type: 'success' });

  // Fetch initial budget
  useEffect(() => {
    const fetchCurrentBudget = async () => {
      try {
        const res = await getBudget();
        if (res.success && res.data) {
          setCurrentBudget(res.data.amount);
        }
      } catch (err) {
        console.error('Error fetching budget in App:', err);
      }
    };
    fetchCurrentBudget();
  }, [refreshTrigger]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleCloseToast = () => {
    setToast({ message: '', type: 'success' });
  };

  // Trigger UI refresh across pages
  const triggerRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  // Open Add Modal
  const handleOpenAddModal = () => {
    setEditingTransaction(null);
    setIsFormModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (transaction) => {
    setEditingTransaction(transaction);
    setIsFormModalOpen(true);
  };

  // Handle Form Submit (Add / Edit)
  const handleFormSubmit = async (formData) => {
    try {
      setIsSubmittingForm(true);
      if (editingTransaction && editingTransaction._id) {
        const res = await updateTransaction(editingTransaction._id, formData);
        if (res.success) {
          showToast('Transaction updated successfully.', 'success');
          setIsFormModalOpen(false);
          setEditingTransaction(null);
          triggerRefresh();
        }
      } else {
        const res = await createTransaction(formData);
        if (res.success) {
          showToast('Transaction added successfully.', 'success');
          setIsFormModalOpen(false);
          triggerRefresh();
        }
      }
    } catch (err) {
      console.error('Form submission failed:', err);
      showToast(
        err.response?.data?.message || 'Failed to save transaction. Please check your inputs.',
        'error'
      );
    } finally {
      setIsSubmittingForm(false);
    }
  };

  // Handle Budget Save
  const handleSaveBudget = async (amount) => {
    try {
      setIsSubmittingBudget(true);
      const res = await updateBudget(amount);
      if (res.success) {
        setCurrentBudget(res.data.amount);
        showToast('Monthly budget updated successfully.', 'success');
        setIsBudgetModalOpen(false);
        triggerRefresh();
      }
    } catch (err) {
      console.error('Budget update failed:', err);
      showToast('Failed to update monthly budget.', 'error');
    } finally {
      setIsSubmittingBudget(false);
    }
  };

  return (
    <div className="app-container">
      <Navbar onOpenAddModal={handleOpenAddModal} />

      <main className="main-content">
        <Routes>
          <Route
            path="/"
            element={
              <Dashboard
                onOpenAddModal={handleOpenAddModal}
                onOpenEditModal={handleOpenEditModal}
                onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
                showToast={showToast}
                refreshTrigger={refreshTrigger}
              />
            }
          />
          <Route
            path="/transactions"
            element={
              <TransactionsPage
                onOpenAddModal={handleOpenAddModal}
                onOpenEditModal={handleOpenEditModal}
                showToast={showToast}
                refreshTrigger={refreshTrigger}
              />
            }
          />
        </Routes>
      </main>

      {/* Transaction Add/Edit Modal */}
      <TransactionFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingTransaction(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={editingTransaction}
        isSubmitting={isSubmittingForm}
      />

      {/* Budget Edit Modal */}
      <BudgetModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        onSave={handleSaveBudget}
        currentBudget={currentBudget}
        isSubmitting={isSubmittingBudget}
      />

      {/* Global Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={handleCloseToast}
      />
    </div>
  );
}

export default App;
