import { Link } from 'react-router-dom';

function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar navbar-expand-lg custom-navbar">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">🎓 Student Portal</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            {user?.role === 'admin' && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin">Dashboard</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/students">Students</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/subjects">Subjects</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/faculty">Add Faculty</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/assign">Assign</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/bunkers">Bunkers</Link>
                </li>
              </>
            )}
            {user?.role === 'faculty' && (
              <>
                <li className="nav-item"><Link className="nav-link" to="/faculty">Mark Attendance</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/faculty/view-attendance">View Attendance</Link></li>
              </>
            )}
            {user?.role === 'student' && (
              <li className="nav-item"><Link className="nav-link" to="/student">My Dashboard</Link></li>
            )}
          </ul>
          <div className="navbar-user-section d-flex align-items-center gap-2 mt-lg-0 mt-2 pt-lg-0 pt-2" style={{ borderTop: 'none' }}>
            <span className="navbar-text" style={{ fontSize: '0.82rem' }}>
              👤 {user?.name} <span className="badge" style={{ background: 'var(--primary-light)', color: 'var(--primary)', fontSize: '0.7rem', borderRadius: '6px', padding: '3px 8px', fontWeight: 600 }}>{user?.role}</span>
            </span>
            <button className="btn btn-outline-light btn-sm" onClick={onLogout}>Logout</button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

