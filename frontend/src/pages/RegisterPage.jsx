import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'STUDENT',
    organizationName: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: formData.role,
        organizationName: formData.organizationName,
      };

      const res = await register(payload);
      if (res.success) {
        setSuccess('Registration successful! Redirecting you to login...');
        setTimeout(() => {
          navigate('/login');
        }, 1800);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card edu-card border-0 shadow p-4">
            <div className="text-center mb-4">
              <img src="/logo.svg" alt="RuralEdu Logo" width="45" height="45" className="mb-2" />
              <h3 className="fw-bold text-dark">Join RuralEdu</h3>
              <p className="text-muted small">Create an account to share or access rural educational materials</p>
            </div>

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
                <label className="form-label text-dark small fw-semibold">Select Account Role *</label>
                <div className="row g-2">
                  {[
                    { value: 'STUDENT', label: 'Student', icon: 'bi-mortarboard' },
                    { value: 'DONOR', label: 'Donor', icon: 'bi-heart' },
                    { value: 'TEACHER', label: 'Teacher / School', icon: 'bi-building' },
                    { value: 'NGO', label: 'NGO', icon: 'bi-people' },
                  ].map((r) => (
                    <div key={r.value} className="col-6">
                      <div
                        className={`p-2 border rounded text-center cursor-pointer ${
                          formData.role === r.value ? 'border-success bg-success-subtle text-success fw-bold' : 'text-muted'
                        }`}
                        style={{ cursor: 'pointer', fontSize: '13px' }}
                        onClick={() => setFormData({ ...formData, role: r.value })}
                      >
                        <i className={`bi ${r.icon} me-1`}></i> {r.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label text-dark small fw-semibold">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  className="form-control"
                  placeholder="e.g. Ramesh Kumar"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="row g-2 mb-3">
                <div className="col-md-6 col-sm-12">
                  <label className="form-label text-dark small fw-semibold">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6 col-sm-12">
                  <label className="form-label text-dark small fw-semibold">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    className="form-control"
                    placeholder="e.g. 9876543210"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label text-dark small fw-semibold">
                  School / Organization Name {formData.role !== 'STUDENT' ? '*' : '(Optional)'}
                </label>
                <input
                  type="text"
                  name="organizationName"
                  className="form-control"
                  placeholder={formData.role === 'STUDENT' ? 'e.g. Rampur High School' : 'e.g. Education For All Trust'}
                  value={formData.organizationName}
                  onChange={handleChange}
                  required={formData.role !== 'STUDENT'}
                />
              </div>

              <div className="row g-2 mb-4">
                <div className="col-md-6 col-sm-12">
                  <label className="form-label text-dark small fw-semibold">Password *</label>
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    placeholder="Min 6 characters"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6 col-sm-12">
                  <label className="form-label text-dark small fw-semibold">Confirm Password *</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    className="form-control"
                    placeholder="Repeat password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
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
                    Registering Account...
                  </>
                ) : (
                  'Complete Registration'
                )}
              </button>
            </form>

            <div className="text-center mt-4">
              <p className="text-muted small mb-0">
                Already registered?{' '}
                <Link to="/login" className="text-success fw-semibold text-decoration-none">
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

