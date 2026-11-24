import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Invalid credentials. Please verify your email and password.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-7 col-lg-5">
          <div className="card edu-card border-0 shadow p-4">
            <div className="text-center mb-4">
              <img src="/logo.svg" alt="RuralEdu Logo" width="50" height="50" className="mb-2" />
              <h3 className="fw-bold text-dark">Sign In to RuralEdu</h3>
              <p className="text-muted small">Enter your credentials to access your dashboard</p>
            </div>

            {error && (
              <div className="alert alert-danger py-2 small d-flex align-items-center gap-2 mb-3">
                <i className="bi bi-exclamation-circle-fill"></i>
                <div>{error}</div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label text-dark small fw-semibold">Email Address</label>
                <div className="input-group">
                  <span className="input-group-text bg-light text-muted border-end-0">
                    <i className="bi bi-envelope"></i>
                  </span>
                  <input
                    type="email"
                    className="form-control border-start-0"
                    placeholder="name@ruraledu.org"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label className="form-label text-dark small fw-semibold mb-0">Password</label>
                </div>
                <div className="input-group">
                  <span className="input-group-text bg-light text-muted border-end-0">
                    <i className="bi bi-lock"></i>
                  </span>
                  <input
                    type="password"
                    className="form-control border-start-0"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary-edu w-100 py-2 fw-bold"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Authenticating...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Quick Demo Credentials */}
            <div className="mt-4 pt-3 border-top">
              <span className="text-muted small d-block mb-2 fw-semibold text-center">
                Demo Accounts (Click to test roles):
              </span>
              <div className="d-flex flex-wrap gap-1 justify-content-center">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger py-1 px-2"
                  style={{ fontSize: '11px' }}
                  onClick={() => handleDemoFill('admin@ruraledu.org', 'Admin@123')}
                >
                  Admin
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-success py-1 px-2"
                  style={{ fontSize: '11px' }}
                  onClick={() => handleDemoFill('aarav.student@ruraledu.org', 'password123')}
                >
                  Student
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-primary py-1 px-2"
                  style={{ fontSize: '11px' }}
                  onClick={() => handleDemoFill('sunita.donor@ruraledu.org', 'password123')}
                >
                  Donor
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-warning text-dark py-1 px-2"
                  style={{ fontSize: '11px' }}
                  onClick={() => handleDemoFill('ramesh.teacher@ruraledu.org', 'password123')}
                >
                  Teacher
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-info text-dark py-1 px-2"
                  style={{ fontSize: '11px' }}
                  onClick={() => handleDemoFill('contact@sevatrust.org', 'password123')}
                >
                  NGO
                </button>
              </div>
            </div>

            <div className="text-center mt-4">
              <p className="text-muted small mb-0">
                Don't have an account yet?{' '}
                <Link to="/register" className="text-success fw-semibold text-decoration-none">
                  Register here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

