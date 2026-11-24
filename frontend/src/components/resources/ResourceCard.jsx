import React from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from '../common/StatusBadge';

const ResourceCard = ({ resource }) => {
  const isExternal = !!resource.externalUrl;
  const isFile = !!resource.filePath;

  return (
    <div className="card edu-card h-100 border-0 shadow-sm">
      <div className="card-body d-flex flex-column p-3">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <span className="badge bg-success-subtle text-success border border-success-subtle" style={{ fontSize: '11px' }}>
            {resource.subjectName || 'Subject'}
          </span>
          <span className="badge bg-light text-muted border" style={{ fontSize: '11px' }}>
            {resource.classLevelName || 'Class'}
          </span>
        </div>

        <h6 className="card-title fw-bold text-dark mb-1 text-truncate" title={resource.title}>
          <Link to={`/resources/${resource.id}`} className="text-decoration-none text-dark hover-success">
            {resource.title}
          </Link>
        </h6>

        <p className="card-text text-muted small mb-3 flex-grow-1" style={{ fontSize: '12px', minHeight: '36px' }}>
          {resource.description
            ? resource.description.length > 90
              ? resource.description.substring(0, 90) + '...'
              : resource.description
            : 'No description provided.'}
        </p>

        <div className="d-flex align-items-center justify-content-between pt-2 border-top mt-auto small">
          <div className="d-flex align-items-center gap-1 text-muted" style={{ fontSize: '11px' }}>
            <i className={isExternal ? 'bi bi-link-45deg text-primary' : 'bi bi-file-earmark-pdf text-danger'}></i>
            <span className="text-truncate" style={{ maxWidth: '120px' }}>
              {resource.resourceTypeName || (isExternal ? 'Link' : 'File')}
            </span>
          </div>

          <div className="d-flex align-items-center gap-1">
            <Link to={`/resources/${resource.id}`} className="btn btn-outline-success btn-sm py-0 px-2" style={{ fontSize: '12px' }}>
              View
            </Link>
            {isFile && (
              <a
                href={`/api/resources/${resource.id}/download`}
                className="btn btn-success btn-sm py-0 px-2"
                style={{ fontSize: '12px' }}
                title="Download"
              >
                <i className="bi bi-download"></i>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;

