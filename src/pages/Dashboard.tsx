import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface DashboardMetric {
  label: string;
  value: number | string;
  change: number;
  icon: string;
}

interface RecentActivity {
  id: number;
  type: string;
  description: string;
  timestamp: string;
  status?: string;
}

interface SavedMolecule {
  id: number;
  name: string;
  smiles: string;
  bindingAffinity: number;
  drugLikeness: number;
}

const Dashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetric[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [savedMolecules, setSavedMolecules] = useState<SavedMolecule[]>([]);
  const [activeDatasets, setActiveDatasets] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API calls to fetch dashboard data
    const fetchDashboardData = async () => {
      setIsLoading(true);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock metrics data
      setMetrics([
        { 
          label: 'Molecules Analyzed', 
          value: 1248, 
          change: 12.5,
          icon: '🧪'
        },
        { 
          label: 'Binding Simulations', 
          value: 856, 
          change: 8.3,
          icon: '🔗'
        },
        { 
          label: 'Drug Candidates', 
          value: 37, 
          change: 4.2,
          icon: '💊'
        },
        { 
          label: 'Compute Hours', 
          value: '124.5', 
          change: -2.1,
          icon: '⏱️'
        }
      ]);
      
      // Mock recent activity
      setRecentActivity([
        {
          id: 1,
          type: 'analysis',
          description: 'ADMET analysis of Compound XYZ-123',
          timestamp: '2 hours ago',
          status: 'completed'
        },
        {
          id: 2,
          type: 'docking',
          description: 'Molecular docking with EGFR protein',
          timestamp: '5 hours ago',
          status: 'completed'
        },
        {
          id: 3,
          type: 'generation',
          description: 'Generated 50 novel molecules based on scaffold',
          timestamp: '1 day ago',
          status: 'completed'
        },
        {
          id: 4,
          type: 'import',
          description: 'Imported custom dataset from CSV',
          timestamp: '2 days ago',
          status: 'completed'
        },
        {
          id: 5,
          type: 'analysis',
          description: 'Lipinski rule analysis for batch molecules',
          timestamp: '3 days ago',
          status: 'failed'
        }
      ]);
      
      // Mock saved molecules
      setSavedMolecules([
        {
          id: 1,
          name: 'Compound A-123',
          smiles: 'CC(=O)OC1=CC=CC=C1C(=O)O',
          bindingAffinity: -9.2,
          drugLikeness: 0.85
        },
        {
          id: 2,
          name: 'EGFR-IN-01',
          smiles: 'CNC(=O)C1=NC=CC(=C1)OC2=CC=C(C=C2)NC(=O)NC3=CC(=C(C=C3)Cl)C(F)(F)F',
          bindingAffinity: -10.5,
          drugLikeness: 0.72
        },
        {
          id: 3,
          name: 'JAK2-MOD-7',
          smiles: 'CC1=C(C=C(C=C1)NC(=O)C2=CC=C(C=C2)CN3CCN(CC3)C)NC4=NC=CC(=N4)C5=CN=CC=C5',
          bindingAffinity: -8.7,
          drugLikeness: 0.91
        },
        {
          id: 4,
          name: 'Kinase Inhibitor X',
          smiles: 'COC1=C(C=C2C(=C1)C(=NC=N2)NC3=CC(=C(C=C3)F)Cl)OCCCN4CCOCC4',
          bindingAffinity: -9.8,
          drugLikeness: 0.68
        }
      ]);
      
      // Mock active datasets
      setActiveDatasets(['PubChem', 'BindingDB', 'DAVIS', 'KIBA', 'Custom Dataset (2)']);
      
      setIsLoading(false);
    };
    
    fetchDashboardData();
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'analysis': return '🔍';
      case 'docking': return '🔗';
      case 'generation': return '🧬';
      case 'import': return '📥';
      default: return '📋';
    }
  };

  const getStatusClass = (status?: string) => {
    switch (status) {
      case 'completed': return 'status-completed';
      case 'failed': return 'status-failed';
      case 'pending': return 'status-pending';
      default: return '';
    }
  };

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Dashboard</h1>
          <p className="welcome-message">Welcome back, Researcher! Here's your research overview.</p>
        </div>
        <div className="header-actions">
          <button className="action-button">
            <span>New Analysis</span>
          </button>
          <button className="action-button secondary">
            <span>Export Report</span>
          </button>
        </div>
      </header>
      
      {isLoading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading dashboard data...</p>
        </div>
      ) : (
        <div className="dashboard-content">
          <div className="metrics-grid">
            {metrics.map((metric, index) => (
              <div key={index} className="metric-card">
                <div className="metric-icon">{metric.icon}</div>
                <div className="metric-details">
                  <h3 className="metric-value">{metric.value}</h3>
                  <p className="metric-label">{metric.label}</p>
                  <div className={`metric-change ${metric.change >= 0 ? 'positive' : 'negative'}`}>
                    {metric.change >= 0 ? '↑' : '↓'} {Math.abs(metric.change)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="dashboard-grid">
            <div className="dashboard-card recent-activity">
              <div className="card-header">
                <h2>Recent Activity</h2>
                <Link to="/activity" className="view-all">View All</Link>
              </div>
              <div className="activity-list">
                {recentActivity.map(activity => (
                  <div key={activity.id} className="activity-item">
                    <div className="activity-icon">{getActivityIcon(activity.type)}</div>
                    <div className="activity-details">
                      <p className="activity-description">{activity.description}</p>
                      <span className="activity-timestamp">{activity.timestamp}</span>
                    </div>
                    {activity.status && (
                      <div className={`activity-status ${getStatusClass(activity.status)}`}>
                        {activity.status}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="dashboard-card saved-molecules">
              <div className="card-header">
                <h2>Saved Molecules</h2>
                <Link to="/molecule-analysis" className="view-all">View All</Link>
              </div>
              <div className="molecules-list">
                {savedMolecules.map(molecule => (
                  <div key={molecule.id} className="molecule-item">
                    <div className="molecule-name">{molecule.name}</div>
                    <div className="molecule-smiles" title={molecule.smiles}>
                      {molecule.smiles.length > 30 ? molecule.smiles.substring(0, 30) + '...' : molecule.smiles}
                    </div>
                    <div className="molecule-metrics">
                      <div className="molecule-metric">
                        <span className="metric-label">Binding:</span>
                        <span className="metric-value">{molecule.bindingAffinity} kcal/mol</span>
                      </div>
                      <div className="molecule-metric">
                        <span className="metric-label">Drug-likeness:</span>
                        <span className="metric-value">{molecule.drugLikeness.toFixed(2)}</span>
                      </div>
                    </div>
                    <Link to={`/molecule-analysis?smiles=${encodeURIComponent(molecule.smiles)}`} className="view-molecule">
                      Analyze
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="dashboard-footer">
            <div className="dashboard-card datasets-overview">
              <div className="card-header">
                <h2>Active Datasets</h2>
                <Link to="/settings" className="view-all">Manage</Link>
              </div>
              <div className="datasets-list">
                {activeDatasets.map((dataset, index) => (
                  <div key={index} className="dataset-badge">
                    {dataset}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="dashboard-card quick-actions">
              <div className="card-header">
                <h2>Quick Actions</h2>
              </div>
              <div className="actions-grid">
                <Link to="/molecular-generation" className="action-card">
                  <div className="action-icon">🧪</div>
                  <div className="action-label">Generate Molecules</div>
                </Link>
                <Link to="/molecule-analysis" className="action-card">
                  <div className="action-icon">🔍</div>
                  <div className="action-label">Analyze Structure</div>
                </Link>
                <Link to="/drug-design" className="action-card">
                  <div className="action-icon">💊</div>
                  <div className="action-label">Design Drug</div>
                </Link>
                <Link to="/graph-discovery" className="action-card">
                  <div className="action-icon">🔗</div>
                  <div className="action-label">Explore Relationships</div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 