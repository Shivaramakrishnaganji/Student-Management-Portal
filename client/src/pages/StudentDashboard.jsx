import { useState, useEffect } from 'react';
import { getMyAttendance, getMyPercentage } from '../services/api';

function StudentDashboard({ user, onLogout }) {
  const [records, setRecords] = useState([]);
  const [percentage, setPercentage] = useState(null);
  const [stats, setStats] = useState({ total: 0, present: 0, absent: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [attRes, percRes] = await Promise.all([getMyAttendance(), getMyPercentage()]);
      const attData = attRes.data;
      setRecords(attData);

      // Calculate stats
      const total = attData.length;
      const present = attData.filter((r) => r.status === 'present').length;
      const absent = total - present;
      setStats({ total, present, absent });

      // Percentage
      const percData = percRes.data;
      setPercentage(
        percData.percentage !== undefined
          ? percData.percentage
          : total > 0
          ? Math.round((present / total) * 100)
          : 0
      );
    } catch (err) {
      setError('Failed to load attendance data.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (pct) => {
    if (pct === null) return 'bg-secondary';
    if (pct < 65) return 'bg-danger';
    if (pct < 75) return 'bg-warning';
    if (pct < 80) return 'bg-info';
    return 'bg-success';
  };

  const getStatusMessage = (pct) => {
    if (pct === null) return 'No data';
    if (pct < 65) return '⚠️ Critical! You are below the minimum attendance requirement.';
    if (pct < 75) return '⚠️ Warning! Your attendance is low. Improve immediately.';
    if (pct < 80) return '📈 Fair. Keep attending classes to improve.';
    return '✅ Great! Your attendance is excellent.';
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border" role="status" />
        <p className="mt-2 text-muted">Loading your attendance...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="container py-4">
        {/* Header Section */}
        <div className="mb-4">
          <h2 className="fw-bold">Welcome, {user?.name || 'Student'} 👋</h2>
          <p className="text-muted mb-0">
            {user?.rollNumber && <span className="me-3">Roll: {user.rollNumber}</span>}
            {user?.branch && <span className="me-3">Branch: {user.branch}</span>}
            {user?.year && <span className="me-3">Year: {user.year}</span>}
            {user?.section && <span>Section: {user.section}</span>}
          </p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        {/* Stats Row */}
        <div className="row g-4 mb-4">
          {/* Percentage Card */}
          <div className="col-md-4">
            <div className={`card text-white ${getStatusColor(percentage)} shadow border-0 h-100`}>
              <div className="card-body text-center py-4">
                <h6 className="text-uppercase fw-semibold opacity-75 mb-1">Attendance</h6>
                <h1 className="display-2 fw-bold mb-1">
                  {percentage !== null ? `${percentage}%` : '--'}
                </h1>
                <p className="mb-0 small opacity-75">Overall Percentage</p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="col-md-8">
            <div className="row g-4 h-100">
              <div className="col-4">
                <div className="card shadow-sm border-0 h-100">
                  <div className="card-body text-center py-4">
                    <h6 className="text-muted text-uppercase small fw-semibold">Total Hours</h6>
                    <h2 className="fw-bold mb-0">{stats.total}</h2>
                  </div>
                </div>
              </div>
              <div className="col-4">
                <div className="card shadow-sm border-0 h-100">
                  <div className="card-body text-center py-4">
                    <h6 className="text-success text-uppercase small fw-semibold">Present</h6>
                    <h2 className="fw-bold text-success mb-0">{stats.present}</h2>
                  </div>
                </div>
              </div>
              <div className="col-4">
                <div className="card shadow-sm border-0 h-100">
                  <div className="card-body text-center py-4">
                    <h6 className="text-danger text-uppercase small fw-semibold">Absent</h6>
                    <h2 className="fw-bold text-danger mb-0">{stats.absent}</h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status Message */}
        <div
          className={`alert ${getStatusColor(percentage)} text-white border-0 shadow-sm mb-4`}
          role="alert"
        >
          <strong>{getStatusMessage(percentage)}</strong>
        </div>

        {/* Attendance Records Table */}
        <div className="card shadow-sm border-0">
          <div className="card-header bg-dark text-white fw-semibold">
            📋 Attendance Records ({records.length})
          </div>
          <div className="card-body p-0">
            {records.length === 0 ? (
              <div className="text-center py-4 text-muted">No attendance records found.</div>
            ) : (
              <div className="table-responsive">
                <table className="table table-striped table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>Date</th>
                      <th>Hour</th>
                      <th>Subject</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((rec, index) => (
                      <tr key={rec._id || index}>
                        <td>{index + 1}</td>
                        <td>{new Date(rec.date).toLocaleDateString()}</td>
                        <td>Hour {rec.hour}</td>
                        <td>{rec.subjectName}</td>
                        <td>
                          <span
                            className={`badge ${
                              rec.status === 'present' ? 'bg-success' : 'bg-danger'
                            }`}
                          >
                            {rec.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
