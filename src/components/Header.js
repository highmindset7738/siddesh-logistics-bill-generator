import React from 'react';
import './Header.css';

const Header = ({ currentPage, onNavigate }) => {
  return (
    <header className="app-header">
      <div className="header-content">
        <h1>🚛 Siddesh Logistics</h1>
        <nav className="header-nav">
          <button 
            className={`nav-btn ${currentPage === 'form' ? 'active' : ''}`}
            onClick={() => onNavigate('form')}
          >
            📝 Create Bill
          </button>
          <button 
            className={`nav-btn ${currentPage === 'history' ? 'active' : ''}`}
            onClick={() => onNavigate('history')}
          >
            📋 Bills History
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
