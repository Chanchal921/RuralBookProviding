import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { resourceApi } from '../api/resourceApi';
import ResourceCard from '../components/resources/ResourceCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const HomePage = () => {
  const [recentResources, setRecentResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const res = await resourceApi.getApprovedResources({ page: 0, size: 6, sortBy: 'createdAt', direction: 'DESC' });
        if (res.success && res.data) {
          setRecentResources(res.data.content || []);
        }
      } catch (err) {
        console.error('Failed to load recent resources', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecent();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      navigate(`/library?keyword=${encodeURIComponent(searchKeyword.trim())}`);
    } else {
      navigate('/library');
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-banner py-5">
        <div className="container">
          <div className="row align-items-center gy-4">
            <div className="col-lg-7 text-center text-lg-start">
              <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-2 rounded-pill mb-3 fw-semibold">
                <i className="bi bi-shield-check me-1"></i> Verified Rural Education Platform
              </span>
              <h1 className="display-5 fw-extrabold text-dark mb-3">
                Empowering Rural Education Through Resource Sharing
              </h1>
              <p className="lead text-secondary mb-4" style={{ fontSize: '1.1rem' }}>
                RuralEdu connects donors, teachers, schools, NGOs, and students. Access verified textbooks, study notes, past papers, and learning materials across rural India.
              </p>

              {/* Quick Search in Hero */}
              <form onSubmit={handleSearchSubmit} className="mb-4" style={{ maxWidth: '580px' }}>
                <div className="input-group input-group-lg shadow-sm">
                  <span className="input-group-text bg-white border-end-0 text-muted">
                    <i className="bi bi-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control border-start-0 border-end-0 ps-0"
                    placeholder="Search books, notes, subjects (e.g. Mathematics, Science)..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                  />
                  <button className="btn btn-primary-edu px-4 fw-bold" type="submit">
                    Find Resources
                  </button>
                </div>
              </form>

              <div className="d-flex flex-wrap gap-3 justify-content-center justify-content-lg-start">
                <Link to="/library" className="btn btn-primary-edu px-4 py-2">
                  <i className="bi bi-book-half me-2"></i> Browse Digital Library
                </Link>
                <Link to="/register" className="btn btn-outline-edu px-4 py-2">
                  <i className="bi bi-person-plus me-2"></i> Join as Donor / School
                </Link>
              </div>
            </div>

            <div className="col-lg-5 text-center">
              <div className="bg-white p-4 rounded-4 shadow border position-relative mx-auto" style={{ maxWidth: '420px' }}>
                <div className="d-flex align-items-center gap-3 mb-3 p-3 bg-light rounded-3 text-start">
                  <div className="bg-success text-white p-3 rounded-circle">
                    <i className="bi bi-mortarboard-fill fs-4"></i>
                  </div>
                  <div>
                    <h6 className="mb-0 fw-bold">For Rural Students</h6>
                    <small className="text-muted">Free approved syllabus materials & request support</small>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-3 mb-3 p-3 bg-light rounded-3 text-start">
                  <div className="bg-primary text-white p-3 rounded-circle">
                    <i className="bi bi-heart-fill fs-4"></i>
                  </div>
                  <div>
                    <h6 className="mb-0 fw-bold">For Generous Donors</h6>
                    <small className="text-muted">Donate study materials & track verification</small>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-3 p-3 bg-light rounded-3 text-start">
                  <div className="bg-warning text-dark p-3 rounded-circle">
                    <i className="bi bi-building-fill fs-4"></i>
                  </div>
                  <div>
                    <h6 className="mb-0 fw-bold">For Teachers & NGOs</h6>
                    <small className="text-muted">Share curriculum guides & request classroom kits</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights & Role Pillars */}
      <section className="py-5 bg-white border-bottom">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold text-dark">How RuralEdu Works</h2>
            <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
              A closed-loop architectural model guaranteeing quality, security, and transparent distribution.
            </p>
          </div>

          <div className="row g-4 text-center">
            <div className="col-md-3 col-sm-6">
              <div className="p-3">
                <div className="stat-icon bg-success-subtle text-success mx-auto mb-3">
                  <i className="bi bi-cloud-arrow-up"></i>
                </div>
                <h6 className="fw-bold">1. Upload</h6>
                <p className="text-muted small">
                  Donors, teachers, and NGOs upload digital books, notes, and exam papers.
                </p>
              </div>
            </div>

            <div className="col-md-3 col-sm-6">
              <div className="p-3">
                <div className="stat-icon bg-warning-subtle text-warning mx-auto mb-3">
                  <i className="bi bi-shield-check"></i>
                </div>
                <h6 className="fw-bold">2. Verification</h6>
                <p className="text-muted small">
                  Administrators review curriculum accuracy before approving into library.
                </p>
              </div>
            </div>

            <div className="col-md-3 col-sm-6">
              <div className="p-3">
                <div className="stat-icon bg-primary-subtle text-primary mx-auto mb-3">
                  <i className="bi bi-book"></i>
                </div>
                <h6 className="fw-bold">3. Digital Library</h6>
                <p className="text-muted small">
                  Rural schools and students access and download verified resources anytime.
                </p>
              </div>
            </div>

            <div className="col-md-3 col-sm-6">
              <div className="p-3">
                <div className="stat-icon bg-info-subtle text-info mx-auto mb-3">
                  <i className="bi bi-arrow-repeat"></i>
                </div>
                <h6 className="fw-bold">4. Request & Match</h6>
                <p className="text-muted small">
                  Can't find a book? Submit a request and our engine matches available resources.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recently Added Approved Resources */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <div>
              <h3 className="fw-bold text-dark mb-1">Recently Approved Resources</h3>
              <p className="text-muted small mb-0">Verified curriculum materials added to the Digital Library</p>
            </div>
            <Link to="/library" className="btn btn-outline-edu btn-sm">
              View All Resources <i className="bi bi-arrow-right ms-1"></i>
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner text="Fetching approved resources..." />
          ) : recentResources.length === 0 ? (
            <div className="text-center py-5 bg-white rounded border">
              <p className="text-muted mb-0">No approved resources published yet.</p>
            </div>
          ) : (
            <div className="row g-3">
              {recentResources.map((res) => (
                <div key={res.id} className="col-lg-4 col-md-6 col-sm-12">
                  <ResourceCard resource={res} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-5 bg-success text-white text-center">
        <div className="container">
          <h2 className="fw-bold mb-3">Join the Mission to Support Rural Education</h2>
          <p className="lead mx-auto mb-4" style={{ maxWidth: '650px', opacity: 0.9 }}>
            Whether you have study notes to donate, a school in need of materials, or an NGO wanting to bridge the educational divide, RuralEdu welcomes you.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Link to="/register" className="btn btn-light text-success fw-bold px-4 py-2">
              Create Free Account
            </Link>
            <Link to="/about" className="btn btn-outline-light px-4 py-2">
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

