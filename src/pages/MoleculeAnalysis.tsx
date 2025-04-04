import React, { useState } from 'react';
import MoleculeInputForm from '../components/MoleculeInputForm';

interface AnalysisResults {
  generate: any | null;
  lipinski: any | null;
  binding: any | null;
  admet: any | null;
  agent: any | null;
}

const MoleculeAnalysis: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<AnalysisResults | null>(null);
  const [activeTab, setActiveTab] = useState<'generate' | 'lipinski' | 'binding' | 'admet' | 'agent'>('generate');
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (data: { smiles: string; targetId: string }) => {
    setIsLoading(true);
    setError(null);
    setResults(null);
    
    try {
      // In a real application, these would be actual API calls
      // For now, we'll simulate the responses
      
      // Simulate API calls with a delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock results
      const mockResults: AnalysisResults = {
        generate: {
          smiles: data.smiles,
          molecularWeight: data.smiles.length * 10,
          image2D: 'https://example.com/molecule.png',
          image3D: 'https://example.com/molecule-3d.png'
        },
        lipinski: {
          molecularWeight: data.smiles.length * 10,
          logP: (data.smiles.match(/[A-Z]/g) || []).length / data.smiles.length * 10,
          hBondDonors: (data.smiles.match(/O|N/g) || []).length,
          hBondAcceptors: (data.smiles.match(/o|n/g) || []).length,
          rotatableBonds: (data.smiles.match(/[-]/g) || []).length,
          violations: Math.floor(Math.random() * 3)
        },
        binding: {
          score: -1 * (5 + Math.random() * 5),
          unit: 'kcal/mol',
          interactions: [
            { type: 'Hydrogen Bond', residue: 'ASP', position: 83, strength: 2.1 },
            { type: 'Hydrophobic', residue: 'VAL', position: 92, strength: 3.5 },
            { type: 'Pi-Stacking', residue: 'PHE', position: 123, strength: 4.2 }
          ],
          topTargets: [
            { name: 'EGFR', confidence: 0.92, type: 'Inhibitor' },
            { name: 'JAK2', confidence: 0.78, type: 'Modulator' },
            { name: 'BRAF', confidence: 0.65, type: 'Inhibitor' }
          ]
        },
        admet: {
          absorption: 85,
          distribution: 70,
          metabolism: 65,
          excretion: 80,
          toxicity: 25,
          bbbPenetration: Math.random() > 0.5,
          solubility: 'Moderate',
          liverToxicity: Math.random() > 0.7 ? 'High' : 'Low'
        },
        agent: {
          summary: `This molecule appears to be a potential kinase inhibitor with good drug-like properties. It shows promising binding affinity to EGFR, which makes it a candidate for cancer treatment. The molecule has ${Math.random() > 0.5 ? 'good' : 'moderate'} BBB penetration, suggesting potential CNS applications.`,
          strengths: [
            'Good binding affinity to target proteins',
            'Favorable drug-like properties',
            'Low predicted toxicity'
          ],
          weaknesses: [
            'Moderate solubility may affect bioavailability',
            'Potential for CYP450 interactions'
          ],
          suggestions: [
            'Consider adding a hydroxyl group at position 4 to improve solubility',
            'Reducing the number of rotatable bonds may improve binding entropy',
            'Testing against a panel of kinases is recommended to assess selectivity'
          ]
        }
      };
      
      setResults(mockResults);
      setActiveTab('generate');
    } catch (err) {
      console.error('Error analyzing molecule:', err);
      setError('Failed to analyze molecule. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="molecule-analysis-page">
      <header className="page-header">
        <h1>Molecule Analysis</h1>
        <p>Analyze drug properties, binding affinity, and get AI-powered insights</p>
      </header>
      
      <div className="analysis-container">
        <MoleculeInputForm onSubmit={handleAnalyze} isLoading={isLoading} />
        
        {error && (
          <div className="error-banner">
            <p>{error}</p>
            <button onClick={() => setError(null)}>Dismiss</button>
          </div>
        )}
        
        {results && (
          <div className="results-container">
            <div className="results-tabs">
              <button 
                className={`tab-btn ${activeTab === 'generate' ? 'active' : ''}`}
                onClick={() => setActiveTab('generate')}
              >
                Structure
              </button>
              <button 
                className={`tab-btn ${activeTab === 'lipinski' ? 'active' : ''}`}
                onClick={() => setActiveTab('lipinski')}
              >
                Drug-likeness
              </button>
              <button 
                className={`tab-btn ${activeTab === 'binding' ? 'active' : ''}`}
                onClick={() => setActiveTab('binding')}
              >
                Binding Affinity
              </button>
              <button 
                className={`tab-btn ${activeTab === 'admet' ? 'active' : ''}`}
                onClick={() => setActiveTab('admet')}
              >
                ADMET
              </button>
              <button 
                className={`tab-btn ${activeTab === 'agent' ? 'active' : ''}`}
                onClick={() => setActiveTab('agent')}
              >
                AI Analysis
              </button>
            </div>
            
            <div className="results-content">
              {activeTab === 'generate' && (
                <div className="structure-panel">
                  <div className="structure-grid">
                    <div className="structure-card">
                      <h3>2D Structure</h3>
                      <div className="structure-image-container">
                        {/* In a real app, this would be a real molecular structure image */}
                        <div className="placeholder-structure">
                          <svg width="200" height="200" viewBox="0 0 200 200">
                            <circle cx="100" cy="100" r="30" fill="#3498db" />
                            <circle cx="150" cy="70" r="20" fill="#e74c3c" />
                            <circle cx="60" cy="130" r="20" fill="#2ecc71" />
                            <circle cx="130" cy="150" r="20" fill="#f39c12" />
                            <line x1="100" y1="100" x2="150" y2="70" stroke="black" strokeWidth="2" />
                            <line x1="100" y1="100" x2="60" y2="130" stroke="black" strokeWidth="2" />
                            <line x1="100" y1="100" x2="130" y2="150" stroke="black" strokeWidth="2" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    
                    <div className="structure-card">
                      <h3>3D Structure</h3>
                      <div className="structure-image-container">
                        {/* In a real app, this would be a 3D viewer like 3Dmol.js */}
                        <div className="placeholder-structure">
                          <svg width="200" height="200" viewBox="0 0 200 200">
                            <ellipse cx="100" cy="120" rx="70" ry="30" fill="#f5f5f5" stroke="#ddd" />
                            <circle cx="100" cy="100" r="30" fill="#3498db" />
                            <circle cx="150" cy="70" r="20" fill="#e74c3c" />
                            <circle cx="60" cy="130" r="20" fill="#2ecc71" />
                            <circle cx="130" cy="150" r="20" fill="#f39c12" />
                            <line x1="100" y1="100" x2="150" y2="70" stroke="black" strokeWidth="2" />
                            <line x1="100" y1="100" x2="60" y2="130" stroke="black" strokeWidth="2" />
                            <line x1="100" y1="100" x2="130" y2="150" stroke="black" strokeWidth="2" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="smiles-container">
                    <h3>SMILES Representation</h3>
                    <div className="smiles-display">
                      <code>{results.generate.smiles}</code>
                      <button 
                        className="copy-btn"
                        onClick={() => navigator.clipboard.writeText(results.generate.smiles)}
                      >
                        Copy
                      </button>
                    </div>
                    <div className="smiles-info">
                      <p>SMILES (Simplified Molecular Input Line Entry System) is a notation that allows a user to represent a chemical structure in a way that can be used by computers.</p>
                    </div>
                  </div>
                  
                  <div className="basic-properties">
                    <h3>Basic Properties</h3>
                    <div className="properties-grid">
                      <div className="property-item">
                        <span className="property-label">Molecular Weight</span>
                        <span className="property-value">{results.lipinski.molecularWeight.toFixed(1)} Da</span>
                      </div>
                      <div className="property-item">
                        <span className="property-label">LogP</span>
                        <span className="property-value">{results.lipinski.logP.toFixed(2)}</span>
                      </div>
                      <div className="property-item">
                        <span className="property-label">H-Bond Donors</span>
                        <span className="property-value">{results.lipinski.hBondDonors}</span>
                      </div>
                      <div className="property-item">
                        <span className="property-label">H-Bond Acceptors</span>
                        <span className="property-value">{results.lipinski.hBondAcceptors}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'lipinski' && (
                <div className="lipinski-panel">
                  <div className="druglikeness-results">
                    <div className="druglikeness-score">
                      <h3>Drug-likeness Score</h3>
                      <div className="score-circle">
                        {5 - results.lipinski.violations}
                      </div>
                      <p className="score-label">
                        {results.lipinski.violations === 0 
                          ? 'Excellent drug-likeness' 
                          : results.lipinski.violations === 1 
                            ? 'Good drug-likeness' 
                            : 'Poor drug-likeness'}
                      </p>
                      <p className="violations-count">
                        {results.lipinski.violations} rule violation{results.lipinski.violations !== 1 ? 's' : ''}
                      </p>
                    </div>
                    
                    <div className="rule-details">
                      <h3>Lipinski's Rule of Five</h3>
                      <div className="rule-list">
                        <div className={`rule-item ${results.lipinski.molecularWeight <= 500 ? 'passes' : 'fails'}`}>
                          <span className="rule-icon">{results.lipinski.molecularWeight <= 500 ? '✓' : '✗'}</span>
                          <span className="rule-text">Molecular weight ≤ 500 Da</span>
                          <span className="rule-value">{results.lipinski.molecularWeight.toFixed(1)} Da</span>
                        </div>
                        <div className={`rule-item ${results.lipinski.logP <= 5 ? 'passes' : 'fails'}`}>
                          <span className="rule-icon">{results.lipinski.logP <= 5 ? '✓' : '✗'}</span>
                          <span className="rule-text">LogP ≤ 5</span>
                          <span className="rule-value">{results.lipinski.logP.toFixed(2)}</span>
                        </div>
                        <div className={`rule-item ${results.lipinski.hBondDonors <= 5 ? 'passes' : 'fails'}`}>
                          <span className="rule-icon">{results.lipinski.hBondDonors <= 5 ? '✓' : '✗'}</span>
                          <span className="rule-text">H-bond donors ≤ 5</span>
                          <span className="rule-value">{results.lipinski.hBondDonors}</span>
                        </div>
                        <div className={`rule-item ${results.lipinski.hBondAcceptors <= 10 ? 'passes' : 'fails'}`}>
                          <span className="rule-icon">{results.lipinski.hBondAcceptors <= 10 ? '✓' : '✗'}</span>
                          <span className="rule-text">H-bond acceptors ≤ 10</span>
                          <span className="rule-value">{results.lipinski.hBondAcceptors}</span>
                        </div>
                      </div>
                      
                      <div className="rule-explanation">
                        <h4>What is Lipinski's Rule of Five?</h4>
                        <p>
                          Lipinski's Rule of Five is a set of guidelines to evaluate drug-likeness or determine if a chemical compound has properties that would make it likely to be an orally active drug in humans. The rule states that an orally active drug generally has:
                        </p>
                        <ul>
                          <li>No more than 5 hydrogen bond donors</li>
                          <li>No more than 10 hydrogen bond acceptors</li>
                          <li>A molecular weight under 500 daltons</li>
                          <li>An octanol-water partition coefficient (logP) not greater than 5</li>
                        </ul>
                        <p>
                          Compounds that violate more than one of these rules may have problems with bioavailability.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'binding' && (
                <div className="binding-panel">
                  <div className="binding-score-container">
                    <h3>Binding Affinity Score</h3>
                    <div className={`binding-score ${results.binding.score < -8 ? 'good-score' : results.binding.score < -6 ? 'medium-score' : 'poor-score'}`}>
                      {results.binding.score.toFixed(1)} {results.binding.unit}
                    </div>
                    <div className="score-interpretation">
                      {results.binding.score < -8 
                        ? 'Strong binding affinity (< -8 kcal/mol)' 
                        : results.binding.score < -6 
                          ? 'Moderate binding affinity (-6 to -8 kcal/mol)'
                          : 'Weak binding affinity (> -6 kcal/mol)'}
                    </div>
                  </div>
                  
                  <div className="binding-details">
                    <div className="top-targets">
                      <h3>Top Protein Target Matches</h3>
                      <div className="targets-list">
                        {results.binding.topTargets.map((target: any, index: number) => (
                          <div key={index} className="target-card">
                            <div className="target-name">{target.name}</div>
                            <div className="target-confidence">
                              <div className="confidence-bar">
                                <div 
                                  className="confidence-fill"
                                  style={{ width: `${target.confidence * 100}%` }}
                                ></div>
                              </div>
                              <span>{(target.confidence * 100).toFixed(0)}%</span>
                            </div>
                            <div className="target-type">
                              <span className={`type-badge ${target.type.toLowerCase()}`}>
                                {target.type}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="interactions">
                      <h3>Key Interactions</h3>
                      <div className="interactions-table">
                        <table>
                          <thead>
                            <tr>
                              <th>Type</th>
                              <th>Residue</th>
                              <th>Position</th>
                              <th>Strength (Å)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {results.binding.interactions.map((interaction: any, index: number) => (
                              <tr key={index}>
                                <td>{interaction.type}</td>
                                <td>{interaction.residue}</td>
                                <td>{interaction.position}</td>
                                <td>{interaction.strength.toFixed(1)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'admet' && (
                <div className="admet-panel">
                  <h3>ADMET Properties</h3>
                  <div className="admet-grid">
                    <div className="admet-card">
                      <h4>Absorption</h4>
                      <div className="meter-container">
                        <div className="meter">
                          <div 
                            className="meter-fill"
                            style={{ width: `${results.admet.absorption}%` }}
                          ></div>
                        </div>
                        <span className="meter-value">{results.admet.absorption}%</span>
                      </div>
                    </div>
                    
                    <div className="admet-card">
                      <h4>Distribution</h4>
                      <div className="meter-container">
                        <div className="meter">
                          <div 
                            className="meter-fill"
                            style={{ width: `${results.admet.distribution}%` }}
                          ></div>
                        </div>
                        <span className="meter-value">{results.admet.distribution}%</span>
                      </div>
                    </div>
                    
                    <div className="admet-card">
                      <h4>Metabolism</h4>
                      <div className="meter-container">
                        <div className="meter">
                          <div 
                            className="meter-fill"
                            style={{ width: `${results.admet.metabolism}%` }}
                          ></div>
                        </div>
                        <span className="meter-value">{results.admet.metabolism}%</span>
                      </div>
                    </div>
                    
                    <div className="admet-card">
                      <h4>Excretion</h4>
                      <div className="meter-container">
                        <div className="meter">
                          <div 
                            className="meter-fill"
                            style={{ width: `${results.admet.excretion}%` }}
                          ></div>
                        </div>
                        <span className="meter-value">{results.admet.excretion}%</span>
                      </div>
                    </div>
                    
                    <div className="admet-card">
                      <h4>Toxicity</h4>
                      <div className="meter-container">
                        <div className="meter">
                          <div 
                            className="meter-fill toxicity"
                            style={{ width: `${results.admet.toxicity}%` }}
                          ></div>
                        </div>
                        <span className="meter-value">{results.admet.toxicity}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="admet-details">
                    <div className="admet-detail-card">
                      <h4>Blood-Brain Barrier Penetration</h4>
                      <div className="detail-value">
                        <span className={`badge ${results.admet.bbbPenetration ? 'positive' : 'negative'}`}>
                          {results.admet.bbbPenetration ? 'Yes' : 'No'}
                        </span>
                      </div>
                      <p className="detail-description">
                        {results.admet.bbbPenetration 
                          ? 'This molecule is predicted to cross the blood-brain barrier, making it potentially useful for CNS targets.' 
                          : 'This molecule is predicted to have limited ability to cross the blood-brain barrier.'}
                      </p>
                    </div>
                    
                    <div className="admet-detail-card">
                      <h4>Solubility</h4>
                      <div className="detail-value">
                        <span className="badge solubility">{results.admet.solubility}</span>
                      </div>
                      <p className="detail-description">
                        {results.admet.solubility === 'High' 
                          ? 'High water solubility may lead to good absorption but rapid clearance.' 
                          : results.admet.solubility === 'Moderate' 
                            ? 'Moderate solubility represents a balance between absorption and retention.' 
                            : 'Low solubility may limit bioavailability unless special formulations are used.'}
                      </p>
                    </div>
                    
                    <div className="admet-detail-card">
                      <h4>Liver Toxicity</h4>
                      <div className="detail-value">
                        <span className={`badge ${results.admet.liverToxicity === 'Low' ? 'positive' : 'negative'}`}>
                          {results.admet.liverToxicity}
                        </span>
                      </div>
                      <p className="detail-description">
                        {results.admet.liverToxicity === 'Low' 
                          ? 'Low predicted hepatotoxicity suggests minimal risk of liver damage.' 
                          : 'High predicted hepatotoxicity indicates potential for liver damage, requiring careful monitoring.'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="admet-explanation">
                    <h4>What is ADMET?</h4>
                    <p>
                      ADMET stands for Absorption, Distribution, Metabolism, Excretion, and Toxicity. These properties determine how a drug moves through the body and what effects it may have:
                    </p>
                    <ul>
                      <li><strong>Absorption:</strong> How well the drug is taken into the bloodstream</li>
                      <li><strong>Distribution:</strong> How well the drug spreads throughout the body</li>
                      <li><strong>Metabolism:</strong> How the body chemically alters the drug</li>
                      <li><strong>Excretion:</strong> How the body removes the drug</li>
                      <li><strong>Toxicity:</strong> Harmful effects the drug may have on the body</li>
                    </ul>
                    <p>
                      Good ADMET properties are crucial for a drug's success in clinical trials and eventual approval.
                    </p>
                  </div>
                </div>
              )}
              
              {activeTab === 'agent' && (
                <div className="agent-panel">
                  <div className="ai-summary">
                    <h3>AI Analysis Summary</h3>
                    <div className="summary-text">
                      <p>{results.agent.summary}</p>
                    </div>
                  </div>
                  
                  <div className="analysis-details">
                    <div className="strengths-weaknesses">
                      <div className="strengths">
                        <h4>Strengths</h4>
                        <ul>
                          {results.agent.strengths.map((strength: string, index: number) => (
                            <li key={index}>{strength}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="weaknesses">
                        <h4>Weaknesses</h4>
                        <ul>
                          {results.agent.weaknesses.map((weakness: string, index: number) => (
                            <li key={index}>{weakness}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div className="suggestions">
                      <h4>Optimization Suggestions</h4>
                      <div className="suggestions-list">
                        {results.agent.suggestions.map((suggestion: string, index: number) => (
                          <div key={index} className="suggestion-item">
                            <div className="suggestion-number">{index + 1}</div>
                            <div className="suggestion-text">{suggestion}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MoleculeAnalysis; 