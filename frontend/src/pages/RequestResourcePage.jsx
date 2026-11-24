import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { requestApi } from '../api/requestApi';
import { resourceApi } from '../api/resourceApi';
import Sidebar from '../components/common/Sidebar';
import LoadingSpinner from '../components/common/LoadingSpinner';

const RequestResourcePage = () => {
  const [resourceName, setResourceName] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [classLevelId, setClassLevelId] = useState('');
  const [resourceTypeId, setResourceTypeId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [reason, setReason] = useState('');

  const [metadata, setMetadata] = useState(null);
  const [loadingMetadata, setLoadingMetadata] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const res = await resourceApi.getMetadata();
        if (res.success && res.data) {
          setMetadata(res.data);
          if (res.data.subjects?.length) setSubjectId(res.data.subjects[0].id);
          if (res.data.classLevels?.length) setClassLevelId(res.data.classLevels[0].id);
          if (res.data.resourceTypes?.length) setResourceTypeId(res.data.resourceTypes[0].id);
        }
      } catch (err) {
        setError('Failed to load master metadata for subjects and class levels.');
      } finally {
        setLoadingMetadata(false);
      }
    };
    fetchMetadata();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!resourceName.trim()) {
      setError('Resource name is required.');
      return;
    }

    if (!reason.trim()) {
      setError('Please provide a reason or context for this request.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        resourceName: resourceName.trim(),
        subjectId: Number(subjectId),
        classLevelId: Number(classLevelId),
        resourceTypeId: Number(resourceTypeId),
        quantity: Number(quantity),
        reason: reason.trim(),
      };

      const res = await requestApi.createRequest(payload);
      if (res.success) {
        setSuccess(res.message || 'Request submitted successfully! Our matching engine is reviewing available library items.');
        setTimeout(() => {
          navigate('/my-requests');
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to submit resource request.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingMetadata) {
    return <LoadingSpinner text="Loading form catalogs..." fullPage />;
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-3 col-lg-2 p-0">
          <Sidebar />
        </div>

        <main className="col-md-9 col-lg-10 p-4">
          <div className="mb-4 pb-2 border-bottom">
            <h3 className="fw-bold text-dark mb-1">Request Educational Material</h3>
            <p className="text-muted small mb-0">
              Can't find a textbook, notes, or paper? Submit a request and our system will match available resources
            </p>
          </div>

          <div className="row">
            <div className="col-lg-8">
              <div className="bg-white p-4 rounded-3 border shadow-sm">
                {error && (
                  <div className="alert alert-danger py-2 small d-flex align-items-center gap-2 mb-3">
                    <i className="bi bi-exclamation-circle-fill"></i>
                    <div>{error}</div>
                  </div>
                )}

                {success && (
                  <div className="alert alert-success py-2 small d-flex align-items-center gap-2 mb-3">
                    <i className="bi bi-check-circle-fill"></i>
                    <div>{success}</div>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label text-dark small fw-semibold">Resource / Book Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Class 10 Mathematics Revision Notes"
                      value={resourceName}
                      onChange={(e) => setResourceName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="row g-2 mb-3">
                    <div className="col-md-4 col-sm-12">
                      <label className="form-label text-dark small fw-semibold">Subject *</label>
                      <select
                        className="form-select"
                        value={subjectId}
                        onChange={(e) => setSubjectId(e.target.value)}
                        required
                      >
                        {metadata?.subjects?.map((s) => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-4 col-sm-12">
                      <label className="form-label text-dark small fw-semibold">Target Class Level *</label>
                      <select
                        className="form-select"
                        value={classLevelId}
                        onChange={(e) => setClassLevelId(e.target.value)}
                        required
                      >
                        {metadata?.classLevels?.map((c) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-4 col-sm-12">
                      <label className="form-label text-dark small fw-semibold">Resource Type *</label>
                      <select
                        className="form-select"
                        value={resourceTypeId}
                        onChange={(e) => setResourceTypeId(e.target.value)}
                        required
                      >
                        {metadata?.resourceTypes?.map((t) => (
                          <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-dark small fw-semibold">Quantity Required</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      className="form-control"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      required
                    />
                    <small className="text-muted">Enter number of copies or students needing this material</small>
                  </div>

                  <div className="mb-4">
                    <label className="form-label text-dark small fw-semibold">Reason for Request *</label>
                    <textarea
                      className="form-control"
                      rows="4"
                      placeholder="Explain your academic need (e.g., preparing for board examinations, shortage in school library, science practical worksheets needed)..."
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      required
                    ></textarea>
                  </div>

                  <div className="d-flex gap-2 justify-content-end">
                    <button
                      type="button"
                      className="btn btn-light"
                      onClick={() => navigate('/my-requests')}
                      disabled={submitting}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary-edu px-4 fw-bold"
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Matching & Submitting...
                        </>
                      ) : (
                        'Submit Resource Request'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="bg-white p-3 rounded-3 border shadow-sm">
                <h6 className="fw-bold text-success mb-2 d-flex align-items-center gap-1">
                  <i className="bi bi-stars"></i> Automated Matching
                </h6>
                <p className="text-muted small mb-2">
                  When you submit a request, RuralEdu immediately compares your subject, class level, and keywords against thousands of verified library assets.
                </p>
                <div className="p-2 bg-light rounded text-muted small mb-2">
                  <i className="bi bi-info-circle text-primary me-1"></i>
                  If an approved match is found, your request status automatically shifts to <strong>MATCHED</strong> and you can view the resource instantly!
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RequestResourcePage;

