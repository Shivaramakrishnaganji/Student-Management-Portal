import { useState } from 'react';
import { getBunkersList } from '../services/api';

const BRANCHES = ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL'];

function AdminBunkersList() {
  const [branch, setBranch] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [bunkers, setBunkers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleFetch = async () => {
    if (!branch || !date) {
      setError('Please select a branch and date.');
      return;
    }
    setError('');
    setLoading(true);
    setSearched(false);
    try {
      const res = await getBunkersList({ branch, date });
      setBunkers(res.data);
      setSearched(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load bunkers list.');
    } finally {
      setLoading(false);
    }
  };

  // Group by year for summary stats
  const yearGroups = [1, 2, 3, 4].map((yr) => ({
    year: yr,
    count: bunkers.filter((b) => b.year === yr).length,
  }));

  const totalBunkersCount = bunkers.length;

  return (
    <div style={{ minHeight: '100vh' }}>
      <div className="container py-4">

        {/* Header */}
        <div className="d-flex align-items-center gap-3 mb-4">
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: 'linear-gradient(135deg, var(--primary), #3b82f6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 22,
              boxShadow: '0 4px 15px var(--primary-glow)',
            }}
          >
            🚨
          </div>
          <div>
            <h2 className="fw-bold mb-0" style={{ color: 'var(--text-main)', letterSpacing: '-0.5px' }}>
              Department-Wise Bunkers List
            </h2>
            <p className="text-muted mb-0 small">
              Students who attended earlier hours but skipped later ones on the selected date
            </p>
          </div>
        </div>

        {/* Filter Card */}
        <div
          className="card border-0 mb-4"
        >
          <div
            className="card-header border-0 fw-semibold"
          >
            🔍 Select Branch &amp; Date
          </div>
          <div className="card-body p-4">
            {error && <div className="alert alert-danger py-2 mb-3">{error}</div>}
            <div className="row g-3 align-items-end">
              <div className="col-md-4">
                <label className="form-label fw-semibold small text-uppercase text-muted" style={{ letterSpacing: '0.5px' }}>
                  Department / Branch
                </label>
                <select
                  className="form-select"
                  value={branch}
                  onChange={(e) => { setBranch(e.target.value); setBunkers([]); setSearched(false); }}
                >
                  <option value="">Select Department</option>
                  {BRANCHES.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label fw-semibold small text-uppercase text-muted" style={{ letterSpacing: '0.5px' }}>
                  Date
                </label>
                <input
                  type="date"
                  className="form-control"
                  value={date}
                  onChange={(e) => { setDate(e.target.value); setBunkers([]); setSearched(false); }}
                />
              </div>
              <div className="col-md-4">
                <button
                  className="btn btn-primary w-100 fw-semibold text-white"
                  onClick={handleFetch}
                  disabled={loading}
                >
                  {loading ? (
                    <><span className="spinner-border spinner-border-sm me-2" />Loading...</>
                  ) : (
                    '🚨 View Bunkers List'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        {searched && (
          <>
            <div className="row g-3 mb-4">
              <div className="col-md-3">
                <div
                  className="p-3 text-center border-0"
                  style={{
                    borderRadius: 14,
                    background: 'linear-gradient(135deg, #f87171, #ef4444)',
                    color: '#fff',
                    boxShadow: '0 4px 15px rgba(239, 68, 68, 0.2)',
                  }}
                >
                  <h3 className="fw-bold mb-1">{totalBunkersCount}</h3>
                  <div className="small fw-semibold opacity-90">Total Bunkers ({branch})</div>
                </div>
              </div>
              {yearGroups.map((yg) => (
                <div className="col-md-2" key={yg.year}>
                  <div
                    className="p-3 text-center border-0 h-100"
                    style={{
                      borderRadius: 14,
                      background: yg.count > 0 ? 'linear-gradient(135deg, #fbbf24, #f59e0b)' : '#fff',
                      color: yg.count > 0 ? '#fff' : 'var(--text-muted)',
                      boxShadow: yg.count > 0
                        ? '0 4px 15px rgba(245,158,11,0.2)'
                        : 'var(--shadow-sm)',
                      border: yg.count > 0 ? 'none' : '1px solid var(--border-color)',
                    }}
                  >
                    <h4 className="fw-bold mb-1">{yg.count}</h4>
                    <div className="small fw-semibold" style={{ opacity: 0.85 }}>Year {yg.year}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Main Table */}
            <div
              className="card border-0"
            >
              <div
                className="card-header border-0 d-flex align-items-center justify-content-between"
              >
                <span className="fw-semibold" style={{ fontSize: 15 }}>
                  📋 Bunkers List — {branch} Department ({date})
                </span>
                <span
                  className="badge bg-danger"
                >
                  {totalBunkersCount} Bunkers Found
                </span>
              </div>

              {bunkers.length === 0 ? (
                <div className="text-center py-5">
                  <div style={{ fontSize: 52 }}>✅</div>
                  <h5 className="fw-bold text-success mt-2">No Bunkers Found!</h5>
                  <p className="text-muted">All students in {branch} attended their classes properly on {date}.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover mb-0" style={{ fontSize: 14 }}>
                    <thead>
                      <tr>
                        <th className="px-4 py-3 text-muted fw-semibold" style={{ fontSize: 12, letterSpacing: '0.5px', textTransform: 'uppercase' }}>S.No</th>
                        <th className="py-3 text-muted fw-semibold" style={{ fontSize: 12, letterSpacing: '0.5px', textTransform: 'uppercase' }}>Year</th>
                        <th className="py-3 text-muted fw-semibold" style={{ fontSize: 12, letterSpacing: '0.5px', textTransform: 'uppercase' }}>Roll No</th>
                        <th className="py-3 text-muted fw-semibold" style={{ fontSize: 12, letterSpacing: '0.5px', textTransform: 'uppercase' }}>Student Name</th>
                        <th className="py-3 text-muted fw-semibold" style={{ fontSize: 12, letterSpacing: '0.5px', textTransform: 'uppercase' }}>Section</th>
                        <th className="py-3 text-muted fw-semibold" style={{ fontSize: 12, letterSpacing: '0.5px', textTransform: 'uppercase' }}>Bunked Hours (Today)</th>
                        <th className="py-3 text-muted fw-semibold" style={{ fontSize: 12, letterSpacing: '0.5px', textTransform: 'uppercase' }}>Total Bunks (All Time)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bunkers.map((b, idx) => {
                        const isHighBunker = b.totalBunks >= 10;
                        return (
                          <tr
                            key={b.studentId}
                            style={{
                              borderLeft: isHighBunker ? '4px solid #ef4444' : '4px solid transparent',
                              transition: 'background 0.15s',
                            }}
                          >
                            <td className="px-4 py-3 fw-semibold text-muted">{idx + 1}</td>
                            <td className="py-3">
                              <span
                                className={`badge fw-semibold ${['bg-info', 'bg-success', 'bg-warning', 'bg-danger'][b.year - 1] || 'bg-secondary'}`}
                              >
                                Year {b.year}
                              </span>
                            </td>
                            <td className="py-3 fw-semibold" style={{ color: '#2c3e50', fontFamily: 'monospace', fontSize: 13 }}>
                              {b.rollNumber}
                            </td>
                            <td className="py-3 fw-semibold" style={{ color: '#2c3e50' }}>{b.name}</td>
                            <td className="py-3">
                              <span className="badge bg-secondary">
                                {b.section}
                              </span>
                            </td>
                            <td className="py-3">
                              <div className="d-flex flex-wrap gap-1">
                                {b.bunkedHoursToday.map((hr) => (
                                  <span
                                    key={hr}
                                    className="badge bg-danger"
                                  >
                                    Hour {hr}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="py-3">
                              <div className="d-flex align-items-center gap-2">
                                <span
                                  className="fw-bold"
                                  style={{
                                    fontSize: 18,
                                    color: isHighBunker ? 'var(--danger)' : b.totalBunks >= 5 ? 'var(--warning)' : 'var(--success)',
                                  }}
                                >
                                  {b.totalBunks}
                                </span>
                                {isHighBunker && (
                                  <span className="badge bg-danger">
                                    ⚠️ High Risk
                                  </span>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Year-wise breakdown footer note */}
            {bunkers.length > 0 && (
              <div className="mt-3 p-3 rounded-3" style={{ background: '#fff3cd', border: '1px solid #ffc107' }}>
                <small className="text-warning-emphasis fw-semibold">
                  ⚠️ <strong>Note:</strong> Students highlighted in red (left border) have bunked <strong>10 or more times</strong> in total and are flagged as <em>High Risk</em>. 
                  The table is sorted by Year (1st to 4th) within the {branch} department.
                </small>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default AdminBunkersList;
