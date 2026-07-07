import { useState } from 'react';
import Table from '../components/Table';
import { getStudents } from '../services/api';

const BRANCHES = ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL'];
const YEARS = [1, 2, 3, 4];
const SECTIONS = ['A', 'B', 'C'];

function ViewStudents() {
  const [form, setForm] = useState({ branch: '', year: '', section: '' });
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setHasSearched(true);
    
    try {
      const res = await getStudents(form);
      setStudents(res.data);
    } catch (err) {
      setError('Failed to fetch students.');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      header: 'SNO',
      accessor: 'sno',
      render: (_, index) => index + 1,
    },
    { header: 'RollNo', accessor: 'rollNumber' },
    { header: 'Student Name', accessor: 'name' },
  ];

  return (
    <div>
      <div className="container py-4">
        <h2 className="fw-bold mb-4">View Students</h2>

        {/* Filter Form */}
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-header bg-dark text-white fw-semibold">
            🔍 Filter Students by Class
          </div>
          <div className="card-body">
            {error && <div className="alert alert-danger py-2 small">{error}</div>}
            
            <form onSubmit={handleSearch}>
              <div className="row g-3 align-items-end">
                <div className="col-md-3">
                  <label className="form-label fw-semibold">Branch</label>
                  <select className="form-select" name="branch" value={form.branch} onChange={handleChange} required>
                    <option value="">Select Branch</option>
                    {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label fw-semibold">Year</label>
                  <select className="form-select" name="year" value={form.year} onChange={handleChange} required>
                    <option value="">Select Year</option>
                    {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label fw-semibold">Section</label>
                  <select className="form-select" name="section" value={form.section} onChange={handleChange} required>
                    <option value="">Select Section</option>
                    {SECTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="col-md-3">
                  <button type="submit" className="btn btn-dark w-100" disabled={loading}>
                    {loading ? 'Searching...' : 'Show Students'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Results */}
        {hasSearched && (
          <div className="card shadow-sm border-0">
            <div className="card-header bg-dark text-white fw-semibold">
              📋 Students List ({students.length})
            </div>
            <div className="card-body p-0">
              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border" role="status" />
                </div>
              ) : students.length === 0 ? (
                <div className="text-center py-4 text-muted">No students found for this class.</div>
              ) : (
                <Table columns={columns} data={students} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewStudents;
