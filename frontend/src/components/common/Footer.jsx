import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="mt-auto bg-white border-top py-4">
      <div className="container">
        <div className="row gy-3 align-items-center">
          <div className="col-md-6 text-center text-md-start">
            <div className="d-flex align-items-center justify-content-center justify-content-md-start gap-2 mb-1">
              <img src="/logo.svg" alt="RuralEdu" width="24" height="24" />
              <span className="fw-bold text-success">RuralEdu</span>
            </div>
            <p className="text-muted small mb-0">
              Rural Education Resource Sharing Platform. Bridging the digital divide for underserved schools, students, and educators.
            </p>
          </div>

          <div className="col-md-6 text-center text-md-end">
            <div className="d-flex justify-content-center justify-content-md-end gap-3 small mb-1">
              <Link to="/" className="text-decoration-none text-muted">Home</Link>
              <Link to="/library" className="text-decoration-none text-muted">Digital Library</Link>
              <Link to="/about" className="text-decoration-none text-muted">About</Link>
              <a href="http://localhost:8080/swagger-ui.html" target="_blank" rel="noreferrer" className="text-decoration-none text-success">
                API Docs (Swagger)
              </a>
            </div>
            <p className="text-muted small mb-0">
              &copy; {new Date().getFullYear()} RuralEdu Foundation. SAD Architecture Project.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

