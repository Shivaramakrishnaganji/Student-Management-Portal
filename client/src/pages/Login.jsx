import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as loginAPI } from '../services/api';

function Login({ onLogin }) {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await loginAPI(loginId, password);
      const user = res.data.user;
      localStorage.setItem('userId', user.id);
      
      onLogin(user);

      // Redirect based on role
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'faculty') navigate('/faculty');
      else if (user.role === 'student') navigate('/student');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page d-flex align-items-center justify-content-center min-vh-100">
      <div className="card login-card shadow" style={{ width: '100%', maxWidth: '420px' }}>
        <div className="card-body p-4 p-md-5">
          <div className="text-center mb-4">
            <h3 className="fw-bold mb-1">🎓 Student Management Portal</h3>
            <p className="text-muted small">Sign in to your account</p>
          </div>

          {error && (
            <div className="alert alert-danger py-2 small" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="loginId" className="form-label fw-semibold">
                User ID
              </label>
              <input
                type="text"
                className="form-control"
                id="loginId"
                placeholder="Enter your user id"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="form-label fw-semibold">
                Password / 6-digit Code
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Student: Password | Admin/Faculty: Google Authenticator Code"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="form-text small">
                * Admins and Faculty: Enter the 6-digit code from Google Authenticator.
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-dark w-100 py-2 fw-semibold"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
