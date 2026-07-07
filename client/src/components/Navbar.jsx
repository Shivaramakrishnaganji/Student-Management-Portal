import { Link } from 'react-router-dom';

function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar navbar-expand-lg custom-navbar">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">Student Management Portal</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
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
                  <Link className="nav-link" to="/admin/students">Manage Students</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/subjects">Manage Subjects</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/faculty">Add Faculty</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/assign">Assign Faculty</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/bunkers">Bunkers List</Link>
                </li>
              </>)}
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
          <span className="navbar-text me-3">
            {user?.name} ({user?.role})
          </span>
          <button className="btn btn-outline-light btn-sm" onClick={onLogout}>Logout</button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
