import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            Agent List Distributor
          </div>
          <nav className="nav">
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/add-agent">Add Agent</Link>
            <Link to="/upload-list">Upload List</Link>
            <Link to="/view-distribution">View Distribution</Link>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
