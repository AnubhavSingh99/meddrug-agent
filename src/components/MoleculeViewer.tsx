import React, { useState } from 'react';
import { Molecule } from '../data/molecules';
import { useComputation } from '../context/ComputationContext';

interface MoleculeViewerProps {
  molecule: Molecule;
  onClose: () => void;
}

const MoleculeViewer: React.FC<MoleculeViewerProps> = ({ molecule, onClose }) => {
  const { submitDockingJob, submitDynamicsJob } = useComputation();
  const [activeTab, setActiveTab] = useState<'structure' | 'properties' | 'docking'>('structure');
  const [selectedTarget, setSelectedTarget] = useState('');
  const [isRunningJob, setIsRunningJob] = useState(false);
  const [jobResult, setJobResult] = useState<any>(null);

  const handleRunDocking = async () => {
    if (!selectedTarget) return;
    
    setIsRunningJob(true);
    
    try {
      const jobId = await submitDockingJob(molecule.id, selectedTarget);
      
      // In a real app, you would monitor the job and update the UI
      // For the MVP, we'll simulate a completed job after a delay
      setTimeout(() => {
        setJobResult({
          bindingAffinity: -9.8,
          interactionSites: ['GLU353', 'ARG394', 'HIS524'],
          poseCount: 9,
          bestPose: '/docking/pose1.png',
        });
        setIsRunningJob(false);
      }, 3000);
    } catch (error) {
      console.error('Error running docking:', error);
      setIsRunningJob(false);
    }
  };

  const handleRunOptimization = async () => {
    setIsRunningJob(true);
    
    try {
      const jobId = await submitDynamicsJob(molecule.id);
      
      // Simulate a completed job after a delay
      setTimeout(() => {
        setJobResult({
          optimizedStructure: '/molecules/optimized.png',
          energyChange: -12.4,
          rmsd: 0.8,
        });
        setIsRunningJob(false);
      }, 3000);
    } catch (error) {
      console.error('Error running optimization:', error);
      setIsRunningJob(false);
    }
  };

  return (
    <div className="molecule-viewer">
      <div className="viewer-header">
        <h2>{molecule.name}</h2>
        <div className="viewer-tabs">
          <button 
            className={`tab-btn ${activeTab === 'structure' ? 'active' : ''}`}
            onClick={() => setActiveTab('structure')}
          >
            Structure
          </button>
          <button 
            className={`tab-btn ${activeTab === 'properties' ? 'active' : ''}`}
            onClick={() => setActiveTab('properties')}
          >
            Properties
          </button>
          <button 
            className={`tab-btn ${activeTab === 'docking' ? 'active' : ''}`}
            onClick={() => setActiveTab('docking')}
          >
            Docking
          </button>
        </div>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>
      
      <div className="viewer-content">
        {activeTab === 'structure' && (
          <>
            <div className="molecule-3d-view">
              {molecule.structure_url ? (
                <img 
                  src={molecule.structure_url} 
                  alt={molecule.name} 
                  className="structure-image"
                />
              ) : (
                <div className="structure-placeholder">
                  3D Structure Visualization
                </div>
              )}
            </div>
            
            <div className="molecule-details">
              <div className="detail-group">
                <h3>Molecular Properties</h3>
                <div className="detail-row">
                  <span className="detail-label">SMILES:</span>
                  <span className="detail-value smiles-code">{molecule.SMILES}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Status:</span>
                  <span className={`status-badge status-${molecule.Status.toLowerCase()}`}>
                    {molecule.Status}
                  </span>
                </div>
              </div>
              
              <div className="detail-group">
                <h3>Performance Metrics</h3>
                <div className="metrics-grid">
                  <div className="metric-card">
                    <div className="metric-value">{molecule.Binding_Affinity.toFixed(1)}</div>
                    <div className="metric-label">Binding Affinity (kcal/mol)</div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-value">{molecule.ADMET_Score.toFixed(1)}</div>
                    <div className="metric-label">ADMET Score</div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-value">{molecule.Similarity_Score.toFixed(1)}%</div>
                    <div className="metric-label">Similarity Score</div>
                  </div>
                </div>
              </div>
              
              <div className="detail-group">
                <h3>Actions</h3>
                <div className="action-buttons">
                  <button 
                    className="action-btn"
                    onClick={() => setActiveTab('docking')}
                  >
                    Run Docking Simulation
                  </button>
                  <button 
                    className="action-btn"
                    onClick={handleRunOptimization}
                    disabled={isRunningJob}
                  >
                    {isRunningJob ? 'Optimizing...' : 'Optimize Structure'}
                  </button>
                  <button className="action-btn">Export Data</button>
                </div>
              </div>
            </div>
          </>
        )}
        
        {activeTab === 'properties' && (
          <div className="properties-view">
            <div className="properties-section">
              <h3>Physical Properties</h3>
              <div className="properties-grid">
                <div className="property-item">
                  <div className="property-label">Molecular Weight</div>
                  <div className="property-value">342.4 Da</div>
                </div>
                <div className="property-item">
                  <div className="property-label">LogP</div>
                  <div className="property-value">2.7</div>
                </div>
                <div className="property-item">
                  <div className="property-label">H-Bond Donors</div>
                  <div className="property-value">2</div>
                </div>
                <div className="property-item">
                  <div className="property-label">H-Bond Acceptors</div>
                  <div className="property-value">5</div>
                </div>
                <div className="property-item">
                  <div className="property-label">Rotatable Bonds</div>
                  <div className="property-value">6</div>
                </div>
                <div className="property-item">
                  <div className="property-label">Polar Surface Area</div>
                  <div className="property-value">78.5 Å²</div>
                </div>
              </div>
            </div>
            
            <div className="properties-section">
              <h3>ADMET Predictions</h3>
              <div className="properties-grid">
                <div className="property-item">
                  <div className="property-label">Solubility</div>
                  <div className="property-value">Moderate</div>
                </div>
                <div className="property-item">
                  <div className="property-label">Blood-Brain Barrier</div>
                  <div className="property-value">Permeable</div>
                </div>
                <div className="property-item">
                  <div className="property-label">CYP2D6 Inhibition</div>
                  <div className="property-value">Low Risk</div>
                </div>
                <div className="property-item">
                  <div className="property-label">hERG Inhibition</div>
                  <div className="property-value">Medium Risk</div>
                </div>
                <div className="property-item">
                  <div className="property-label">Hepatotoxicity</div>
                  <div className="property-value">Low Risk</div>
                </div>
                <div className="property-item">
                  <div className="property-label">Oral Bioavailability</div>
                  <div className="property-value">High</div>
                </div>
              </div>
            </div>
            
            <div className="properties-section">
              <h3>Bioactivity Predictions</h3>
              <div className="bioactivity-chart">
                <div className="chart-placeholder">
                  Bioactivity data visualization would appear here
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'docking' && (
          <div className="docking-view">
            <div className="docking-controls">
              <h3>Protein Target Selection</h3>
              <div className="target-selection">
                <select 
                  value={selectedTarget}
                  onChange={(e) => setSelectedTarget(e.target.value)}
                  disabled={isRunningJob}
                >
                  <option value="">Select a protein target</option>
                  <option value="egfr">EGFR (Epidermal Growth Factor Receptor)</option>
                  <option value="ace2">ACE2 (Angiotensin-Converting Enzyme 2)</option>
                  <option value="jak2">JAK2 (Janus Kinase 2)</option>
                  <option value="parp1">PARP1 (Poly ADP-Ribose Polymerase 1)</option>
                  <option value="braf">BRAF (B-Raf Proto-Oncogene)</option>
                </select>
                
                <button 
                  className="run-docking-btn"
                  onClick={handleRunDocking}
                  disabled={!selectedTarget || isRunningJob}
                >
                  {isRunningJob ? 'Running Simulation...' : 'Run Docking Simulation'}
                </button>
              </div>
              
              {isRunningJob && (
                <div className="docking-progress">
                  <div className="progress-bar">
                    <div className="progress-fill"></div>
                  </div>
                  <p>Running molecular docking simulation...</p>
                </div>
              )}
            </div>
            
            {jobResult && (
              <div className="docking-results">
                <h3>Docking Results</h3>
                
                <div className="docking-visualization">
                  <img 
                    src={jobResult.bestPose || '/docking/default-pose.png'} 
                    alt="Docking Pose" 
                    className="docking-image"
                  />
                </div>
                
                <div className="docking-details">
                  <div className="detail-group">
                    <h4>Binding Information</h4>
                    <div className="detail-row">
                      <span className="detail-label">Binding Affinity:</span>
                      <span className="detail-value">{jobResult.bindingAffinity} kcal/mol</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Interaction Sites:</span>
                      <span className="detail-value">
                        {jobResult.interactionSites?.join(', ') || 'None detected'}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Pose Count:</span>
                      <span className="detail-value">{jobResult.poseCount || 0}</span>
                    </div>
                  </div>
                  
                  <div className="docking-actions">
                    <button className="action-btn">Export Results</button>
                    <button className="action-btn">View All Poses</button>
                    <button className="action-btn">Run MD Simulation</button>
                  </div>
                </div>
              </div>
            )}
            
            {!isRunningJob && !jobResult && selectedTarget && (
              <div className="docking-placeholder">
                <p>Select a protein target and run the docking simulation to see results.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MoleculeViewer; 