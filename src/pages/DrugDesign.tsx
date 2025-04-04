import React, { useState } from 'react';
import DrugDesignWorkbench from '../components/DrugDesignWorkbench';
import AIAssistant from '../components/AIAssistant';

const DrugDesign: React.FC = () => {
  const [showAssistant, setShowAssistant] = useState(false);

  return (
    <div className="drug-design-page">
      <header className="page-header">
        <h1>Drug Design & Optimization</h1>
        <p>Design, optimize, and analyze drug candidates</p>
      </header>
      
      <div className="content-header">
        <div className="section-title">
          <h2>Design Workbench</h2>
        </div>
        <button 
          className="ai-assistant-btn"
          onClick={() => setShowAssistant(!showAssistant)}
        >
          {showAssistant ? 'Hide AI Assistant' : 'Show AI Assistant'}
        </button>
      </div>
      
      <div className="main-content-area">
        <div className="explorer-container">
          <DrugDesignWorkbench />
        </div>
        
        {showAssistant && (
          <div className="chatbot-container">
            <AIAssistant context="drug-design" />
          </div>
        )}
      </div>
    </div>
  );
};

export default DrugDesign; 