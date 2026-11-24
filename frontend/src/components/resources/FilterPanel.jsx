import React from 'react';

const FilterPanel = ({
  metadata,
  selectedSubject,
  selectedClass,
  selectedType,
  onSubjectChange,
  onClassChange,
  onTypeChange,
  onReset,
}) => {
  const subjects = metadata?.subjects || [];
  const classLevels = metadata?.classLevels || [];
  const resourceTypes = metadata?.resourceTypes || [];

  const hasActiveFilters = !!selectedSubject || !!selectedClass || !!selectedType;

  return (
    <div className="bg-white p-3 rounded-3 border mb-4 shadow-sm">
      <div className="d-flex align-items-center justify-content-between mb-2">
        <span className="fw-bold text-dark small d-flex align-items-center gap-1">
          <i className="bi bi-funnel text-success"></i> Filter Resources
        </span>
        {hasActiveFilters && (
          <button onClick={onReset} className="btn btn-link btn-sm text-danger p-0 text-decoration-none small">
            <i className="bi bi-x-circle me-1"></i> Clear Filters
          </button>
        )}
      </div>

      <div className="row g-2">
        <div className="col-md-4 col-sm-12">
          <label className="form-label text-muted small mb-1">Subject</label>
          <select
            className="form-select form-select-sm"
            value={selectedSubject || ''}
            onChange={(e) => onSubjectChange(e.target.value ? Number(e.target.value) : null)}
          >
            <option value="">All Subjects</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-4 col-sm-12">
          <label className="form-label text-muted small mb-1">Class Level</label>
          <select
            className="form-select form-select-sm"
            value={selectedClass || ''}
            onChange={(e) => onClassChange(e.target.value ? Number(e.target.value) : null)}
          >
            <option value="">All Classes</option>
            {classLevels.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-4 col-sm-12">
          <label className="form-label text-muted small mb-1">Resource Type</label>
          <select
            className="form-select form-select-sm"
            value={selectedType || ''}
            onChange={(e) => onTypeChange(e.target.value ? Number(e.target.value) : null)}
          >
            <option value="">All Types</option>
            {resourceTypes.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;

