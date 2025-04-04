import React from 'react';
import { Molecule } from '../data/molecules';

interface MoleculeViewerProps {
  molecule: Molecule;
  onClose: () => void;
}

const MoleculeViewer: React.FC<MoleculeViewerProps> = ({ molecule, onClose }) => {
  return (
    <div className="molecule-viewer-overlay">
      <div className="molecule-viewer-container">
        <div className="viewer-header">
          <h2>{molecule.name}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="viewer-content">
          <div className="molecule-structure">
            <img src={molecule.image} alt={molecule.name} />
          </div>
          
          <div className="molecule-details">
            <div className="detail-item">
              <span className="detail-label">SMILES:</span>
              <span className="detail-value">{molecule.smiles}</span>
            </div>
            
            <div className="detail-item">
              <span className="detail-label">Molecular Weight:</span>
              <span className="detail-value">{molecule.molecularWeight.toFixed(2)} Da</span>
            </div>
            
            <div className="detail-item">
              <span className="detail-label">LogP:</span>
              <span className="detail-value">{molecule.logP.toFixed(2)}</span>
            </div>
            
            <div className="detail-item">
              <span className="detail-label">Rotatable Bonds:</span>
              <span className="detail-value">{molecule.numRotatableBonds}</span>
            </div>
            
            <div className="detail-item">
              <span className="detail-label">Binding Affinity:</span>
              <span className="detail-value">{molecule.bindingAffinity.toFixed(1)} nM</span>
            </div>
            
            <div className="detail-item">
              <span className="detail-label">Drug-likeness Score:</span>
              <span className="detail-value">{molecule.drugLikeness.toFixed(2)}</span>
            </div>
            
            {molecule.generationMetadata && (
              <>
                <div className="detail-item">
                  <span className="detail-label">Generation Method:</span>
                  <span className="detail-value">{molecule.generationMetadata.method}</span>
                </div>
                
                <div className="detail-item">
                  <span className="detail-label">Target Protein:</span>
                  <span className="detail-value">{molecule.generationMetadata.targetProtein}</span>
                </div>
              </>
            )}
          </div>
        </div>
        
        <div className="viewer-actions">
          <button className="action-button">Save Molecule</button>
          <button className="action-button">Export Structure</button>
          <button className="action-button secondary">Send to Analysis</button>
        </div>
      </div>
    </div>
  );
};

export default MoleculeViewer; 