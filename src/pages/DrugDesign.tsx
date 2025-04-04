import React, { useState } from 'react';
import { Molecule } from '../data/molecules';
import DrugExplorer from '../components/DrugExplorer';
import MoleculeViewer from '../components/MoleculeViewer';
import AIChatbot from '../components/AIChatbot';

const DrugDesign: React.FC = () => {
  const [selectedMolecule, setSelectedMolecule] = useState<Molecule | null>(null);
  const [showChatbot, setShowChatbot] = useState(false);

  return (
    <div className="drug-design">
      <header className="page-header">
        <h1>Interactive Drug Design</h1>
        <p>Design and optimize drug compounds in real-time</p>
      </header>
      
      <div className="drug-design-content">
        <div className="content-header">
          <h2>Drug Candidate Explorer</h2>
          <button 
            className="ai-assistant-btn"
            onClick={() => setShowChatbot(!showChatbot)}
          >
            {showChatbot ? 'Hide AI Assistant' : 'Show AI Assistant'}
          </button>
        </div>
        
        <div className="main-content-area">
          <div className="explorer-container">
            <DrugExplorer onSelectMolecule={setSelectedMolecule} />
          </div>
          
          {showChatbot && (
            <div className="chatbot-container">
              <AIChatbot />
            </div>
          )}
        </div>
        
        {selectedMolecule && (
          <div className="molecule-viewer-overlay">
            <MoleculeViewer 
              molecule={selectedMolecule} 
              onClose={() => setSelectedMolecule(null)} 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DrugDesign; 