import React from 'react';

const StatusBadge = ({ status }) => {
  if (!status) return null;

  const normalized = status.toUpperCase();

  let badgeClass = 'bg-secondary';
  let icon = '';

  switch (normalized) {
    case 'APPROVED':
      badgeClass = 'badge-approved';
      icon = 'bi-check-circle-fill';
      break;
    case 'PENDING':
      badgeClass = 'badge-pending';
      icon = 'bi-clock-fill';
      break;
    case 'REJECTED':
      badgeClass = 'badge-rejected';
      icon = 'bi-x-circle-fill';
      break;
    case 'MATCHED':
      badgeClass = 'badge-matched';
      icon = 'bi-stars';
      break;
    case 'COMPLETED':
      badgeClass = 'badge-completed';
      icon = 'bi-patch-check-fill';
      break;
    case 'DEACTIVATED':
      badgeClass = 'badge-deactivated';
      icon = 'bi-slash-circle';
      break;
    case 'ACTIVE':
    case 'TRUE':
      badgeClass = 'badge-approved';
      icon = 'bi-person-check-fill';
      break;
    case 'INACTIVE':
    case 'FALSE':
      badgeClass = 'badge-rejected';
      icon = 'bi-person-x-fill';
      break;
    default:
      badgeClass = 'bg-light text-dark border';
  }

  return (
    <span className={`badge ${badgeClass} d-inline-flex align-items-center gap-1 px-2 py-1`}>
      {icon && <i className={`bi ${icon}`} style={{ fontSize: '11px' }}></i>}
      <span>{normalized}</span>
    </span>
  );
};

export default StatusBadge;

