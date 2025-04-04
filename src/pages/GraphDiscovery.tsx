import React, { useState } from 'react';
import { graphRelationships } from '../data/graphData';
import { molecules } from '../data/molecules';

const GraphDiscovery: React.FC = () => {
  const [selectedRelationship, setSelectedRelationship] = useState(graphRelationships[0]);
  
  return (
    <div className="graph-discovery">
      <header className="page-header">
        <h1>Graph-Based Drug Discovery</h1>
        <p>Explore relationships between genes, proteins, diseases, and drugs</p>
      </header>
      
      <div className="graph-content">
        <div className="graph-visualization">
          <div className="graph-placeholder">
            <h3>Interactive Graph Visualization</h3>
            <p>This area would contain an interactive network graph showing relationships between drugs, targets, and diseases.</p>
            <div className="fake-graph">
              {/* This is a placeholder for what would be a real graph visualization */}
              <div className="graph-node drug-node">
                <span>{selectedRelationship.Drug}</span>
              </div>
              <div className="graph-edge drug-target-edge"></div>
              <div className="graph-node protein-node">
                <span>{selectedRelationship.Target_Protein}</span>
              </div>
              <div className="graph-edge target-disease-edge"></div>
              <div className="graph-node disease-node">
                <span>{selectedRelationship.Disease}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="graph-details">
          <div className="relationship-selector">
            <h3>Select Drug-Target-Disease Relationship</h3>
            <select 
              value={selectedRelationship.id}
              onChange={(e) => {
                const selected = graphRelationships.find(rel => rel.id === e.target.value);
                if (selected) setSelectedRelationship(selected);
              }}
            >
              {graphRelationships.map(rel => (
                <option key={rel.id} value={rel.id}>
                  {rel.Drug} → {rel.Target_Protein} → {rel.Disease}
                </option>
              ))}
            </select>
          </div>
          
          <div className="relationship-details">
            <h3>Relationship Details</h3>
            <div className="detail-card">
              <div className="detail-row">
                <span className="detail-label">Drug:</span>
                <span className="detail-value">{selectedRelationship.Drug}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Target Protein:</span>
                <span className="detail-value">{selectedRelationship.Target_Protein}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Disease:</span>
                <span className="detail-value">{selectedRelationship.Disease}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Binding Affinity:</span>
                <span className="detail-value">{selectedRelationship.Binding_Affinity.toFixed(1)} kcal/mol</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Repurposing Score:</span>
                <span className="detail-value">{selectedRelationship.Repurposing_Score.toFixed(1)}</span>
              </div>
            </div>
          </div>
          
          <div className="similar-drugs">
            <h3>Similar Drugs</h3>
            <div className="similar-drugs-list">
              {molecules
                .filter(mol => mol.name !== selectedRelationship.Drug)
                .sort(() => 0.5 - Math.random())
                .slice(0, 3)
                .map(mol => (
                  <div key={mol.id} className="similar-drug-card">
                    <div className="drug-name">{mol.name}</div>
                    <div className="similarity-score">
                      Similarity: {(Math.random() * 20 + 70).toFixed(1)}%
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraphDiscovery; 