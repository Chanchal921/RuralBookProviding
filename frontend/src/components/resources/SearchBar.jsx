import React, { useState } from 'react';

const SearchBar = ({ onSearch, placeholder = 'Search resources by title, topic, or keyword...' }) => {
  const [keyword, setKeyword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(keyword.trim());
  };

  const handleClear = () => {
    setKeyword('');
    onSearch('');
  };

  return (
    <form onSubmit={handleSubmit} className="mb-3">
      <div className="input-group shadow-sm">
        <span className="input-group-text bg-white border-end-0 text-muted">
          <i className="bi bi-search"></i>
        </span>
        <input
          type="text"
          className="form-control border-start-0 border-end-0 ps-0"
          placeholder={placeholder}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        {keyword && (
          <button type="button" className="btn btn-white border-top border-bottom border-0 text-muted" onClick={handleClear}>
            <i className="bi bi-x-lg"></i>
          </button>
        )}
        <button className="btn btn-primary-edu px-4" type="submit">
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchBar;

