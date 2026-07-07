import { useState } from 'react';
import Table from '../components/Table';
import { getFacultyList } from '../services/api';

const BRANCHES = ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL'];

function ViewFaculty() {
  const [branch, setBranch] = useState('');
  const [facultyData, setFacultyData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setHasSearched(true);
    
    try {
      // Fetch faculty list for the selected branch directly from User table
      const res = await getFacultyList({ branch });
      setFacultyData(res.data);
    } catch (err) {
      setError('Failed to fetch faculty data.');
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
    { header: 'Faculty ID', accessor: 'loginId' },
    { header: 'Faculty Name', accessor: 'name' },
    {
      header: 'Subjects Assigned',
      accessor: 'subjectsAssigned',
      render: (row) => row.subjectsAssigned || 'None',
    },
    { header: 'Total Assigned', accessor: 'totalAssigned' },
  ];

  return (
    <div>
      <div className="container py-4">
        <h2 className="fw-bold mb-4">View Faculty</h2>

        {/* Filter Form */}
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-header bg-dark text-white fw-semibold">
            🔍 Filter Faculty by Branch
          </div>
          <div className="card-body">
            {error && <div className="alert alert-danger py-2 small">{error}</div>}
            
            <form onSubmit={handleSearch}>
              <div className="row g-3 align-items-end">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Branch</label>
                  <select className="form-select" value={branch} onChange={(e) => setBranch(e.target.value)} required>
                    <option value="">Select Branch</option>
                    {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div className="col-md-6">
                  <button type="submit" className="btn btn-dark w-100" disabled={loading}>
                    {loading ? 'Searching...' : 'Show Faculty'}
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
              📋 Faculty List ({facultyData.length})
            </div>
            <div className="card-body p-0">
              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border" role="status" />
                </div>
              ) : facultyData.length === 0 ? (
                <div className="text-center py-4 text-muted">No faculty found for this branch.</div>
              ) : (
                <Table columns={columns} data={facultyData} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewFaculty;
