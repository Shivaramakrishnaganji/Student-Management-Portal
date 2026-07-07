import { useState } from 'react';
import { createFaculty } from '../services/api';

function ManageFaculty({ user, onLogout }) {
  const [name, setName] = useState('');
  const [loginId, setLoginId] = useState('');
  const [branch, setBranch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newFaculty, setNewFaculty] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    setNewFaculty(null);

    try {
      const res = await createFaculty({ name, loginId, branch });
      setSuccess('Faculty created successfully!');
      setNewFaculty(res.data);
      setName('');
      setLoginId('');
      setBranch('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create faculty.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="container py-4">
        <h2 className="fw-bold mb-4">Add Faculty</h2>

        <div className="card shadow-sm border-0 mb-4">
          <div className="card-header bg-dark text-white fw-semibold">
            ➕ Add New Faculty
          </div>
          <div className="card-body">
            {error && <div className="alert alert-danger py-2 small">{error}</div>}
            {success && <div className="alert alert-success py-2 small">{success}</div>}

            <form onSubmit={handleSubmit}>
              <div className="row g-3 mb-3">
                <div className="col-md-4">
                  <label className="form-label fw-semibold">Faculty ID</label>
                  <input
                    type="text"
                    className="form-control"
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                    placeholder="Enter manual ID (e.g., 23325)"
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-semibold">Faculty Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter full name"
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-semibold">Department (Branch)</label>
                  <select
                    className="form-select"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    required
                  >
                    <option value="">Select Branch</option>
                    <option value="CSE">CSE</option>
                    <option value="ECE">ECE</option>
                    <option value="EEE">EEE</option>
                    <option value="MECH">MECH</option>
                    <option value="CIVIL">CIVIL</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="btn btn-dark" disabled={loading}>
                {loading ? 'Creating...' : 'Create Faculty Account'}
              </button>
            </form>
          </div>
        </div>

        {newFaculty && (
          <div className="card shadow border-success mb-4">
            <div className="card-header bg-success text-white fw-bold">
              ✅ Faculty Account Created!
            </div>
            <div className="card-body text-center">
              <h5 className="card-title text-success mb-3">Google Authenticator Setup</h5>
              <p className="card-text mb-4">
                Please ask the new faculty member to scan the QR code below using their 
                <strong> Google Authenticator</strong> app. They will need the 6-digit code to log in.
              </p>
              
              <div className="p-3 bg-light d-inline-block rounded shadow-sm mb-4">
                <img src={newFaculty.qrCodeUrl} alt="TOTP QR Code" style={{ width: '250px', height: '250px' }} />
              </div>

              <div className="text-start bg-light p-3 rounded mx-auto" style={{ maxWidth: '400px' }}>
                <p className="mb-1"><strong>Faculty Name:</strong> {newFaculty.faculty.name}</p>
                <p className="mb-1"><strong>Login ID:</strong> {newFaculty.faculty.loginId}</p>
                <p className="mb-0 text-muted small"><em>Manual Setup Key: {newFaculty.totpSecret}</em></p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageFaculty;
