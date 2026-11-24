import React, { useState, useEffect, useCallback } from 'react';
import { adminApi } from '../../api/adminApi';
import Sidebar from '../../components/common/Sidebar';
import StatusBadge from '../../components/common/StatusBadge';
import Pagination from '../../components/common/Pagination';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminUserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [togglingId, setTogglingId] = useState(null);
  const [feedback, setFeedback] = useState({ text: '', type: '' });

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        size: 10,
      };
      if (roleFilter) params.role = roleFilter;
      if (search) params.search = search;

      const res = await adminApi.getUsers(params);
      if (res.success && res.data) {
        setUsers(res.data.content || []);
        setTotalPages(res.data.totalPages || 0);
      }
    } catch (err) {
      console.error('Failed to load users', err);
    } finally {
      setLoading(false);
    }
  }, [roleFilter, search, currentPage]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleToggleStatus = async (user) => {
    if (user.role === 'ADMIN') {
      alert('Central Administrator accounts cannot be deactivated.');
      return;
    }

    setTogglingId(user.id);
    try {
      await adminApi.updateUser(user.id, {
        active: !user.active,
      });
      setFeedback({
        text: `User ${user.fullName} status updated to ${!user.active ? 'ACTIVE' : 'INACTIVE'}.`,
        type: 'info',
      });
      fetchUsers();
    } catch (err) {
      setFeedback({ text: err.response?.data?.message || 'Could not update user status.', type: 'danger' });
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-3 col-lg-2 p-0">
          <Sidebar />
        </div>

        <main className="col-md-9 col-lg-10 p-4">
          <div className="mb-4 pb-2 border-bottom">
            <h3 className="fw-bold text-dark mb-1">
              <i className="bi bi-people text-secondary me-2"></i> User & Account Management
            </h3>
            <p className="text-muted small mb-0">Oversee all registered students, donors, schools, NGOs, and administrators</p>
          </div>

          {feedback.text && (
            <div className={`alert alert-${feedback.type} py-2 small mb-3 alert-dismissible`}>
              {feedback.text}
              <button type="button" className="btn-close py-2" onClick={() => setFeedback({ text: '', type: '' })}></button>
            </div>
          )}

          {/* Search & Filter Bar */}
          <div className="bg-white p-3 rounded-3 border mb-3 shadow-sm d-flex flex-wrap gap-2 align-items-center justify-content-between">
            <div className="d-flex gap-2 flex-grow-1" style={{ maxWidth: '420px' }}>
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Search user name, email, or school..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(0); }}
              />
            </div>

            <div className="d-flex align-items-center gap-2">
              <span className="small text-muted">Role Filter:</span>
              <select
                className="form-select form-select-sm"
                value={roleFilter}
                onChange={(e) => { setRoleFilter(e.target.value); setCurrentPage(0); }}
                style={{ width: '150px' }}
              >
                <option value="">All Roles</option>
                <option value="STUDENT">STUDENT</option>
                <option value="DONOR">DONOR</option>
                <option value="TEACHER">TEACHER</option>
                <option value="NGO">NGO</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>
          </div>

          {loading ? (
            <LoadingSpinner text="Loading users directory..." />
          ) : users.length === 0 ? (
            <div className="text-center py-5 bg-white rounded border shadow-sm">
              <p className="text-muted mb-0">No users found matching search criteria.</p>
            </div>
          ) : (
            <div className="bg-white rounded-3 border shadow-sm">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Full Name & Email</th>
                      <th>Role</th>
                      <th>Phone</th>
                      <th>School / Organization</th>
                      <th>Status</th>
                      <th>Joined</th>
                      <th className="text-end">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id}>
                        <td>
                          <div className="fw-bold text-dark">{u.fullName}</div>
                          <small className="text-muted">{u.email}</small>
                        </td>
                        <td>
                          <span className={`badge ${
                            u.role === 'ADMIN' ? 'bg-danger' :
                            u.role === 'TEACHER' ? 'bg-warning text-dark' :
                            u.role === 'DONOR' ? 'bg-primary' :
                            u.role === 'NGO' ? 'bg-info text-dark' : 'bg-success'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td>
                          <small className="text-muted">{u.phone || 'N/A'}</small>
                        </td>
                        <td>
                          <small className="text-dark fw-semibold">{u.organizationName || 'Independent'}</small>
                        </td>
                        <td>
                          <StatusBadge status={u.active ? 'ACTIVE' : 'INACTIVE'} />
                        </td>
                        <td>
                          <small className="text-muted">
                            {new Date(u.createdAt).toLocaleDateString()}
                          </small>
                        </td>
                        <td className="text-end">
                          {u.role !== 'ADMIN' && (
                            <button
                              className={`btn btn-sm ${u.active ? 'btn-outline-danger' : 'btn-outline-success'} py-0 px-2`}
                              style={{ fontSize: '12px' }}
                              onClick={() => handleToggleStatus(u)}
                              disabled={togglingId === u.id}
                            >
                              {u.active ? 'Deactivate' : 'Activate'}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-3 border-top">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => setCurrentPage(page)}
                />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminUserManagementPage;

