import { useState, useEffect } from 'react';
import Table from '../components/Table';
import { getSubjects, createSubject } from '../services/api';

const BRANCHES = ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL'];
const YEARS = [1, 2, 3, 4];
const SECTIONS = ['A', 'B', 'C'];

function ManageSubjects({ user, onLogout }) {
  const [subjects, setSubjects] = useState([]);
  const [form, setForm] = useState({ subjectName: '', branch: '', year: '', section: '' });
  const [filter, setFilter] = useState({ branch: '', year: '', section: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchSubjects();
  }, [filter]);

  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter.branch) params.branch = filter.branch;
      if (filter.year) params.year = filter.year;
      if (filter.section) params.section = filter.section;
      const res = await getSubjects(params);
      setSubjects(res.data);
    } catch (err) {
      setError('Failed to load subjects.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFilterChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await createSubject(form);
      setSuccess('Subject added successfully!');
      setForm({ subjectName: '', branch: '', year: '', section: '' });
      fetchSubjects();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add subject.');
    }
  };

  const columns = [
    { header: 'Subject Name', accessor: 'subjectName' },
    { header: 'Branch', accessor: 'branch' },
    { header: 'Year', accessor: 'year' },
    { header: 'Section', accessor: 'section' },
  ];

  return (
    <div>
      <div className="container py-4">
        <h2 className="fw-bold mb-4">Manage Subjects</h2>

        {/* Add Subject Form */}
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-header bg-dark text-white fw-semibold">➕ Add New Subject</div>
          <div className="card-body">
            {error && <div className="alert alert-danger py-2 small">{error}</div>}
            {success && <div className="alert alert-success py-2 small">{success}</div>}

            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-3">
                  <label className="form-label fw-semibold">Subject Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="subjectName"
                    value={form.subjectName}
                    onChange={handleChange}
                    placeholder="e.g. Data Structures"
                    required
                  />
                </div>
                <div className="col-md-3">
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
                <div className="col-md-3">
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
                <div className="col-md-3">
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
              </div>
              <div className="mt-3">
                <button type="submit" className="btn btn-dark">Add Subject</button>
              </div>
            </form>
          </div>
        </div>

        {/* Filter */}
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-header bg-secondary text-white fw-semibold">🔍 Filter Subjects</div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-4">
                <select
                  className="form-select"
                  name="branch"
                  value={filter.branch}
                  onChange={handleFilterChange}
                >
                  <option value="">All Branches</option>
                  {BRANCHES.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-4">
                <select
                  className="form-select"
                  name="year"
                  value={filter.year}
                  onChange={handleFilterChange}
                >
                  <option value="">All Years</option>
                  {YEARS.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-4">
                <select
                  className="form-select"
                  name="section"
                  value={filter.section}
                  onChange={handleFilterChange}
                >
                  <option value="">All Sections</option>
                  {SECTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="card shadow-sm border-0">
          <div className="card-header bg-dark text-white fw-semibold">
            📋 Subjects ({subjects.length})
          </div>
          <div className="card-body p-0">
            {loading ? (
              <div className="text-center py-4">
                <div className="spinner-border" role="status" />
              </div>
            ) : (
              <Table columns={columns} data={subjects} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageSubjects;
