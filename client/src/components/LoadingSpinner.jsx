import React from 'react';

const LoadingSpinner = ({ message = 'Loading transactions...' }) => {
  return (
    <div className="loading-spinner-container">
      <div className="spinner"></div>
      <p style={{ fontSize: '0.9rem', color: '#64748b' }}>{message}</p>
    </div>
  );
};

export default LoadingSpinner;
