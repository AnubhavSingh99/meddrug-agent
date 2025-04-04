import React, { useState } from 'react'
import { Molecule } from '../data/molecules'
import DrugExplorer from '../components/DrugExplorer'
import MoleculeViewer from '../components/MoleculeViewer'

const MolecularGeneration: React.FC = () => {
  const [generationParams, setGenerationParams] = useState({
    molecularWeight: { min: 200, max: 500 },
    logP: { min: 1, max: 5 },
    numRotatableBonds: { min: 0, max: 10 },
    targetProtein: '',
    batchSize: 1000
  })
  
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedMolecule, setSelectedMolecule] = useState<Molecule | null>(null)
  const [activeTab, setActiveTab] = useState<'parameters' | 'results'>('parameters')

  const handleParamChange = (param: string, subParam: string, value: number) => {
    setGenerationParams({
      ...generationParams,
      [param]: {
        ...generationParams[param as keyof typeof generationParams],
        [subParam]: value
      }
    })
  }

  const handleTextParamChange = (param: string, value: string | number) => {
    setGenerationParams({
      ...generationParams,
      [param]: value
    })
  }

  const handleGenerate = () => {
    setIsGenerating(true)
    
    // Simulate generation process
    setTimeout(() => {
      setIsGenerating(false)
      setActiveTab('results')
    }, 3000)
  }

  return (
    <div className="molecular-generation">
      <header className="page-header">
        <h1>Molecular Generation</h1>
        <p>Generate novel drug compounds using AI</p>
      </header>
      
      <div className="generation-container">
        <div className="generation-tabs">
          <button 
            className={`tab-btn ${activeTab === 'parameters' ? 'active' : ''}`}
            onClick={() => setActiveTab('parameters')}
          >
            Generation Parameters
          </button>
          <button 
            className={`tab-btn ${activeTab === 'results' ? 'active' : ''}`}
            onClick={() => setActiveTab('results')}
          >
            Generated Molecules
          </button>
        </div>
        
        {activeTab === 'parameters' && (
          <div className="parameters-panel">
            <div className="parameter-group">
              <h3>Molecular Properties</h3>
              
              <div className="parameter-row">
                <label>Molecular Weight (Da)</label>
                <div className="range-inputs">
                  <div className="range-input">
                    <span>Min:</span>
                    <input 
                      type="number" 
                      value={generationParams.molecularWeight.min}
                      onChange={(e) => handleParamChange('molecularWeight', 'min', parseInt(e.target.value))}
                      min={0}
                      max={1000}
                    />
                  </div>
                  <div className="range-input">
                    <span>Max:</span>
                    <input 
                      type="number" 
                      value={generationParams.molecularWeight.max}
                      onChange={(e) => handleParamChange('molecularWeight', 'max', parseInt(e.target.value))}
                      min={0}
                      max={1000}
                    />
                  </div>
                </div>
              </div>
              
              <div className="parameter-row">
                <label>LogP (Lipophilicity)</label>
                <div className="range-inputs">
                  <div className="range-input">
                    <span>Min:</span>
                    <input 
                      type="number" 
                      value={generationParams.logP.min}
                      onChange={(e) => handleParamChange('logP', 'min', parseFloat(e.target.value))}
                      min={-5}
                      max={10}
                      step={0.1}
                    />
                  </div>
                  <div className="range-input">
                    <span>Max:</span>
                    <input 
                      type="number" 
                      value={generationParams.logP.max}
                      onChange={(e) => handleParamChange('logP', 'max', parseFloat(e.target.value))}
                      min={-5}
                      max={10}
                      step={0.1}
                    />
                  </div>
                </div>
              </div>
              
              <div className="parameter-row">
                <label>Rotatable Bonds</label>
                <div className="range-inputs">
                  <div className="range-input">
                    <span>Min:</span>
                    <input 
                      type="number" 
                      value={generationParams.numRotatableBonds.min}
                      onChange={(e) => handleParamChange('numRotatableBonds', 'min', parseInt(e.target.value))}
                      min={0}
                      max={20}
                    />
                  </div>
                  <div className="range-input">
                    <span>Max:</span>
                    <input 
                      type="number" 
                      value={generationParams.numRotatableBonds.max}
                      onChange={(e) => handleParamChange('numRotatableBonds', 'max', parseInt(e.target.value))}
                      min={0}
                      max={20}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="parameter-group">
              <h3>Target Information</h3>
              
              <div className="parameter-row">
                <label>Target Protein (Optional)</label>
                <input 
                  type="text" 
                  value={generationParams.targetProtein}
                  onChange={(e) => handleTextParamChange('targetProtein', e.target.value)}
                  placeholder="e.g., EGFR, P53, ACE2"
                  className="full-width-input"
                />
              </div>
              
              <div className="parameter-row">
                <label>Batch Size</label>
                <input 
                  type="number" 
                  value={generationParams.batchSize}
                  onChange={(e) => handleTextParamChange('batchSize', parseInt(e.target.value))}
                  min={100}
                  max={10000}
                  step={100}
                  className="medium-width-input"
                />
              </div>
            </div>
            
            <div className="generation-actions">
              <button 
                className="generate-btn"
                onClick={handleGenerate}
                disabled={isGenerating}
              >
                {isGenerating ? 'Generating...' : 'Generate Molecules'}
              </button>
              
              {isGenerating && (
                <div className="generation-progress">
                  <div className="progress-bar">
                    <div className="progress-fill"></div>
                  </div>
                  <p>Generating novel molecules based on parameters...</p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {activeTab === 'results' && (
          <div className="results-panel">
            <DrugExplorer onSelectMolecule={setSelectedMolecule} />
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
  )
}

export default MolecularGeneration 