import React from 'react';
import '../Styles/style.css';
import { NavLink, useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "http://localhost:3001";
  };

  const navItems = [
    { to: "/home", icon: "bi-grid-1x2", label: "Dashboard" },
    { to: "/user", icon: "bi-people", label: "Users" },
    { to: "/product", icon: "bi-award", label: "Products" },
    { to: "/order", icon: "bi-cart", label: "Orders" },
    { to: "/blogs", icon: "bi-journal-text", label: "Blog" },
    { to: "/contact", icon: "bi-chat-dots", label: "Inquiries" },
    { to: "/subscribers", icon: "bi-envelope-paper", label: "Newsletter" },
  ];

  // Mobile bottom nav shows only 5 items max for usability
  const mobileNavItems = [
    { to: "/home", icon: "bi-grid-1x2", label: "Home" },
    { to: "/product", icon: "bi-award", label: "Products" },
    { to: "/order", icon: "bi-cart", label: "Orders" },
    { to: "/user", icon: "bi-people", label: "Users" },
    { to: "/blogs", icon: "bi-journal-text", label: "Blog" },
  ];

  return (
    <>
      {/* ===== DESKTOP / TABLET SIDEBAR ===== */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <h2><span>KUSHI</span> ADMIN</h2>
        </div>

        <nav className="sidebar-nav">
          <ul>
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) => `no-decoration ${isActive ? 'active' : ''}`}
                  title={item.label}
                >
                  <i className={`bi ${item.icon}`}></i>
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="logout">
          <div className="logout-btn" onClick={handleLogout} title="Logout">
            <i className="bi bi-box-arrow-right me-3"></i>
            <span>Exit Concierge</span>
          </div>
        </div>
      </aside>

      {/* ===== MOBILE BOTTOM NAVIGATION ===== */}
      <nav className="mobile-bottom-nav">
        {mobileNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => isActive ? 'active' : ''}
            title={item.label}
          >
            <i className={`bi ${item.icon}`}></i>
            <span>{item.label}</span>
          </NavLink>
        ))}
        <button className="mobile-nav-btn" onClick={handleLogout} title="Logout">
          <i className="bi bi-box-arrow-right"></i>
          <span>Exit</span>
        </button>
      </nav>
    </>
  );
}

export default Sidebar;
