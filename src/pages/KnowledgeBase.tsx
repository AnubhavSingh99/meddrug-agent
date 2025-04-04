import React from 'react'
import DatasetManager from '../components/DatasetManager'

const KnowledgeBase: React.FC = () => {
  return (
    <div className="knowledge-base">
      <header className="page-header">
        <h1>Biomedical Knowledge Base</h1>
        <p>Explore integrated data from multiple biomedical sources</p>
      </header>
      
      <div className="kb-search-section">
        <div className="search-container">
          <input 
            type="text" 
            placeholder="Search drugs, proteins, or diseases..." 
            className="kb-search-input"
          />
          <button className="kb-search-button">Search</button>
        </div>
        
        <div className="search-filters">
          <div className="filter-group">
            <label>Data Source:</label>
            <select>
              <option value="all">All Sources</option>
              <option value="drugbank">DrugBank</option>
              <option value="chembl">ChEMBL</option>
              <option value="pdb">PDB</option>
              <option value="biosnap">BioSNAP</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Entity Type:</label>
            <select>
              <option value="all">All Types</option>
              <option value="drug">Drug</option>
              <option value="protein">Protein</option>
              <option value="disease">Disease</option>
              <option value="pathway">Pathway</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="kb-content">
        <DatasetManager />
      </div>
    </div>
  )
}

export default KnowledgeBase 