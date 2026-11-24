import React from 'react';

const LoadingSpinner = ({ text = 'Loading data...', fullPage = false }) => {
  if (fullPage) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center py-5" style={{ minHeight: '60vh' }}>
        <div className="spinner-border text-success" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted fw-semibold">{text}</p>
      </div>
    );
  }

  return (
    <div className="d-flex align-items-center justify-content-center py-4 gap-2">
      <div className="spinner-border spinner-border-sm text-success" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <span className="text-muted small">{text}</span>
    </div>
  );
};

export default LoadingSpinner;

