import React from 'react'
import { Link } from 'react-router-dom'

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard">
      <header className="page-header">
        <h1>MediGraph Agent Dashboard</h1>
        <p>AI-powered drug discovery toolkit</p>
      </header>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Active Projects</h3>
          <div className="stat-value">12</div>
        </div>
        <div className="stat-card">
          <h3>Generated Molecules</h3>
          <div className="stat-value">24,583</div>
        </div>
        <div className="stat-card">
          <h3>Promising Candidates</h3>
          <div className="stat-value">47</div>
        </div>
        <div className="stat-card">
          <h3>Knowledge Base Entries</h3>
          <div className="stat-value">1.2M</div>
        </div>
      </div>

      <div className="module-grid">
        <Link to="/molecular-generation" className="module-card">
          <div className="module-icon">🧪</div>
          <h3>Molecular Generation</h3>
          <p>Generate novel drug compounds using AI</p>
        </Link>
        <Link to="/knowledge-base" className="module-card">
          <div className="module-icon">📚</div>
          <h3>Knowledge Base</h3>
          <p>Explore biomedical data and relationships</p>
        </Link>
        <Link to="/testing" className="module-card">
          <div className="module-icon">🧬</div>
          <h3>Testing & Validation</h3>
          <p>Validate compounds with in-silico methods</p>
        </Link>
        <Link to="/graph-discovery" className="module-card">
          <div className="module-icon">🕸️</div>
          <h3>Graph Discovery</h3>
          <p>Explore drug-target-disease relationships</p>
        </Link>
      </div>

      <div className="dashboard-sections">
        <div className="recent-activity">
          <h2>Recent Activity</h2>
          <ul className="activity-list">
            <li>
              <span className="activity-time">10:45 AM</span>
              <span className="activity-description">Generated 1,000 new molecules for Project Alpha</span>
            </li>
            <li>
              <span className="activity-time">Yesterday</span>
              <span className="activity-description">Validated 5 compounds against target protein PTEN</span>
            </li>
            <li>
              <span className="activity-time">2 days ago</span>
              <span className="activity-description">Added 3 new proteins to knowledge base</span>
            </li>
          </ul>
        </div>
        
        <div className="recommended-actions">
          <h2>Recommended Actions</h2>
          <div className="action-cards">
            <div className="action-card">
              <h4>Review Promising Candidates</h4>
              <p>5 compounds show high binding affinity to target</p>
              <button>Review Now</button>
            </div>
            <div className="action-card">
              <h4>Continue Molecule Optimization</h4>
              <p>Project Beta needs refinement for toxicity</p>
              <button>Continue</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard 