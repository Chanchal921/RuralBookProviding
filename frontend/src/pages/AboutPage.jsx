import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-1 rounded-pill mb-2 fw-semibold">
          Software Architecture & Design (SAD)
        </span>
        <h1 className="fw-bold text-dark">About RuralEdu Platform</h1>
        <p className="lead text-muted mx-auto" style={{ maxWidth: '700px' }}>
          Rural Education Resource Sharing Platform – Designed to democratize quality educational assets for remote and rural communities.
        </p>
      </div>

      <div className="row g-4 mb-5">
        <div className="col-lg-6">
          <div className="p-4 bg-white rounded-3 border h-100 shadow-sm">
            <h4 className="fw-bold text-success mb-3 d-flex align-items-center gap-2">
              <i className="bi bi-bullseye"></i> Problem Statement & Vision
            </h4>
            <p className="text-secondary">
              Rural educational institutions face severe shortages of updated textbooks, syllabus-aligned revision notes, question banks, and learning aids. At the same time, individual donors, urban teachers, and non-governmental organizations (NGOs) possess educational materials that can be digitized and redistributed.
            </p>
            <p className="text-secondary mb-0">
              <strong>RuralEdu</strong> provides a centralized, verified, and structured platform ensuring that only vetted and curriculum-compliant materials reach rural classrooms and learners.
            </p>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="p-4 bg-white rounded-3 border h-100 shadow-sm">
            <h4 className="fw-bold text-primary mb-3 d-flex align-items-center gap-2">
              <i className="bi bi-diagram-3"></i> System Architecture
            </h4>
            <ul className="list-unstyled text-secondary mb-0">
              <li className="mb-2">
                <i className="bi bi-check-circle-fill text-success me-2"></i>
                <strong>Presentation Tier:</strong> React.js Single Page Application (Vite, Bootstrap 5, Axios, React Router).
              </li>
              <li className="mb-2">
                <i className="bi bi-check-circle-fill text-success me-2"></i>
                <strong>Application Tier:</strong> Java 17, Spring Boot 3.x, Spring Data JPA, Spring Security with stateless JWT.
              </li>
              <li className="mb-2">
                <i className="bi bi-check-circle-fill text-success me-2"></i>
                <strong>Data Tier:</strong> Relational MySQL Database, normalized tables, indexed queries, and local file storage.
              </li>
              <li>
                <i className="bi bi-check-circle-fill text-success me-2"></i>
                <strong>Security:</strong> BCrypt password hashing, role-based authorization, sanitization, and state machine transitions.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Actors & Roles */}
      <div className="card edu-card p-4 mb-5 shadow-sm">
        <h4 className="fw-bold text-dark mb-4">UML Actors & Responsibilities</h4>
        <div className="row g-3">
          <div className="col-md-4">
            <div className="border p-3 rounded-2 h-100 bg-light">
              <span className="badge bg-success text-white mb-2">STUDENT</span>
              <p className="small text-muted mb-0">
                Browse Digital Library, download approved materials, submit resource requests for unavailable subjects, and track request fulfillment.
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="border p-3 rounded-2 h-100 bg-light">
              <span className="badge bg-primary text-white mb-2">DONOR</span>
              <p className="small text-muted mb-0">
                Upload educational books, PDFs, and study guides. Track approval status through the donor dashboard and review donation history.
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="border p-3 rounded-2 h-100 bg-light">
              <span className="badge bg-warning text-dark mb-2">TEACHER / SCHOOL</span>
              <p className="small text-muted mb-0">
                Upload curriculum materials and question papers. Request missing classroom kits and monitor verification progress.
              </p>
            </div>
          </div>

          <div className="col-md-6 mt-3">
            <div className="border p-3 rounded-2 h-100 bg-light">
              <span className="badge bg-info text-white mb-2">NGO</span>
              <p className="small text-muted mb-0">
                Distribute educational resources across village clusters, submit verified content, and monitor community requests.
              </p>
            </div>
          </div>

          <div className="col-md-6 mt-3">
            <div className="border p-3 rounded-2 h-100 bg-light">
              <span className="badge bg-danger text-white mb-2">ADMINISTRATOR</span>
              <p className="small text-muted mb-0">
                Full administrative oversight: evaluate pending submissions, approve/reject resources, match requests, deactivate obsolete content, and manage users.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* UML State Machine Cycles */}
      <div className="bg-white p-4 rounded-3 border shadow-sm mb-5">
        <h4 className="fw-bold text-dark mb-3">Resource & Request State Lifecycles</h4>
        <div className="row g-4">
          <div className="col-md-6">
            <h6 className="fw-bold text-success">Resource Lifecycle:</h6>
            <div className="d-flex align-items-center gap-2 flex-wrap font-monospace small p-3 bg-light rounded">
              <span className="badge bg-warning text-dark">PENDING</span>
              <i className="bi bi-arrow-right"></i>
              <span className="badge bg-success">APPROVED</span>
              <i className="bi bi-arrow-right"></i>
              <span className="badge bg-secondary">DEACTIVATED</span>
            </div>
            <p className="small text-muted mt-2">
              Alternatively: <code>PENDING &rarr; REJECTED</code> if standards are not met.
            </p>
          </div>

          <div className="col-md-6">
            <h6 className="fw-bold text-primary">Resource Request Lifecycle:</h6>
            <div className="d-flex align-items-center gap-2 flex-wrap font-monospace small p-3 bg-light rounded">
              <span className="badge bg-warning text-dark">PENDING</span>
              <i className="bi bi-arrow-right"></i>
              <span className="badge bg-primary">MATCHED</span>
              <i className="bi bi-arrow-right"></i>
              <span className="badge bg-success">APPROVED</span>
              <i className="bi bi-arrow-right"></i>
              <span className="badge bg-info">COMPLETED</span>
            </div>
            <p className="small text-muted mt-2">
              Automated matching engine scans approved resources and links candidate materials for requester and admin review.
            </p>
          </div>
        </div>
      </div>

      <div className="text-center">
        <Link to="/library" className="btn btn-primary-edu px-4 me-2">
          Explore Digital Library
        </Link>
        <Link to="/register" className="btn btn-outline-edu px-4">
          Register an Account
        </Link>
      </div>
    </div>
  );
};

export default AboutPage;

