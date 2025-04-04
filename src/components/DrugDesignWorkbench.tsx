import React, { useState, useEffect } from 'react';
import { loadCSVDataset } from '../utils/datasetLoader';
import MolecularSearch from './MolecularSearch';

const DrugDesignWorkbench: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'search' | 'design' | 'analyze'>('search');
  const [selectedMolecule, setSelectedMolecule] = useState<any | null>(null);
  const [targetProteins, setTargetProteins] = useState<any[]>([]);
  const [selectedTarget, setSelectedTarget] = useState<string>('');
  const [dockingScore, setDockingScore] = useState<number | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    // Load target proteins from BindingDB dataset
    const loadTargets = async () => {
      try {
        const data = await loadCSVDataset('bindingdb_mock.csv');
        // Extract unique target proteins
        const uniqueTargets = Array.from(new Set(data.map(item => item.Target || '')))
          .filter(target => target)
          .map(target => ({
            id: target.toLowerCase().replace(/\s+/g, '-'),
            name: target
          }));
        
        setTargetProteins(uniqueTargets);
      } catch (error) {
        console.error('Error loading target proteins:', error);
      }
    };

    loadTargets();
  }, []);

  const handleSelectMolecule = (molecule: any) => {
    setSelectedMolecule(molecule);
    setActiveTab('design');
  };

  const handleRunDocking = () => {
    if (!selectedMolecule || !selectedTarget) return;
    
    setIsSimulating(true);
    setDockingScore(null);
    
    // Simulate docking calculation
    setTimeout(() => {
      // Generate a random docking score between -12 and -5
      const score = -(Math.random() * 7 + 5).toFixed(1);
      setDockingScore(parseFloat(score));
      setIsSimulating(false);
    }, 2000);
  };

  return (
    <div className="drug-design-workbench">
      <div className="workbench-tabs">
        <button 
          className={`tab-btn ${activeTab === 'search' ? 'active' : ''}`}
          onClick={() => setActiveTab('search')}
        >
          Search Molecules
        </button>
        <button 
          className={`tab-btn ${activeTab === 'design' ? 'active' : ''}`}
          onClick={() => setActiveTab('design')}
          disabled={!selectedMolecule}
        >
          Design & Optimize
        </button>
        <button 
          className={`tab-btn ${activeTab === 'analyze' ? 'active' : ''}`}
          onClick={() => setActiveTab('analyze')}
          disabled={!selectedMolecule}
        >
          Analyze Properties
        </button>
      </div>
      
      <div className="workbench-content">
        {activeTab === 'search' && (
          <MolecularSearch onSelectMolecule={handleSelectMolecule} />
        )}
        
        {activeTab === 'design' && selectedMolecule && (
          <div className="design-panel">
            <div className="molecule-details">
              <h2>Selected Molecule: {selectedMolecule.Name}</h2>
              
              <div className="molecule-structure">
                {/* In a real app, this would be a 3D molecule viewer */}
                <div className="structure-placeholder">
                  <p>SMILES: {selectedMolecule.SMILES}</p>
                  <p>Molecular Weight: {selectedMolecule.MolecularWeight}</p>
                </div>
              </div>
              
              <div className="docking-simulation">
                <h3>Molecular Docking</h3>
                
                <div className="docking-controls">
                  <select 
                    value={selectedTarget}
                    onChange={(e) => setSelectedTarget(e.target.value)}
                    disabled={isSimulating}
                  >
                    <option value="">Select a target protein</option>
                    {targetProteins.map(target => (
                      <option key={target.id} value={target.id}>
                        {target.name}
                      </option>
                    ))}
                  </select>
                  
                  <button 
                    className="run-docking-btn"
                    onClick={handleRunDocking}
                    disabled={!selectedTarget || isSimulating}
                  >
                    {isSimulating ? 'Simulating...' : 'Run Docking Simulation'}
                  </button>
                </div>
                
                {isSimulating && (
                  <div className="simulation-progress">
                    <div className="progress-bar">
                      <div className="progress-fill"></div>
                    </div>
                    <p>Running molecular docking simulation...</p>
                  </div>
                )}
                
                {dockingScore !== null && (
                  <div className="docking-results">
                    <h4>Docking Results</h4>
                    <div className="result-card">
                      <div className="score-display">
                        <span className="score-label">Binding Affinity:</span>
                        <span className={`score-value ${dockingScore < -8 ? 'good-score' : dockingScore < -6 ? 'medium-score' : 'poor-score'}`}>
                          {dockingScore} kcal/mol
                        </span>
                      </div>
                      
                      <div className="score-interpretation">
                        {dockingScore < -8 ? (
                          <p>Strong binding predicted. This molecule shows excellent potential for the selected target.</p>
                        ) : dockingScore < -6 ? (
                          <p>Moderate binding predicted. This molecule may have activity against the selected target.</p>
                        ) : (
                          <p>Weak binding predicted. This molecule is unlikely to have significant activity against the selected target.</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'analyze' && selectedMolecule && (
          <div className="analysis-panel">
            <h2>Property Analysis: {selectedMolecule.Name}</h2>
            
            <div className="property-cards">
              <div className="property-card">
                <h3>Physical Properties</h3>
                <div className="property-list">
                  <div className="property-item">
                    <span className="property-name">Molecular Weight:</span>
                    <span className="property-value">{selectedMolecule.MolecularWeight} g/mol</span>
                  </div>
                  <div className="property-item">
                    <span className="property-name">LogP:</span>
                    <span className="property-value">{selectedMolecule.LogP || 'N/A'}</span>
                  </div>
                  <div className="property-item">
                    <span className="property-name">H-Bond Donors:</span>
                    <span className="property-value">{selectedMolecule.HBondDonors || 'N/A'}</span>
                  </div>
                  <div className="property-item">
                    <span className="property-name">H-Bond Acceptors:</span>
                    <span className="property-value">{selectedMolecule.HBondAcceptors || 'N/A'}</span>
                  </div>
                </div>
              </div>
              
              <div className="property-card">
                <h3>Lipinski's Rule of Five</h3>
                <div className="rule-list">
                  <div className="rule-item">
                    <span className="rule-check">
                      {parseFloat(selectedMolecule.MolecularWeight) <= 500 ? '✓' : '✗'}
                    </span>
                    <span className="rule-text">Molecular weight ≤ 500 Da</span>
                  </div>
                  <div className="rule-item">
                    <span className="rule-check">
                      {parseFloat(selectedMolecule.LogP || 0) <= 5 ? '✓' : '✗'}
                    </span>
                    <span className="rule-text">LogP ≤ 5</span>
                  </div>
                  <div className="rule-item">
                    <span className="rule-check">
                      {parseInt(selectedMolecule.HBondDonors || 0) <= 5 ? '✓' : '✗'}
                    </span>
                    <span className="rule-text">H-bond donors ≤ 5</span>
                  </div>
                  <div className="rule-item">
                    <span className="rule-check">
                      {parseInt(selectedMolecule.HBondAcceptors || 0) <= 10 ? '✓' : '✗'}
                    </span>
                    <span className="rule-text">H-bond acceptors ≤ 10</span>
                  </div>
                </div>
              </div>
              
              <div className="property-card">
                <h3>Predicted Properties</h3>
                <div className="property-list">
                  <div className="property-item">
                    <span className="property-name">Bioavailability:</span>
                    <span className="property-value">
                      {Math.random() > 0.3 ? 'High' : 'Low'}
                    </span>
                  </div>
                  <div className="property-item">
                    <span className="property-name">Blood-Brain Barrier:</span>
                    <span className="property-value">
                      {Math.random() > 0.5 ? 'Crosses' : 'Does not cross'}
                    </span>
                  </div>
                  <div className="property-item">
                    <span className="property-name">CYP2D6 Inhibition:</span>
                    <span className="property-value">
                      {Math.random() > 0.7 ? 'Inhibitor' : 'Non-inhibitor'}
                    </span>
                  </div>
                  <div className="property-item">
                    <span className="property-name">hERG Inhibition:</span>
                    <span className="property-value">
                      {Math.random() > 0.8 ? 'Inhibitor' : 'Non-inhibitor'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DrugDesignWorkbench; 