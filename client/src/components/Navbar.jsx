import React from 'react';
import { NavLink } from 'react-router-dom';
import { Wallet, PlusCircle, LayoutDashboard, ReceiptText } from 'lucide-react';

const Navbar = ({ onOpenAddModal }) => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <NavLink to="/" className="brand">
          <div className="brand-icon">
            <Wallet size={20} />
          </div>
          <span>Expense Tracker</span>
        </NavLink>

        <div className="nav-links">
          <NavLink
            to="/"
            end
            className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
              <LayoutDashboard size={16} /> Dashboard
            </span>
          </NavLink>
          <NavLink
            to="/transactions"
            className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
              <ReceiptText size={16} /> Transactions
            </span>
          </NavLink>

          <button className="btn-primary" onClick={onOpenAddModal}>
            <PlusCircle size={18} />
            <span>+ Add Transaction</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
