import React from 'react'
import { NavLink } from 'react-router-dom'

interface SidebarProps {
  isOpen: boolean
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-content">
        <ul className="sidebar-menu">
          <li>
            <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>
              <span className="icon">📊</span>
              <span className="label">Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/molecular-generation" className={({ isActive }) => isActive ? 'active' : ''}>
              <span className="icon">🧪</span>
              <span className="label">Molecular Generation</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/knowledge-base" className={({ isActive }) => isActive ? 'active' : ''}>
              <span className="icon">📚</span>
              <span className="label">Knowledge Base</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/testing" className={({ isActive }) => isActive ? 'active' : ''}>
              <span className="icon">🧬</span>
              <span className="label">Testing & Validation</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/graph-discovery" className={({ isActive }) => isActive ? 'active' : ''}>
              <span className="icon">🕸️</span>
              <span className="label">Graph Discovery</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/drug-design" className={({ isActive }) => isActive ? 'active' : ''}>
              <span className="icon">💊</span>
              <span className="label">Drug Design</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/settings" className={({ isActive }) => isActive ? 'active' : ''}>
              <span className="icon">⚙️</span>
              <span className="label">Settings</span>
            </NavLink>
          </li>
        </ul>
      </div>
      <div className="sidebar-footer">
        <div className="version">MediGraph Agent v1.0.0</div>
      </div>
    </aside>
  )
}

export default Sidebar 