import React from 'react';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <div className="navbar-logo-icon">K</div>
        <span className="navbar-logo-text">KoinX</span>
        <span className="navbar-badge">Beta</span>
      </div>
      <div className="navbar-spacer" />
      <span className="navbar-fy-pill">FY 2024–25</span>
      <div className="navbar-user">
        <span className="navbar-user-name">{user?.name}</span>
        <div className="navbar-avatar">
          {user?.avatar
            ? <img src={user.avatar} alt={user.name} />
            : (user?.name?.[0] || 'U').toUpperCase()
          }
        </div>
        <button className="btn-logout" onClick={logout}>Sign out</button>
      </div>
    </nav>
  );
};
