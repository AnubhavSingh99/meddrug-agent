import React, { useState, useEffect } from 'react';
import { Molecule } from '../data/molecules';
import { useComputation } from '../context/ComputationContext';

interface MoleculeViewerProps {
  molecule: Molecule;
  onClose: () => void;
}

interface MolecularProperties {
  molecularWeight: number;
  logP: number;
  rotatableBonds: number;
  hBondDonors: number;
  hBondAcceptors: number;
  polarSurfaceArea: number;
  drugLikeness: {
    score: number;
    violations: number;
    details: boolean[];
  };
}

const styles = `
  .docking-results {
    margin-top: 20px;
  }

  .results-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin-top: 15px;
  }

  .result-card {
    background: white;
    border-radius: 8px;
    padding: 15px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  .result-card h4 {
    margin: 0 0 10px 0;
    color: var(--primary-color);
    font-size: 16px;
  }

  .energy-value {
    font-size: 24px;
    font-weight: bold;
    color: #2c3e50;
    text-align: center;
    padding: 10px;
    background: #f8f9fa;
    border-radius: 4px;
  }

  .interactions-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .interaction-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px;
    background: #f8f9fa;
    border-radius: 4px;
    font-size: 14px;
  }

  .interaction-item .residue {
    font-weight: bold;
    color: var(--primary-color);
  }

  .interaction-item .type {
    color: #666;
  }

  .interaction-item .strength {
    color: #2ecc71;
  }

  .poses-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .pose-item {
    display: flex;
    justify-content: space-between;
    padding: 8px;
    background: #f8f9fa;
    border-radius: 4px;
    font-size: 14px;
  }

  .stability-meter {
    height: 24px;
    background: #f8f9fa;
    border-radius: 12px;
    position: relative;
    overflow: hidden;
    margin-top: 10px;
  }

  .stability-fill {
    height: 100%;
    background: linear-gradient(90deg, #2ecc71, #27ae60);
    transition: width 0.3s ease;
  }

  .stability-meter span {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #fff;
    font-weight: bold;
    text-shadow: 0 1px 2px rgba(0,0,0,0.2);
  }
`;

const MoleculeViewer: React.FC<MoleculeViewerProps> = ({ molecule, onClose }) => {
  const { submitDockingJob, submitDynamicsJob } = useComputation();
  const [activeTab, setActiveTab] = useState<'structure' | 'properties' | 'docking'>('structure');
  const [selectedTarget, setSelectedTarget] = useState('');
  const [isRunningJob, setIsRunningJob] = useState(false);
  const [jobResult, setJobResult] = useState<any>(null);
  const [analysisResults, setAnalysisResults] = useState<any>(null);

  const handleRunDocking = async () => {
    if (!selectedTarget) return;
    
    setIsRunningJob(true);
    
    try {
      // Mock docking calculation based on SMILES complexity and target
      const mockDocking = () => {
        const complexity = molecule.SMILES.length;
        const targetFactor = selectedTarget === 'egfr' ? 1.2 : 1.0;
        
        return {
          bindingEnergy: -(complexity * 0.1 * targetFactor),
          interactions: generateMockInteractions(molecule.SMILES),
          poses: generateMockPoses(complexity),
          stabilityScore: Math.min(100, complexity * 2)
        };
      };

      // Simulate API call delay
      setTimeout(() => {
        const results = mockDocking();
        setAnalysisResults(results);
        setIsRunningJob(false);
      }, 2000);
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

  // Lipinski's Rule of Five calculation
  const calculateDrugLikeness = (mol: Molecule): {
    score: number;
    violations: number;
    details: boolean[];
  } => {
    // Calculate properties independently to avoid circular dependency
    const molWeight = mol.SMILES.length * 10;
    const logP = (mol.SMILES.match(/[A-Z]/g) || []).length / mol.SMILES.length * 10;
    const hBondDonors = (mol.SMILES.match(/[NOH]/g) || []).length;
    const hBondAcceptors = (mol.SMILES.match(/[NO]/g) || []).length;

    const rules = [
      molWeight <= 500,
      logP <= 5,
      hBondDonors <= 5,
      hBondAcceptors <= 10
    ];

    return {
      score: (rules.filter(Boolean).length / rules.length) * 100,
      violations: rules.length - rules.filter(Boolean).length,
      details: rules
    };
  };

  // Enhanced property analysis
  const analyzeMolecularProperties = (): MolecularProperties => {
    const properties: MolecularProperties = {
      molecularWeight: molecule.SMILES.length * 10,
      logP: (molecule.SMILES.match(/[A-Z]/g) || []).length / molecule.SMILES.length * 10,
      rotatableBonds: (molecule.SMILES.match(/[-]/g) || []).length,
      hBondDonors: (molecule.SMILES.match(/[NOH]/g) || []).length,
      hBondAcceptors: (molecule.SMILES.match(/[NO]/g) || []).length,
      polarSurfaceArea: molecule.SMILES.length * 5,
      drugLikeness: calculateDrugLikeness(molecule)
    };

    return properties;
  };

  // Helper functions for mock data generation
  const generateMockInteractions = (smiles: string) => {
    const aminoAcids = ['GLY', 'ALA', 'VAL', 'LEU', 'ILE', 'PRO', 'PHE', 'TYR', 'TRP', 'SER'];
    const numInteractions = Math.min(5, Math.floor(smiles.length / 5));
    
    return Array.from({ length: numInteractions }, (_, i) => ({
      residue: aminoAcids[i % aminoAcids.length],
      position: (i + 1) * 100,
      type: i % 2 === 0 ? 'Hydrogen Bond' : 'Hydrophobic',
      strength: Math.random() * 5
    }));
  };

  const generateMockPoses = (complexity: number) => {
    const numPoses = Math.min(10, Math.floor(complexity / 10));
    return Array.from({ length: numPoses }, (_, i) => ({
      poseId: i + 1,
      score: -(Math.random() * 10 + 5),
      rmsd: Math.random() * 2,
      stability: Math.random() * 100
    }));
  };

  return (
    <div className="molecule-viewer">
      <style>{styles}</style>
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
          <div className="properties-panel">
            <h3>Molecular Properties</h3>
            <div className="properties-grid">
              {Object.entries(analyzeMolecularProperties()).map(([key, value]) => (
                <div key={key} className="property-card">
                  <h4>{key}</h4>
                  <p>
                    {key === 'drugLikeness' ? (
                      <>
                        Score: {(value as any).score.toFixed(0)}%<br />
                        Violations: {(value as any).violations}
                      </>
                    ) : typeof value === 'number' ? (
                      value.toFixed(2)
                    ) : (
                      String(value)
                    )}
                  </p>
                </div>
              ))}
            </div>
            
            <h3>Drug-likeness Analysis</h3>
            <div className="druglikeness-results">
              <div className="druglikeness-score">
                <h4>Lipinski Score</h4>
                <div className="score-circle">
                  {analyzeMolecularProperties().drugLikeness.score.toFixed(0)}%
                </div>
                <p>{analyzeMolecularProperties().drugLikeness.violations} rule violation(s)</p>
              </div>
              <div className="rule-list">
                {analyzeMolecularProperties().drugLikeness.details.map((passes, index) => (
                  <div key={index} className={`rule-item ${passes ? 'passes' : 'fails'}`}>
                    <span className="rule-icon">{passes ? '✓' : '✗'}</span>
                    <span className="rule-text">
                      {index === 0 && 'Molecular weight ≤ 500'}
                      {index === 1 && 'LogP ≤ 5'}
                      {index === 2 && 'H-bond donors ≤ 5'}
                      {index === 3 && 'H-bond acceptors ≤ 10'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'docking' && (
          <div className="docking-panel">
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
            
            {analysisResults && (
              <div className="docking-results">
                <h3>Docking Results</h3>
                <div className="results-grid">
                  <div className="result-card">
                    <h4>Binding Energy</h4>
                    <div className="energy-value">
                      {analysisResults.bindingEnergy.toFixed(1)} kcal/mol
                    </div>
                  </div>
                  
                  <div className="result-card">
                    <h4>Interactions</h4>
                    <div className="interactions-list">
                      {analysisResults.interactions.map((interaction: any, index: number) => (
                        <div key={index} className="interaction-item">
                          <span className="residue">{interaction.residue}{interaction.position}</span>
                          <span className="type">{interaction.type}</span>
                          <span className="strength">{interaction.strength.toFixed(1)} Å</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="result-card">
                    <h4>Binding Poses</h4>
                    <div className="poses-list">
                      {analysisResults.poses.map((pose: any, index: number) => (
                        <div key={index} className="pose-item">
                          <span>Pose {pose.poseId}</span>
                          <span>Score: {pose.score.toFixed(1)}</span>
                          <span>RMSD: {pose.rmsd.toFixed(2)} Å</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="result-card">
                    <h4>Stability Score</h4>
                    <div className="stability-meter">
                      <div 
                        className="stability-fill"
                        style={{ width: `${analysisResults.stabilityScore}%` }}
                      />
                      <span>{analysisResults.stabilityScore.toFixed(0)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {!isRunningJob && !analysisResults && selectedTarget && (
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