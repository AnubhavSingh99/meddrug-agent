import React from 'react'
import { Link } from 'react-router-dom'

interface NavbarProps {
  setSidebarOpen: (isOpen: boolean) => void
  sidebarOpen: boolean
}

const Navbar: React.FC<NavbarProps> = ({ setSidebarOpen, sidebarOpen }) => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button 
          className="sidebar-toggle" 
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          ☰
        </button>
        <Link to="/" className="logo">
          <h1>MedGraph Agent</h1>
        </Link>
      </div>
      <div className="navbar-center">
        <div className="search-container">
          <input 
            type="text" 
            placeholder="Search compounds, proteins, or diseases..." 
            className="search-input"
          />
          <button className="search-button">🔍</button>
        </div>
      </div>
      <div className="navbar-right">
        <button className="nav-button">Help</button>
        <button className="nav-button">Notifications</button>
        <div className="user-profile">
          <img src="/user-avatar.png" alt="User" className="avatar" />
          <span>Researcher</span>
        </div>
      </div>
    </nav>
  )
}

export default Navbar 