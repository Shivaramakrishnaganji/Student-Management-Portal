import { Link } from 'react-router-dom';

function AdminDashboard({ user, onLogout }) {
  const cards = [
    {
      title: 'Manage Students',
      description: 'Add, edit, and remove student records. View all enrolled students.',
      emoji: '👨‍🎓',
      link: '/admin/students',
    },
    {
      title: 'Manage Subjects',
      description: 'Create and organize subjects by branch, year, and section.',
      emoji: '📚',
      link: '/admin/subjects',
    },
    {
      title: 'Add Faculty',
      description: 'Create new faculty accounts and generate their 2FA setup keys.',
      emoji: '👤',
      link: '/admin/faculty',
    },
    {
      title: 'Assign Faculty',
      description: 'Allocate faculty members to subjects and class sections.',
      emoji: '👨‍🏫',
      link: '/admin/assign',
    },
    {
      title: 'View Students',
      description: 'Query and view student lists by branch, year, and section.',
      emoji: '📋',
      link: '/admin/view-students',
    },
    {
      title: 'View Faculty',
      description: 'View faculty assignments grouped by branch.',
      emoji: '📊',
      link: '/admin/view-faculty',
    },
  ];

  return (
    <div>
      <div className="container py-4">
        <div className="mb-4">
          <h2 className="fw-bold">Admin Dashboard</h2>
          <p className="text-muted">Welcome back, {user?.name || 'Admin'}. Manage your portal below.</p>
        </div>

        <div className="row g-4">
          {cards.map((card, index) => (
            <div className="col-md-4" key={index}>
              <Link to={card.link} className="text-decoration-none">
                <div className="card h-100 shadow-sm border-0 dashboard-card">
                  <div className="card-body text-center p-4">
                    <div style={{ fontSize: '3rem' }} className="mb-3">
                      {card.emoji}
                    </div>
                    <h5 className="card-title fw-bold text-dark">{card.title}</h5>
                    <p className="card-text text-muted small">{card.description}</p>
                  </div>
                  <div className="card-footer bg-dark text-white text-center py-2">
                    Go to {card.title} →
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
