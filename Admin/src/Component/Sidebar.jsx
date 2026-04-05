import React from 'react';
import '../Styles/style.css';
import { NavLink, useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear cookies or tokens here if needed
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "http://localhost:3001"; // Or wherever your main login is
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2><span>KUSHI</span> ADMIN</h2>
      </div>

      <nav className="sidebar-nav">
        <ul>
          <li>
            <NavLink to="/home" className={({ isActive }) => `no-decoration ${isActive ? 'active' : ''}`}>
              <i className="bi bi-grid-1x2"></i>
              <span>Dashboard Overview</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/user" className={({ isActive }) => `no-decoration ${isActive ? 'active' : ''}`}>
              <i className="bi bi-people"></i>
              <span>User Curation</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/product" className={({ isActive }) => `no-decoration ${isActive ? 'active' : ''}`}>
              <i className="bi bi-award"></i>
              <span>Artisanal Products</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/order" className={({ isActive }) => `no-decoration ${isActive ? 'active' : ''}`}>
              <i className="bi bi-cart"></i>
              <span>KUSHI Orders</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/blogs" className={({ isActive }) => `no-decoration ${isActive ? 'active' : ''}`}>
              <i className="bi bi-journal-text"></i>
              <span>Journal & Blog</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/contact" className={({ isActive }) => `no-decoration ${isActive ? 'active' : ''}`}>
              <i className="bi bi-chat-dots"></i>
              <span>Client Inquiries</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/subscribers" className={({ isActive }) => `no-decoration ${isActive ? 'active' : ''}`}>
              <i className="bi bi-envelope-paper"></i>
              <span>Newsletter Curators</span>
            </NavLink>
          </li>
        </ul>
      </nav>

      <div className="logout">
        <div className="logout-btn" onClick={handleLogout}>
          <i className="bi bi-box-arrow-right me-3"></i>
          <span>Exit Concierge</span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
