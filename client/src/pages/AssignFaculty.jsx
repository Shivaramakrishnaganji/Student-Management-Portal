import { useState, useEffect } from 'react';
import Table from '../components/Table';
import { getAllocations, createAllocation, updateAllocation, deleteAllocation, getSubjects, getFacultyList } from '../services/api';

const BRANCHES = ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL'];
const YEARS = [1, 2, 3, 4];
const SECTIONS = ['A', 'B', 'C'];

function AssignFaculty({ user, onLogout }) {
  const [allocations, setAllocations] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [facultyList, setFacultyList] = useState([]);
  const [form, setForm] = useState({
    facultyId: '',
    facultyName: '',
    branch: '',
    year: '',
    section: '',
    subjectName: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchAllocations();
    fetchFacultyList();
  }, []);

  const fetchFacultyList = async () => {
    try {
      const res = await getFacultyList();
      setFacultyList(res.data);
    } catch (err) {
      console.error('Failed to load faculty list.', err);
    }
  };

  // Auto-fill Faculty Name when Faculty ID is typed/changed
  useEffect(() => {
    if (form.facultyId) {
      const match = facultyList.find(
        (f) => f.loginId.toLowerCase() === form.facultyId.toLowerCase()
      );
      if (match) {
        setForm((prev) => ({ ...prev, facultyName: match.name }));
      } else {
        setForm((prev) => ({ ...prev, facultyName: '' }));
      }
    } else {
      setForm((prev) => ({ ...prev, facultyName: '' }));
    }
  }, [form.facultyId, facultyList]);

  // Load subjects when branch + year + section change
  useEffect(() => {
    if (form.branch && form.year && form.section) {
      fetchSubjects();
    } else {
      setSubjects([]);
      setForm((prev) => ({ ...prev, subjectName: '' }));
    }
  }, [form.branch, form.year, form.section]);

  const fetchAllocations = async () => {
    setLoading(true);
    try {
      const res = await getAllocations();
      setAllocations(res.data);
    } catch (err) {
      setError('Failed to load allocations.');
    } finally {
      setLoading(false);
    }
  };

  const fetchSubjects = async () => {
    try {
      const res = await getSubjects({
        branch: form.branch,
        year: form.year,
        section: form.section,
      });
      setSubjects(res.data);
    } catch (err) {
      console.error('Failed to load subjects', err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editId) {
        await updateAllocation(editId, form);
        setSuccess('Faculty allocation updated successfully!');
      } else {
        await createAllocation(form);
        setSuccess('Faculty allocation created successfully!');
      }
      setForm({
        facultyId: '',
        facultyName: '',
        branch: '',
        year: '',
        section: '',
        subjectName: '',
      });
      setEditId(null);
      fetchAllocations();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save allocation.');
    }
  };

  const handleEdit = (row) => {
    setEditId(row._id);
    setForm({
      facultyId: (row.facultyId && typeof row.facultyId === 'object') ? row.facultyId.loginId : '',
      facultyName: row.facultyName,
      branch: row.branch,
      year: row.year.toString(),
      section: row.section,
      subjectName: row.subjectName,
    });
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this allocation?')) {
      try {
        await deleteAllocation(id);
        setSuccess('Allocation removed.');
        fetchAllocations();
      } catch (err) {
        setError('Failed to delete allocation.');
      }
    }
  };

  const columns = [
    {
      header: 'Faculty Name',
      accessor: 'facultyName',
      render: (row) => row.facultyName || row.facultyId?.name || 'N/A',
    },
    { header: 'Subject', accessor: 'subjectName' },
    { header: 'Branch', accessor: 'branch' },
    { header: 'Year', accessor: 'year' },
    { header: 'Section', accessor: 'section' },
    {
      header: 'Faculty ID',
      accessor: 'facultyId',
      render: (row) =>
        (row.facultyId && typeof row.facultyId === 'object') ? row.facultyId.loginId : (row.facultyId || 'N/A'),
    },
    {
      header: 'Actions',
      accessor: 'actions',
      render: (row) => (
        <div>
          <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(row)}>Edit</button>
          <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(row._id)}>Delete</button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="container py-4">
        <h2 className="fw-bold mb-4">Assign Faculty</h2>

        {/* Form */}
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-header bg-dark text-white fw-semibold">
            {editId ? '✏️ Edit Faculty Allocation' : '➕ New Faculty Allocation'}
          </div>
          <div className="card-body">
            {error && <div className="alert alert-danger py-2 small">{error}</div>}
            {success && <div className="alert alert-success py-2 small">{success}</div>}

            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Faculty ID</label>
                  <input
                    type="text"
                    className={`form-control ${form.facultyId && !facultyList.some((f) => f.loginId.toLowerCase() === form.facultyId.toLowerCase()) ? 'is-invalid' : ''}`}
                    name="facultyId"
                    value={form.facultyId}
                    onChange={handleChange}
                    placeholder="Enter 5-digit Faculty ID (e.g., 23325)"
                    required
                  />
                  <div className="form-text">The login ID of the faculty member</div>
                  {form.facultyId && !facultyList.some((f) => f.loginId.toLowerCase() === form.facultyId.toLowerCase()) && (
                    <div className="text-danger small mt-1 fw-semibold">⚠️ Faculty ID does not exist in database!</div>
                  )}
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Faculty Name</label>
                  <input
                    type="text"
                    className={`form-control ${form.facultyId && !form.facultyName ? 'is-invalid text-danger fw-semibold' : ''}`}
                    name="facultyName"
                    value={form.facultyName || (form.facultyId ? 'Faculty does not exist in database' : '')}
                    placeholder="Auto-filled from database"
                    required
                    readOnly
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-semibold">Branch</label>
                  <select
                    className="form-select"
                    name="branch"
                    value={form.branch}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Branch</option>
                    {BRANCHES.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-semibold">Year</label>
                  <select
                    className="form-select"
                    name="year"
                    value={form.year}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Year</option>
                    {YEARS.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-semibold">Section</label>
                  <select
                    className="form-select"
                    name="section"
                    value={form.section}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Section</option>
                    {SECTIONS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Subject</label>
                  <select
                    className="form-select"
                    name="subjectName"
                    value={form.subjectName}
                    onChange={handleChange}
                    required
                  >
                    <option value="">
                      {form.branch && form.year && form.section
                        ? subjects.length > 0
                          ? 'Select Subject'
                          : 'No subjects found for this combination'
                        : 'Select branch, year & section first'}
                    </option>
                    {subjects.map((s) => (
                      <option key={s._id} value={s.subjectName}>
                        {s.subjectName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-3">
                <button type="submit" className="btn btn-dark me-2">
                  {editId ? 'Update Allocation' : 'Assign Faculty'}
                </button>
                {editId && (
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => {
                      setEditId(null);
                      setForm({ facultyId: '', facultyName: '', branch: '', year: '', section: '', subjectName: '' });
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Existing Allocations */}
        <div className="card shadow-sm border-0">
          <div className="card-header bg-dark text-white fw-semibold">
            📋 Current Allocations ({allocations.length})
          </div>
          <div className="card-body p-0">
            {loading ? (
              <div className="text-center py-4">
                <div className="spinner-border" role="status" />
              </div>
            ) : (
              <Table columns={columns} data={allocations} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssignFaculty;
