import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { resourceApi } from '../api/resourceApi';
import Sidebar from '../components/common/Sidebar';
import LoadingSpinner from '../components/common/LoadingSpinner';

const UploadResourcePage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [classLevelId, setClassLevelId] = useState('');
  const [resourceTypeId, setResourceTypeId] = useState('');
  const [uploadMode, setUploadMode] = useState('file'); // 'file' or 'link'
  const [file, setFile] = useState(null);
  const [externalUrl, setExternalUrl] = useState('');

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

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 25 * 1024 * 1024) {
        setError('Selected file exceeds maximum allowed limit of 25MB.');
        setFile(null);
        e.target.value = null;
        return;
      }
      setFile(selectedFile);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!title.trim()) {
      setError('Resource title is required.');
      return;
    }

    if (uploadMode === 'file' && !file) {
      setError('Please select an educational file to upload.');
      return;
    }

    if (uploadMode === 'link' && !externalUrl.trim()) {
      setError('Please provide a valid educational URL link.');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      formData.append('subjectId', subjectId);
      formData.append('classLevelId', classLevelId);
      formData.append('resourceTypeId', resourceTypeId);

      if (uploadMode === 'file' && file) {
        formData.append('file', file);
      } else if (uploadMode === 'link' && externalUrl.trim()) {
        formData.append('externalUrl', externalUrl.trim());
      }

      const res = await resourceApi.uploadResource(formData);
      if (res.success) {
        setSuccess('Resource submitted successfully! It has been placed in PENDING status for admin verification.');
        setTimeout(() => {
          navigate('/my-uploads');
        }, 1800);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to upload resource.');
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
            <h3 className="fw-bold text-dark mb-1">Upload Educational Resource</h3>
            <p className="text-muted small mb-0">
              Share textbooks, revision notes, question banks, or verified learning links with rural learners
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
                    <label className="form-label text-dark small fw-semibold">Resource Title *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Class 10 NCERT Mathematics Solved Problems"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
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
                    <label className="form-label text-dark small fw-semibold">Description & Learning Topics</label>
                    <textarea
                      className="form-control"
                      rows="4"
                      placeholder="Provide chapter names, syllabus version, key formulas, or usage guidance..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                  </div>

                  {/* Mode Selector */}
                  <div className="mb-3 p-3 bg-light rounded-3">
                    <label className="form-label text-dark small fw-bold d-block mb-2">
                      Resource Content Format *
                    </label>
                    <div className="d-flex gap-3 mb-3">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="uploadMode"
                          id="modeFile"
                          checked={uploadMode === 'file'}
                          onChange={() => setUploadMode('file')}
                        />
                        <label className="form-check-label small fw-semibold" htmlFor="modeFile">
                          Upload Document File (PDF, DOCX, PPT, Images)
                        </label>
                      </div>

                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="uploadMode"
                          id="modeLink"
                          checked={uploadMode === 'link'}
                          onChange={() => setUploadMode('link')}
                        />
                        <label className="form-check-label small fw-semibold" htmlFor="modeLink">
                          Educational Web Link / Video URL
                        </label>
                      </div>
                    </div>

                    {uploadMode === 'file' ? (
                      <div>
                        <input
                          type="file"
                          className="form-control"
                          accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.epub,.png,.jpg,.jpeg"
                          onChange={handleFileChange}
                          required
                        />
                        <small className="text-muted d-block mt-1">
                          Max file size: 25MB. Supported: PDF, Word, PowerPoint, Text, ePub, Images.
                        </small>
                      </div>
                    ) : (
                      <div>
                        <input
                          type="url"
                          className="form-control"
                          placeholder="https://www.youtube.com/playlist?list=..."
                          value={externalUrl}
                          onChange={(e) => setExternalUrl(e.target.value)}
                          required
                        />
                        <small className="text-muted d-block mt-1">
                          Enter verified educational link, lecture video, or online open-source resource.
                        </small>
                      </div>
                    )}
                  </div>

                  <div className="d-flex gap-2 justify-content-end mt-4">
                    <button
                      type="button"
                      className="btn btn-light"
                      onClick={() => navigate('/my-uploads')}
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
                          Submitting for Verification...
                        </>
                      ) : (
                        'Upload & Submit for Review'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="bg-white p-3 rounded-3 border shadow-sm">
                <h6 className="fw-bold text-success mb-2 d-flex align-items-center gap-1">
                  <i className="bi bi-shield-check"></i> Quality Verification Flow
                </h6>
                <p className="text-muted small mb-2">
                  To protect rural schools from malicious, outdated, or commercial content:
                </p>
                <ol className="text-muted small ps-3 mb-0" style={{ lineHeight: '1.7' }}>
                  <li>All uploads receive an initial <strong>PENDING</strong> status.</li>
                  <li>RuralEdu administrators verify the file and curriculum adherence.</li>
                  <li>Upon approval, the resource appears live in the <strong>Digital Library</strong>.</li>
                  <li>You can track verification progress anytime under <strong>My Uploads</strong>.</li>
                </ol>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UploadResourcePage;

