import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(0, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages - 1, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(0, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <nav aria-label="Page navigation" className="d-flex justify-content-center my-4">
      <ul className="pagination pagination-sm">
        <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 0}>
            &laquo; Prev
          </button>
        </li>

        {getPages().map((pageNum) => (
          <li key={pageNum} className={`page-item ${currentPage === pageNum ? 'active' : ''}`}>
            <button
              className={`page-link ${currentPage === pageNum ? 'bg-success border-success text-white' : 'text-success'}`}
              onClick={() => onPageChange(pageNum)}
            >
              {pageNum + 1}
            </button>
          </li>
        ))}

        <li className={`page-item ${currentPage >= totalPages - 1 ? 'disabled' : ''}`}>
          <button
            className="page-link"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages - 1}
          >
            Next &raquo;
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;

