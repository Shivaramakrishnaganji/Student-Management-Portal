import { useState, useEffect } from 'react';
import Table from '../components/Table';
import { getStudents, createStudent, updateStudent, deleteStudent } from '../services/api';

const BRANCHES = ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL'];
const YEARS = [1, 2, 3, 4];
const SECTIONS = ['A', 'B', 'C'];

const emptyForm = {
  rollNumber: '',
  name: '',
  branch: '',
  year: '',
  section: '',
};

function ManageStudents({ user, onLogout }) {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await getStudents();
      setStudents(res.data);
    } catch (err) {
      setError('Failed to load students.');
    } finally {
      setLoading(false);
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
      if (editingId) {
        const { password, ...updateData } = form;
        if (password) updateData.password = password;
        await updateStudent(editingId, updateData);
        setSuccess('Student updated successfully!');
      } else {
        await createStudent(form);
        setSuccess('Student added successfully!');
      }
      setForm(emptyForm);
      setEditingId(null);
      fetchStudents();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed.');
    }
  };

  const handleEdit = (student) => {
    setEditingId(student._id);
    setForm({
      rollNumber: student.rollNumber || '',
      name: student.name || '',
      branch: student.branch || '',
      year: student.year || '',
      section: student.section || '',
    });
    setError('');
    setSuccess('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;
    setError('');
    setSuccess('');
    try {
      await deleteStudent(id);
      setSuccess('Student deleted successfully!');
      fetchStudents();
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed.');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError('');
    setSuccess('');
  };

  const columns = [
    { header: 'Roll Number', accessor: 'rollNumber' },
    { header: 'Name', accessor: 'name' },
    { header: 'Branch', accessor: 'branch' },
    { header: 'Year', accessor: 'year' },
    { header: 'Section', accessor: 'section' },
    {
      header: 'Actions',
      accessor: '_id',
      render: (row) => (
        <div className="d-flex gap-2">
          <button className="btn btn-sm btn-outline-dark" onClick={() => handleEdit(row)}>
            ✏️ Edit
          </button>
          <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(row._id)}>
            🗑️ Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="container py-4">
        <h2 className="fw-bold mb-4">Manage Students</h2>

        {/* Form */}
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-header bg-dark text-white fw-semibold">
            {editingId ? '✏️ Update Student' : '➕ Add New Student'}
          </div>
          <div className="card-body">
            {error && <div className="alert alert-danger py-2 small">{error}</div>}
            {success && <div className="alert alert-success py-2 small">{success}</div>}

            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label fw-semibold">Roll Number</label>
                  <input
                    type="text"
                    className="form-control"
                    name="rollNumber"
                    value={form.rollNumber}
                    onChange={handleChange}
                    placeholder="e.g. 21CS001"
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-semibold">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Full name"
                    required
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
              </div>

              <div className="mt-3 d-flex gap-2">
                <button type="submit" className="btn btn-dark">
                  {editingId ? 'Update Student' : 'Add Student'}
                </button>
                {editingId && (
                  <button type="button" className="btn btn-outline-secondary" onClick={handleCancel}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Table */}
        <div className="card shadow-sm border-0">
          <div className="card-header bg-dark text-white fw-semibold">
            📋 All Students ({students.length})
          </div>
          <div className="card-body p-0">
            {loading ? (
              <div className="text-center py-4">
                <div className="spinner-border" role="status" />
              </div>
            ) : (
              <Table columns={columns} data={students} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageStudents;
