import { useState, useEffect } from 'react';
import { getAllocations, getStudents, markAttendance, getClassAttendance } from '../services/api';

function MarkAttendance({ user, onLogout }) {
  const [allocations, setAllocations] = useState([]);
  const [selectedAllocation, setSelectedAllocation] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [hour, setHour] = useState('');
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);
  const [studentsLoaded, setStudentsLoaded] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    fetchAllocations();
  }, []);

  const fetchAllocations = async () => {
    try {
      const res = await getAllocations();
      // Filter allocations for the current faculty user
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

  const handleLoadStudents = async () => {
    if (!selectedAllocation || !hour) {
      setError('Please select an allocation and hour.');
      return;
    }

    setError('');
    setSuccess('');
    setSummary(null);
    setLoading(true);

    const alloc = getAllocationDetails();
    if (!alloc) {
      setError('Invalid allocation selected.');
      setLoading(false);
      return;
    }

    try {
      // First, fetch existing attendance for this class+date to block duplicate entries
      const attendanceRes = await getClassAttendance({
        branch: alloc.branch,
        year: alloc.year,
        section: alloc.section,
        date,
      });
      const records = attendanceRes.data;

      // Check if this specific hour is already marked
      const alreadyMarked = records.some(r => r.hour === Number(hour) && r.subjectName === alloc.subjectName);
      if (alreadyMarked) {
        setError(`Attendance for ${alloc.subjectName} (Hour ${hour}) has already been marked! Re-submission is disabled.`);
        setStudentsLoaded(false);
        setLoading(false);
        return;
      }

      // Fetch students for the branch+year+section
      const res = await getStudents();
      const filtered = res.data.filter(
        (s) =>
          s.branch === alloc.branch &&
          String(s.year) === String(alloc.year) &&
          s.section === alloc.section
      );
      setStudents(filtered);

      // Initialize all students as present
      const initialAttendance = {};
      filtered.forEach((s) => {
        initialAttendance[s._id] = 'present';
      });
      setAttendance(initialAttendance);
      setStudentsLoaded(true);
    } catch (err) {
      setError('Failed to load students. Make sure you have access.');
    } finally {
      setLoading(false);
    }
  };

  const handleAttendanceChange = (studentId, status) => {
    setAttendance((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleSubmit = async () => {
    setError('');
    setSuccess('');

    const alloc = getAllocationDetails();
    if (!alloc) return;

    const records = students.map((s) => ({
      studentId: s._id,
      status: attendance[s._id] || 'present',
    }));

    const payload = {
      branch: alloc.branch,
      year: Number(alloc.year),
      section: alloc.section,
      subjectName: alloc.subjectName,
      date,
      hour: Number(hour),
      students: records,
    };

    try {
      await markAttendance(payload);
      setSuccess('Attendance marked successfully!');
      
      const present = records.filter(r => r.status === 'present').length;
      const absent = records.filter(r => r.status === 'absent').length;
      const total = records.length;
      const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
      
      setSummary({ total, present, absent, percentage });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to mark attendance.');
    }
  };

  return (
    <div>
      <div className="container py-4">
        <h2 className="fw-bold mb-4">📝 Mark Attendance</h2>

        {error && <div className="alert alert-danger py-2">{error}</div>}
        {success && <div className="alert alert-success py-2">{success}</div>}

        {/* Selection Card */}
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-header bg-dark text-white fw-semibold">
            Select Class & Subject
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
                    setStudentsLoaded(false);
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
                    setStudentsLoaded(false);
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
                    setStudentsLoaded(false);
                  }}
                >
                  <option value="">Hour</option>
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
                  onClick={handleLoadStudents}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="spinner-border spinner-border-sm" />
                  ) : (
                    'Load Students'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Student Attendance List */}
        {studentsLoaded && (
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-header bg-dark text-white fw-semibold">
              📋 Students ({students.length})
            </div>
            <div className="card-body p-0">
              {students.length === 0 ? (
                <div className="text-center py-4 text-muted">
                  No students found for this class.
                </div>
              ) : summary ? (
                <div className="text-center py-5">
                  <h3 className="text-success fw-bold mb-4">✅ Attendance Submitted Successfully!</h3>
                  <div className="d-flex justify-content-center flex-wrap gap-4 mb-4">
                    <div className="p-3 bg-light rounded shadow-sm text-center" style={{ minWidth: '130px' }}>
                      <h3 className="fw-bold text-dark mb-1">{summary.total}</h3>
                      <span className="text-muted small text-uppercase fw-semibold">Total Students</span>
                    </div>
                    <div className="p-3 bg-success bg-opacity-10 rounded shadow-sm text-center border border-success border-opacity-25" style={{ minWidth: '130px' }}>
                      <h3 className="fw-bold text-success mb-1">{summary.present}</h3>
                      <span className="text-success small text-uppercase fw-semibold">Present</span>
                    </div>
                    <div className="p-3 bg-danger bg-opacity-10 rounded shadow-sm text-center border border-danger border-opacity-25" style={{ minWidth: '130px' }}>
                      <h3 className="fw-bold text-danger mb-1">{summary.absent}</h3>
                      <span className="text-danger small text-uppercase fw-semibold">Absent</span>
                    </div>
                    <div className="p-3 bg-primary bg-opacity-10 rounded shadow-sm text-center border border-primary border-opacity-25" style={{ minWidth: '130px' }}>
                      <h3 className="fw-bold text-primary mb-1">{summary.percentage}%</h3>
                      <span className="text-primary small text-uppercase fw-semibold">Attendance</span>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="table-responsive">
                    <table className="table table-striped table-hover mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>#</th>
                          <th>Roll Number</th>
                          <th>Name</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.map((student, index) => (
                          <tr key={student._id}>
                            <td>{index + 1}</td>
                            <td>{student.rollNumber}</td>
                            <td>{student.name}</td>
                            <td>
                              <div className="d-flex gap-3">
                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    name={`att-${student._id}`}
                                    id={`present-${student._id}`}
                                    checked={attendance[student._id] === 'present'}
                                    onChange={() =>
                                      handleAttendanceChange(student._id, 'present')
                                    }
                                  />
                                  <label
                                    className="form-check-label text-success fw-semibold"
                                    htmlFor={`present-${student._id}`}
                                  >
                                    Present
                                  </label>
                                </div>
                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    name={`att-${student._id}`}
                                    id={`absent-${student._id}`}
                                    checked={attendance[student._id] === 'absent'}
                                    onChange={() =>
                                      handleAttendanceChange(student._id, 'absent')
                                    }
                                  />
                                  <label
                                    className="form-check-label text-danger fw-semibold"
                                    htmlFor={`absent-${student._id}`}
                                  >
                                    Absent
                                  </label>
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="p-3">
                    <button className="btn btn-dark btn-lg w-100" onClick={handleSubmit}>
                      ✅ Submit Attendance
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MarkAttendance;
