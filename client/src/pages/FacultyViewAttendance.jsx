import { useState, useEffect } from 'react';
import { getAllocations, getClassAttendance } from '../services/api';

function FacultyViewAttendance({ user }) {
  const [allocations, setAllocations] = useState([]);
  const [selectedAllocation, setSelectedAllocation] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [hour, setHour] = useState('');
  const [classRecords, setClassRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAllocations();
  }, []);

  const fetchAllocations = async () => {
    try {
      const res = await getAllocations();
      const myAllocations = res.data.filter((a) => {
        const fId = typeof a.facultyId === 'object' ? a.facultyId?._id : a.facultyId;
        return fId === user?._id;
      });
      setAllocations(myAllocations.length > 0 ? myAllocations : res.data);
    } catch (err) {
      setError('Failed to load your allocations.');
    }
  };

  const getAllocationDetails = () => {
    return allocations.find((a) => a._id === selectedAllocation);
  };

  const handleFetchAttendance = async () => {
    if (!selectedAllocation || !date) {
      setError('Please select an allocation and date.');
      return;
    }

    setError('');
    setLoading(true);

    const alloc = getAllocationDetails();
    if (!alloc) {
      setError('Invalid allocation selected.');
      setLoading(false);
      return;
    }

    try {
      const res = await getClassAttendance({
        branch: alloc.branch,
        year: alloc.year,
        section: alloc.section,
        date,
        ...(hour && { hour })
      });
      setClassRecords(res.data);
    } catch (err) {
      setError('Failed to load class attendance');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="container py-4">
        <h2 className="fw-bold mb-4">📊 View Attendance Records</h2>

        {error && <div className="alert alert-danger py-2">{error}</div>}

        <div className="card shadow-sm border-0 mb-4">
          <div className="card-header bg-dark text-white fw-semibold">
            Select Class & Date
          </div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label fw-semibold">Your Allocation</label>
                <select
                  className="form-select"
                  value={selectedAllocation}
                  onChange={(e) => {
                    setSelectedAllocation(e.target.value);
                    setClassRecords([]);
                  }}
                >
                  <option value="">Select class & subject</option>
                  {allocations.map((a) => (
                    <option key={a._id} value={a._id}>
                      {a.subjectName} - {a.branch} Year {a.year} Sec {a.section}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label fw-semibold">Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={date}
                  onChange={(e) => {
                    setDate(e.target.value);
                    setClassRecords([]);
                  }}
                />
              </div>
              <div className="col-md-2">
                <label className="form-label fw-semibold">Hour</label>
                <select
                  className="form-select"
                  value={hour}
                  onChange={(e) => {
                    setHour(e.target.value);
                    setClassRecords([]);
                  }}
                >
                  <option value="">All Hours</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((h) => (
                    <option key={h} value={h}>
                      Hour {h}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-3 d-flex align-items-end">
                <button
                  className="btn btn-dark w-100"
                  onClick={handleFetchAttendance}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="spinner-border spinner-border-sm" />
                  ) : (
                    'View Attendance'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {classRecords.length > 0 ? (
          <div className="card shadow-sm border-0">
            <div className="card-header bg-secondary text-white fw-semibold">
              Attendance Records for {date}
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-striped table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Student</th>
                      <th>Subject</th>
                      <th>Hour</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classRecords.map((rec, i) => (
                      <tr key={i}>
                        <td>{rec.studentId?.name || rec.studentId}</td>
                        <td>{rec.subjectName}</td>
                        <td>Hour {rec.hour}</td>
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
            </div>
          </div>
        ) : (
          !loading && classRecords.length === 0 && selectedAllocation && (
            <div className="text-center py-5 text-muted">
              Select a class and click "View Attendance" to see records.
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default FacultyViewAttendance;
