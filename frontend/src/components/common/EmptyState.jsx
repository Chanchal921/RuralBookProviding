import React from 'react';

const EmptyState = ({
  icon = 'bi-inbox',
  title = 'No resources found',
  message = 'Try modifying your search keywords or clearing applied filters.',
  actionText,
  onAction,
}) => {
  return (
    <div className="text-center py-5 px-3 bg-white border rounded-3 my-3">
      <div
        className="d-inline-flex align-items-center justify-content-center bg-light rounded-circle text-muted mb-3"
        style={{ width: '64px', height: '64px', fontSize: '2rem' }}
      >
        <i className={`bi ${icon}`}></i>
      </div>
      <h5 className="fw-bold text-dark mb-1">{title}</h5>
      <p className="text-muted small mb-3 mx-auto" style={{ maxWidth: '420px' }}>
        {message}
      </p>
      {actionText && onAction && (
        <button onClick={onAction} className="btn btn-outline-edu btn-sm">
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;

