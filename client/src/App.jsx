import { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { getMe } from './services/api';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import ManageStudents from './pages/ManageStudents';
import ManageSubjects from './pages/ManageSubjects';
import ManageFaculty from './pages/ManageFaculty';
import AssignFaculty from './pages/AssignFaculty';
import ViewStudents from './pages/ViewStudents';
import ViewFaculty from './pages/ViewFaculty';
import MarkAttendance from './pages/MarkAttendance';
import FacultyViewAttendance from './pages/FacultyViewAttendance';
import AdminBunkersList from './pages/AdminBunkersList';
import StudentDashboard from './pages/StudentDashboard';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const userId = localStorage.getItem('userId');
      if (userId) {
        try {
          const { data } = await getMe();
          setUser(data);
        } catch (error) {
          localStorage.removeItem('userId');
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = useCallback(() => {
    localStorage.removeItem('userId');
    setUser(null);
    navigate('/');
  }, [navigate]);

  // Auto-logout after 10 minutes of inactivity
  useEffect(() => {
    let timeoutId;

    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (user) {
          alert('Session expired due to 10 minutes of inactivity. Please log in again.');
          handleLogout();
        }
      }, 600000); // 10 minutes in milliseconds
    };

    if (user) {
      resetTimer(); // Start the timer initially when logged in
      const events = ['mousemove', 'keydown', 'mousedown', 'scroll', 'touchstart'];
      
      events.forEach((event) => window.addEventListener(event, resetTimer));

      return () => {
        clearTimeout(timeoutId);
        events.forEach((event) => window.removeEventListener(event, resetTimer));
      };
    }
  }, [user, handleLogout]);

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <div>
      {user && <Navbar user={user} onLogout={handleLogout} />}
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={!user ? <Login onLogin={handleLogin} /> : <Navigate to={`/${user.role === 'admin' ? 'admin' : user.role}`} />} />
          
          {/* Admin Routes */}
          {user?.role === 'admin' && (
            <>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/students" element={<ManageStudents user={user} onLogout={handleLogout} />} />
              <Route path="/admin/subjects" element={<ManageSubjects user={user} onLogout={handleLogout} />} />
              <Route path="/admin/faculty" element={<ManageFaculty user={user} onLogout={handleLogout} />} />
              <Route path="/admin/assign" element={<AssignFaculty user={user} onLogout={handleLogout} />} />
              <Route path="/admin/view-students" element={<ViewStudents user={user} onLogout={handleLogout} />} />
              <Route path="/admin/view-faculty" element={<ViewFaculty user={user} onLogout={handleLogout} />} />
              <Route path="/admin/bunkers" element={<AdminBunkersList />} />
            </>
          )}

          {/* Faculty Routes */}
          {user?.role === 'faculty' && (
            <>
              <Route path="/faculty" element={<MarkAttendance user={user} />} />
              <Route path="/faculty/view-attendance" element={<FacultyViewAttendance user={user} />} />
            </>
          )}

          {/* Student Routes */}
          {user?.role === 'student' && (
            <Route path="/student" element={<StudentDashboard user={user} />} />
          )}

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
