import React, { useState, useCallback, useEffect } from 'react'
import { Molecule, molecules } from '../data/molecules'
import MoleculeViewer from '../components/MoleculeViewer'

// Using emoji icons instead of react-icons until the package is installed
const ICONS = {
  flask: '🧪',
  atom: '⚛️',
  dna: '🧬',
  chart: '📈',
  filter: '🔍',
  save: '💾',
  download: '📥',
  share: '📤'
}

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
    targetProtein: 'EGFR',
    batchSize: 5
  })
  
  const [generatedMolecules, setGeneratedMolecules] = useState<Molecule[]>([])
  const [selectedMolecule, setSelectedMolecule] = useState<Molecule | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationMethod, setGenerationMethod] = useState<'de-novo' | 'scaffold' | 'optimization'>('de-novo')
  const [scaffoldSmiles, setScaffoldSmiles] = useState('')
  const [optimizationTarget, setOptimizationTarget] = useState<'potency' | 'admet' | 'balanced'>('balanced')
  const [sortBy, setSortBy] = useState<'bindingAffinity' | 'drugLikeness' | 'molecularWeight'>('bindingAffinity')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false)
  const [savedMolecules, setSavedMolecules] = useState<Molecule[]>([])
  
  // Common scaffolds for quick selection
  const commonScaffolds = [
    { name: 'Benzene', smiles: 'c1ccccc1', image: '/scaffolds/benzene.svg' },
    { name: 'Pyridine', smiles: 'c1ccncc1', image: '/scaffolds/pyridine.svg' },
    { name: 'Indole', smiles: 'c1ccc2c(c1)cc[nH]2', image: '/scaffolds/indole.svg' },
    { name: 'Piperazine', smiles: 'C1CNCCN1', image: '/scaffolds/piperazine.svg' },
    { name: 'Quinoline', smiles: 'c1ccc2cnccc2c1', image: '/scaffolds/quinoline.svg' },
    { name: 'Morpholine', smiles: 'C1COCCN1', image: '/scaffolds/morpholine.svg' }
  ]
  
  // Target proteins for selection with additional info
  const targetProteins = [
    { id: 'EGFR', name: 'EGFR (Epidermal Growth Factor Receptor)', disease: 'Cancer' },
    { id: 'JAK2', name: 'JAK2 (Janus Kinase 2)', disease: 'Myeloproliferative disorders' },
    { id: 'BRAF', name: 'BRAF (B-Raf Proto-Oncogene)', disease: 'Melanoma' },
    { id: 'ACE2', name: 'ACE2 (Angiotensin-Converting Enzyme 2)', disease: 'Hypertension, COVID-19' },
    { id: 'VEGFR', name: 'VEGFR (Vascular Endothelial Growth Factor Receptor)', disease: 'Cancer, AMD' },
    { id: 'HER2', name: 'HER2 (Human Epidermal Growth Factor Receptor 2)', disease: 'Breast cancer' },
    { id: 'ALK', name: 'ALK (Anaplastic Lymphoma Kinase)', disease: 'Lung cancer' },
    { id: 'CDK4/6', name: 'CDK4/6 (Cyclin-Dependent Kinases 4 and 6)', disease: 'Cancer' }
  ]
  
  const handleParamChange = (param: keyof GenerationParams, value: any) => {
    setGenerationParams(prev => ({
      ...prev,
      [param]: value
    }))
  }
  
  const handleRangeChange = (param: keyof GenerationParams, key: 'min' | 'max', value: number) => {
    setGenerationParams(prev => ({
      ...prev,
      [param]: {
        ...prev[param as keyof typeof prev],
        [key]: value
      }
    }))
  }
  
  const generateMolecules = useCallback(() => {
    setIsGenerating(true)
    
    // Simulate API call with delay
    setTimeout(() => {
      // Generate multiple molecules based on batch size
      const newMolecules: Molecule[] = []
      
      for (let i = 0; i < generationParams.batchSize; i++) {
        // Filter molecules based on parameters
        const filteredMolecules = molecules.filter(mol => 
          mol.molecularWeight >= generationParams.molecularWeight.min &&
          mol.molecularWeight <= generationParams.molecularWeight.max &&
          mol.logP >= generationParams.logP.min &&
          mol.logP <= generationParams.logP.max &&
          mol.numRotatableBonds >= generationParams.numRotatableBonds.min &&
          mol.numRotatableBonds <= generationParams.numRotatableBonds.max
        )
        
        // If we have filtered molecules, randomly select one
        if (filteredMolecules.length > 0) {
          const randomIndex = Math.floor(Math.random() * filteredMolecules.length)
          const selectedMolecule = filteredMolecules[randomIndex]
          
          // Create a new molecule with slightly modified properties to ensure diversity
          const newMolecule: Molecule = {
            ...selectedMolecule,
            id: `gen-${Date.now()}-${i}`,
            name: `Generated Compound ${i+1}`,
            bindingAffinity: selectedMolecule.bindingAffinity * (0.8 + Math.random() * 0.4), // +/- 20%
            drugLikeness: Math.min(1, Math.max(0, selectedMolecule.drugLikeness + (Math.random() * 0.4 - 0.2))),
            generationMetadata: {
              method: generationMethod,
              timestamp: new Date().toISOString(),
              targetProtein: generationParams.targetProtein,
              parameters: JSON.stringify(generationParams)
            }
          }
          
          newMolecules.push(newMolecule)
        }
      }
      
      // Sort the molecules based on the selected criteria
      const sortedMolecules = [...newMolecules].sort((a, b) => {
        const aValue = a[sortBy];
        const bValue = b[sortBy];
        
        if (sortOrder === 'asc') {
          return aValue - bValue;
        } else {
          return bValue - aValue;
        }
      });
      
      setGeneratedMolecules(sortedMolecules)
      setIsGenerating(false)
      
      // Select the first molecule by default
      if (sortedMolecules.length > 0) {
        setSelectedMolecule(sortedMolecules[0])
      }
    }, 2000)
  }, [generationParams, generationMethod, sortBy, sortOrder])
  
  const handleSelectMolecule = (molecule: Molecule) => {
    setSelectedMolecule(molecule)
  }
  
  const handleCloseMoleculeViewer = () => {
    setSelectedMolecule(null)
  }
  
  const handleSaveMolecule = (molecule: Molecule) => {
    setSavedMolecules(prev => {
      // Check if molecule is already saved
      if (prev.some(m => m.id === molecule.id)) {
        return prev;
      }
      return [...prev, molecule];
    });
  }
  
  const handleSortChange = (criteria: 'bindingAffinity' | 'drugLikeness' | 'molecularWeight') => {
    if (sortBy === criteria) {
      // Toggle sort order if clicking the same criteria
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(criteria);
      // Default to descending for binding affinity, ascending for others
      setSortOrder(criteria === 'bindingAffinity' ? 'desc' : 'asc');
    }
  }
  
  // Re-sort molecules when sort criteria changes
  useEffect(() => {
    if (generatedMolecules.length > 0) {
      const sortedMolecules = [...generatedMolecules].sort((a, b) => {
        const aValue = a[sortBy];
        const bValue = b[sortBy];
        
        if (sortOrder === 'asc') {
          return aValue - bValue;
        } else {
          return bValue - aValue;
        }
      });
      
      setGeneratedMolecules(sortedMolecules);
    }
  }, [sortBy, sortOrder]);
  
  return (
    <div className="molecular-generation-page">
      <div className="page-header">
        <div className="header-content">
          <h1><span className="header-icon">{ICONS.flask}</span> Molecular Generation</h1>
          <p className="page-description">
            Generate novel drug candidates using AI-powered molecular design algorithms.
          </p>
        </div>
        <div className="header-actions">
          <button className="action-button" onClick={() => setSavedMolecules([])}>
            {ICONS.download} Export Results
          </button>
          <button className="action-button secondary">
            {ICONS.share} Share
          </button>
        </div>
      </div>
      
      <div className="generation-container">
        <div className="generation-panel">
          <div className="panel-section generation-methods">
            <h3><span className="section-icon">{ICONS.dna}</span> Generation Method</h3>
            <div className="method-buttons">
              <button 
                className={`method-button ${generationMethod === 'de-novo' ? 'active' : ''}`}
                onClick={() => setGenerationMethod('de-novo')}
              >
                <div className="method-icon">🧪</div>
                <div className="method-content">
                  <div className="method-name">De Novo Design</div>
                  <div className="method-description">Create molecules from scratch</div>
                </div>
              </button>
              <button 
                className={`method-button ${generationMethod === 'scaffold' ? 'active' : ''}`}
                onClick={() => setGenerationMethod('scaffold')}
              >
                <div className="method-icon">⚙️</div>
                <div className="method-content">
                  <div className="method-name">Scaffold-Based</div>
                  <div className="method-description">Build around core structures</div>
                </div>
              </button>
              <button 
                className={`method-button ${generationMethod === 'optimization' ? 'active' : ''}`}
                onClick={() => setGenerationMethod('optimization')}
              >
                <div className="method-icon">📈</div>
                <div className="method-content">
                  <div className="method-name">Lead Optimization</div>
                  <div className="method-description">Improve existing molecules</div>
                </div>
              </button>
            </div>
          </div>
          
          {generationMethod === 'scaffold' && (
            <div className="panel-section scaffold-input">
              <h3><span className="section-icon">{ICONS.atom}</span> Scaffold Selection</h3>
              <div className="scaffold-input-field">
                <input 
                  type="text" 
                  value={scaffoldSmiles}
                  onChange={(e) => setScaffoldSmiles(e.target.value)}
                  placeholder="Enter scaffold SMILES..."
                  className="smiles-input"
                />
                <button className="clear-button" onClick={() => setScaffoldSmiles('')}>Clear</button>
              </div>
              
              <div className="common-scaffolds">
                <h4>Common Scaffolds</h4>
                <div className="scaffold-grid">
                  {commonScaffolds.map(scaffold => (
                    <div 
                      key={scaffold.name}
                      onClick={() => setScaffoldSmiles(scaffold.smiles)}
                      className={`scaffold-card ${scaffoldSmiles === scaffold.smiles ? 'selected' : ''}`}
                    >
                      <div className="scaffold-image">
                        <img src={scaffold.image} alt={scaffold.name} />
                      </div>
                      <div className="scaffold-name">{scaffold.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {generationMethod === 'optimization' && (
            <div className="panel-section optimization-settings">
              <h3><span className="section-icon">{ICONS.chart}</span> Optimization Target</h3>
              <div className="optimization-buttons">
                <button 
                  className={`optimization-button ${optimizationTarget === 'potency' ? 'active' : ''}`}
                  onClick={() => setOptimizationTarget('potency')}
                >
                  <div className="opt-icon">🎯</div>
                  <div className="opt-content">
                    <div className="opt-name">Potency</div>
                    <div className="opt-description">Maximize binding affinity</div>
                  </div>
                </button>
                <button 
                  className={`optimization-button ${optimizationTarget === 'admet' ? 'active' : ''}`}
                  onClick={() => setOptimizationTarget('admet')}
                >
                  <div className="opt-icon">💊</div>
                  <div className="opt-content">
                    <div className="opt-name">ADMET</div>
                    <div className="opt-description">Improve drug-like properties</div>
                  </div>
                </button>
                <button 
                  className={`optimization-button ${optimizationTarget === 'balanced' ? 'active' : ''}`}
                  onClick={() => setOptimizationTarget('balanced')}
                >
                  <div className="opt-icon">⚖️</div>
                  <div className="opt-content">
                    <div className="opt-name">Balanced</div>
                    <div className="opt-description">Optimize multiple properties</div>
                  </div>
                </button>
              </div>
            </div>
          )}
          
          <div className="panel-section generation-parameters">
            <div className="parameters-header">
              <h3><span className="section-icon">{ICONS.filter}</span> Parameters</h3>
              <button 
                className="advanced-toggle"
                onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
              >
                {showAdvancedOptions ? 'Hide Advanced' : 'Show Advanced'}
              </button>
            </div>
            
            <div className="parameter-group">
              <label>Target Protein</label>
              <select 
                value={generationParams.targetProtein}
                onChange={(e) => handleParamChange('targetProtein', e.target.value)}
                className="target-select"
              >
                {targetProteins.map(protein => (
                  <option key={protein.id} value={protein.id}>
                    {protein.name} ({protein.disease})
                  </option>
                ))}
              </select>
            </div>
            
            <div className="parameter-group">
              <div className="parameter-header">
                <label>Molecular Weight</label>
                <div className="parameter-value">
                  {generationParams.molecularWeight.min} - {generationParams.molecularWeight.max} Da
                </div>
              </div>
              <div className="range-slider">
                <div className="slider-track">
                  <div 
                    className="slider-fill" 
                    style={{ 
                      left: `${(generationParams.molecularWeight.min - 100) / 9}%`, 
                      width: `${(generationParams.molecularWeight.max - generationParams.molecularWeight.min) / 9}%` 
                    }}
                  ></div>
                </div>
                <input 
                  type="range" 
                  min="100" 
                  max="1000" 
                  step="10"
                  value={generationParams.molecularWeight.min}
                  onChange={(e) => handleRangeChange('molecularWeight', 'min', parseInt(e.target.value))}
                  className="range-input min"
                />
                <input 
                  type="range" 
                  min="100" 
                  max="1000" 
                  step="10"
                  value={generationParams.molecularWeight.max}
                  onChange={(e) => handleRangeChange('molecularWeight', 'max', parseInt(e.target.value))}
                  className="range-input max"
                />
              </div>
              <div className="range-labels">
                <span>100</span>
                <span>400</span>
                <span>700</span>
                <span>1000</span>
              </div>
            </div>
            
            <div className="parameter-group">
              <div className="parameter-header">
                <label>LogP (Lipophilicity)</label>
                <div className="parameter-value">
                  {generationParams.logP.min} - {generationParams.logP.max}
                </div>
              </div>
              <div className="range-slider">
                <div className="slider-track">
                  <div 
                    className="slider-fill" 
                    style={{ 
                      left: `${(generationParams.logP.min + 2) / 0.09}%`, 
                      width: `${(generationParams.logP.max - generationParams.logP.min) / 0.09}%` 
                    }}
                  ></div>
                </div>
                <input 
                  type="range" 
                  min="-2" 
                  max="7" 
                  step="0.1"
                  value={generationParams.logP.min}
                  onChange={(e) => handleRangeChange('logP', 'min', parseFloat(e.target.value))}
                  className="range-input min"
                />
                <input 
                  type="range" 
                  min="-2" 
                  max="7" 
                  step="0.1"
                  value={generationParams.logP.max}
                  onChange={(e) => handleRangeChange('logP', 'max', parseFloat(e.target.value))}
                  className="range-input max"
                />
              </div>
              <div className="range-labels">
                <span>-2</span>
                <span>1</span>
                <span>4</span>
                <span>7</span>
              </div>
            </div>
            
            <div className="parameter-group">
              <div className="parameter-header">
                <label>Rotatable Bonds</label>
                <div className="parameter-value">
                  {generationParams.numRotatableBonds.min} - {generationParams.numRotatableBonds.max}
                </div>
              </div>
              <div className="range-slider">
                <div className="slider-track">
                  <div 
                    className="slider-fill" 
                    style={{ 
                      left: `${(generationParams.numRotatableBonds.min) / 0.15}%`, 
                      width: `${(generationParams.numRotatableBonds.max - generationParams.numRotatableBonds.min) / 0.15}%` 
                    }}
                  ></div>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="15" 
                  step="1"
                  value={generationParams.numRotatableBonds.min}
                  onChange={(e) => handleRangeChange('numRotatableBonds', 'min', parseInt(e.target.value))}
                  className="range-input min"
                />
                <input 
                  type="range" 
                  min="0" 
                  max="15" 
                  step="1"
                  value={generationParams.numRotatableBonds.max}
                  onChange={(e) => handleRangeChange('numRotatableBonds', 'max', parseInt(e.target.value))}
                  className="range-input max"
                />
              </div>
              <div className="range-labels">
                <span>0</span>
                <span>5</span>
                <span>10</span>
                <span>15</span>
              </div>
            </div>
            
            {showAdvancedOptions && (
              <div className="advanced-parameters">
                <div className="parameter-group">
                  <label>Batch Size</label>
                  <div className="batch-size-selector">
                    <button 
                      className={`batch-button ${generationParams.batchSize === 3 ? 'active' : ''}`}
                      onClick={() => handleParamChange('batchSize', 3)}
                    >3</button>
                    <button 
                      className={`batch-button ${generationParams.batchSize === 5 ? 'active' : ''}`}
                      onClick={() => handleParamChange('batchSize', 5)}
                    >5</button>
                    <button 
                      className={`batch-button ${generationParams.batchSize === 10 ? 'active' : ''}`}
                      onClick={() => handleParamChange('batchSize', 10)}
                    >10</button>
                    <button 
                      className={`batch-button ${generationParams.batchSize === 20 ? 'active' : ''}`}
                      onClick={() => handleParamChange('batchSize', 20)}
                    >20</button>
                  </div>
                </div>
                
                {/* Additional advanced parameters could go here */}
              </div>
            )}
          </div>
          
          <button 
            className="generate-button"
            onClick={generateMolecules}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <div className="spinner"></div>
                Generating Molecules...
              </>
            ) : (
              <>
                {ICONS.flask} Generate Molecules
              </>
            )}
          </button>
        </div>
        
        <div className="results-panel">
          <div className="results-header">
            <h2>Generated Molecules</h2>
            
            {generatedMolecules.length > 0 && (
              <div className="results-actions">
                <div className="sort-controls">
                  <label>Sort by:</label>
                  <button 
                    className={`sort-button ${sortBy === 'bindingAffinity' ? 'active' : ''}`}
                    onClick={() => handleSortChange('bindingAffinity')}
                  >
                    Binding Affinity {sortBy === 'bindingAffinity' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </button>
                  <button 
                    className={`sort-button ${sortBy === 'drugLikeness' ? 'active' : ''}`}
                    onClick={() => handleSortChange('drugLikeness')}
                  >
                    Drug-likeness {sortBy === 'drugLikeness' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </button>
                  <button 
                    className={`sort-button ${sortBy === 'molecularWeight' ? 'active' : ''}`}
                    onClick={() => handleSortChange('molecularWeight')}
                  >
                    Molecular Weight {sortBy === 'molecularWeight' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {isGenerating ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Generating molecules...</p>
              <p className="loading-description">Our AI is exploring chemical space to find novel compounds that match your criteria.</p>
            </div>
          ) : generatedMolecules.length > 0 ? (
            <div className="molecules-grid">
              {generatedMolecules.map(molecule => (
                <div 
                  key={molecule.id} 
                  className={`molecule-card ${selectedMolecule?.id === molecule.id ? 'selected' : ''}`}
                  onClick={() => handleSelectMolecule(molecule)}
                >
                  <div className="molecule-image">
                    <img src={molecule.image} alt={molecule.name} />
                  </div>
                  <div className="molecule-info">
                    <h3>{molecule.name}</h3>
                    <div className="molecule-smiles">{molecule.smiles.substring(0, 20)}...</div>
                    <div className="molecule-properties">
                      <div className="property">
                        <span className="property-label">MW:</span>
                        <span className="property-value">{molecule.molecularWeight.toFixed(1)}</span>
                      </div>
                      <div className="property">
                        <span className="property-label">LogP:</span>
                        <span className="property-value">{molecule.logP.toFixed(2)}</span>
                      </div>
                      <div className="property">
                        <span className="property-label">Binding:</span>
                        <span className="property-value">{molecule.bindingAffinity.toFixed(1)} nM</span>
                      </div>
                    </div>
                    <div className="molecule-actions">
                      <button 
                        className="molecule-action-btn view-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectMolecule(molecule);
                        }}
                      >
                        View
                      </button>
                      <button 
                        className="molecule-action-btn save-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSaveMolecule(molecule);
                        }}
                      >
                        {ICONS.save} Save
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-results">
              <div className="no-results-icon">🧪</div>
              <h3>No molecules generated yet</h3>
              <p>Adjust parameters and click "Generate Molecules" to create novel drug candidates.</p>
            </div>
          )}
        </div>
      </div>
      
      {selectedMolecule && (
        <MoleculeViewer 
          molecule={selectedMolecule} 
          onClose={handleCloseMoleculeViewer}
        />
      )}
    </div>
  )
}

export default MolecularGeneration 