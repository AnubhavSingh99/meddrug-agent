import React from 'react';
import { Molecule } from '../data/molecules';

interface MoleculeViewerProps {
  molecule: Molecule;
  onClose: () => void;
}

const MoleculeViewer: React.FC<MoleculeViewerProps> = ({ molecule, onClose }) => {
  return (
    <div className="molecule-viewer">
      <div className="viewer-header">
        <h2>{molecule.name}</h2>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>
      
      <div className="viewer-content">
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
              <button className="action-btn">Run Docking Simulation</button>
              <button className="action-btn">Optimize Structure</button>
              <button className="action-btn">Export Data</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoleculeViewer; 