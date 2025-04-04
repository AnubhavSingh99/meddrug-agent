import React, { useState, useCallback } from 'react'
import { Molecule, molecules } from '../data/molecules'
import DrugExplorer from '../components/DrugExplorer'
import MoleculeViewer from '../components/MoleculeViewer'

interface RangeParam {
  min: number;
  max: number;
}

interface GenerationParams {
  molecularWeight: RangeParam;
  logP: RangeParam;
  numRotatableBonds: RangeParam;
  targetProtein: string;
  batchSize: number;
}

const MolecularGeneration: React.FC = () => {
  const [generationParams, setGenerationParams] = useState<GenerationParams>({
    molecularWeight: { min: 200, max: 500 },
    logP: { min: 1, max: 5 },
    numRotatableBonds: { min: 0, max: 10 },
    targetProtein: '',
    batchSize: 1000
  })
  
  const [generatedMolecules, setGeneratedMolecules] = useState<Molecule[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedMolecule, setSelectedMolecule] = useState<Molecule | null>(null)
  const [activeTab, setActiveTab] = useState<'parameters' | 'results'>('parameters')

  const handleParamChange = (param: keyof GenerationParams, subParam: keyof RangeParam, value: number) => {
    setGenerationParams({
      ...generationParams,
      [param]: {
        ...(generationParams[param] as RangeParam),
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

  const generateMolecules = useCallback(() => {
    setIsGenerating(true)
    
    // Filter molecules based on generation parameters
    const filteredMolecules = molecules.filter(mol => {
      // Extract molecular weight from SMILES (simplified mock calculation)
      const mockMolWeight = mol.SMILES.length * 10 // Simple mock calculation
      
      // Mock LogP calculation based on character distribution
      const mockLogP = (mol.SMILES.match(/[A-Z]/g) || []).length / mol.SMILES.length * 10
      
      // Mock rotatable bonds calculation
      const mockRotatableBonds = (mol.SMILES.match(/[-]/g) || []).length
      
      return (
        mockMolWeight >= generationParams.molecularWeight.min &&
        mockMolWeight <= generationParams.molecularWeight.max &&
        mockLogP >= generationParams.logP.min &&
        mockLogP <= generationParams.logP.max &&
        mockRotatableBonds >= generationParams.numRotatableBonds.min &&
        mockRotatableBonds <= generationParams.numRotatableBonds.max
      )
    })

    // Sort by binding affinity and take top N based on batchSize
    const sortedMolecules = [...filteredMolecules]
      .sort((a, b) => b.Binding_Affinity - a.Binding_Affinity)
      .slice(0, generationParams.batchSize)

    // Add generation metadata
    const generatedResults = sortedMolecules.map(mol => ({
      ...mol,
      generationMethod: 'AI-Generated',
      generationTimestamp: new Date().toISOString(),
      generationParameters: { ...generationParams }
    }))

    setTimeout(() => {
      setGeneratedMolecules(generatedResults)
      setIsGenerating(false)
      setActiveTab('results')
    }, 2000)
  }, [generationParams])

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
                onClick={generateMolecules}
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
            <DrugExplorer 
              molecules={generatedMolecules} 
              onSelectMolecule={setSelectedMolecule}
            />
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