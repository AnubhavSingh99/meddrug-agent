import React, { useState } from 'react';
import { validateSMILES } from '../utils/moleculeUtils';

interface MoleculeInputFormProps {
  onSubmit: (data: { smiles: string; targetId: string }) => void;
  isLoading: boolean;
}

const MoleculeInputForm: React.FC<MoleculeInputFormProps> = ({ onSubmit, isLoading }) => {
  const [smiles, setSmiles] = useState('');
  const [targetId, setTargetId] = useState('');
  const [smilesError, setSmilesError] = useState('');
  
  // Example SMILES strings for common drugs
  const exampleSmiles = [
    { name: 'Aspirin', smiles: 'CC(=O)OC1=CC=CC=C1C(=O)O' },
    { name: 'Ibuprofen', smiles: 'CC(C)CC1=CC=C(C=C1)C(C)C(=O)O' },
    { name: 'Paracetamol', smiles: 'CC(=O)NC1=CC=C(C=C1)O' },
    { name: 'Caffeine', smiles: 'CN1C=NC2=C1C(=O)N(C(=O)N2C)C' }
  ];
  
  // Common protein targets
  const commonTargets = [
    { name: 'EGFR (Epidermal Growth Factor Receptor)', id: 'P00533' },
    { name: 'ACE2 (Angiotensin-Converting Enzyme 2)', id: 'Q9BYF1' },
    { name: 'JAK2 (Janus Kinase 2)', id: 'O60674' },
    { name: 'BRAF (B-Raf Proto-Oncogene)', id: 'P15056' }
  ];
  
  const handleSmilesChange = (value: string) => {
    setSmiles(value);
    setSmilesError('');
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate SMILES
    if (!smiles.trim()) {
      setSmilesError('SMILES string is required');
      return;
    }
    
    if (!validateSMILES(smiles)) {
      setSmilesError('Invalid SMILES string format');
      return;
    }
    
    // Submit form data
    onSubmit({ smiles, targetId });
  };
  
  return (
    <div className="molecule-input-form">
      <h2>Analyze Molecule</h2>
      <p className="form-description">
        Enter a SMILES string and optional target protein to analyze drug properties, 
        binding affinity, and get AI-powered insights.
      </p>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="smiles-input">
            SMILES String
            <span className="tooltip-icon" title="Simplified Molecular Input Line Entry System - a notation representing molecular structure">ⓘ</span>
          </label>
          <div className="input-with-examples">
            <input
              id="smiles-input"
              type="text"
              value={smiles}
              onChange={(e) => handleSmilesChange(e.target.value)}
              placeholder="e.g., CC(=O)OC1=CC=CC=C1C(=O)O"
              className={smilesError ? 'error' : ''}
              disabled={isLoading}
            />
            <div className="examples-dropdown">
              <button type="button" className="examples-btn" disabled={isLoading}>
                Examples ▾
              </button>
              <div className="examples-content">
                {exampleSmiles.map((example) => (
                  <button
                    key={example.name}
                    type="button"
                    onClick={() => handleSmilesChange(example.smiles)}
                  >
                    {example.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {smilesError && <div className="error-message">{smilesError}</div>}
          <div className="input-help">
            Enter the SMILES representation of your molecule
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="target-input">
            Target Protein ID (Optional)
            <span className="tooltip-icon" title="UniProt or PDB identifier for the protein target">ⓘ</span>
          </label>
          <div className="input-with-examples">
            <input
              id="target-input"
              type="text"
              value={targetId}
              onChange={(e) => setTargetId(e.target.value)}
              placeholder="e.g., P00533 (UniProt) or 1M17 (PDB)"
              disabled={isLoading}
            />
            <div className="examples-dropdown">
              <button type="button" className="examples-btn" disabled={isLoading}>
                Common Targets ▾
              </button>
              <div className="examples-content">
                {commonTargets.map((target) => (
                  <button
                    key={target.id}
                    type="button"
                    onClick={() => setTargetId(target.id)}
                  >
                    {target.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="input-help">
            Enter a UniProt or PDB ID to analyze binding affinity
          </div>
        </div>
        
        <div className="form-actions">
          <button 
            type="submit" 
            className="analyze-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Analyzing...
              </>
            ) : (
              'Analyze Molecule'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MoleculeInputForm; 