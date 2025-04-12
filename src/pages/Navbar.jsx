import React from 'react';
import { NavLink } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { isAuthenticated, logout } = useAuth();

  return (
    isAuthenticated && (
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow">
        <div className="container">
          <a className="navbar-brand fw-bold" href="/">Visitor System</a>
          
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
            <ul className="navbar-nav mx-auto">
              <li className="nav-item px-2">
                <NavLink 
                  to="/" 
                  className={({ isActive }) => 
                    isActive ? "nav-link active fw-bold border-bottom border-light" : "nav-link"
                  }
                  end
                >
                  <i className="bi bi-house-door me-1"></i>
                  Visitor Entry Form
                </NavLink>
              </li>
              <li className="nav-item px-2">
                <NavLink 
                  to="/gatekeeper" 
                  className={({ isActive }) => 
                    isActive ? "nav-link active fw-bold border-bottom border-light" : "nav-link"
                  }
                >
                  <i className="bi bi-shield me-1"></i>
                  Gatekeeper Page
                </NavLink>
              </li>
              <li className="nav-item px-2">
                <NavLink 
                  to="/logs" 
                  className={({ isActive }) => 
                    isActive ? "nav-link active fw-bold border-bottom border-light" : "nav-link"
                  }
                >
                  <i className="bi bi-journal me-1"></i>
                  Visitor Logs
                </NavLink>
              </li>
            </ul>
            
            <div className="d-flex">
              <button 
                className="btn btn-outline-light rounded-pill px-3" 
                onClick={logout}
              >
                <i className="bi bi-box-arrow-right me-1"></i>
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
    )
  );
}

export default Navbar;