import React, { useState, useEffect } from 'react';
import { loadCSVDataset } from '../utils/datasetLoader';

interface MolecularSearchProps {
  onSelectMolecule: (molecule: any) => void;
}

const MolecularSearch: React.FC<MolecularSearchProps> = ({ onSelectMolecule }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'name' | 'smiles' | 'similarity'>('name');
  const [molecules, setMolecules] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load molecules from PubChem dataset
    const loadMolecules = async () => {
      setIsLoading(true);
      try {
        const data = await loadCSVDataset('pubchem_mock.csv');
        setMolecules(data);
      } catch (error) {
        console.error('Error loading molecules:', error);
      }
      setIsLoading(false);
    };

    loadMolecules();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    
    // Simulate search with a delay
    setTimeout(() => {
      let results;
      
      switch (searchType) {
        case 'name':
          results = molecules.filter(mol => 
            mol.Name?.toLowerCase().includes(searchQuery.toLowerCase())
          );
          break;
        case 'smiles':
          results = molecules.filter(mol => 
            mol.SMILES?.includes(searchQuery)
          );
          break;
        case 'similarity':
          // In a real app, this would use a fingerprint-based similarity search
          // For the MVP, we'll just do a partial SMILES match
          results = molecules.filter(mol => {
            const smiles = mol.SMILES || '';
            // Count common substructures (very simplified)
            const commonChars = [...searchQuery].filter(char => smiles.includes(char)).length;
            const similarity = commonChars / searchQuery.length;
            // Add similarity score to the molecule
            return similarity > 0.3 ? { ...mol, similarity: similarity.toFixed(2) } : null;
          });
          break;
        default:
          results = [];
      }
      
      setSearchResults(results.slice(0, 20)); // Limit to 20 results
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="molecular-search">
      <h2>Molecular Search</h2>
      
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-controls">
          <div className="search-type-selector">
            <label>
              <input 
                type="radio" 
                name="searchType" 
                checked={searchType === 'name'} 
                onChange={() => setSearchType('name')} 
              />
              Name
            </label>
            <label>
              <input 
                type="radio" 
                name="searchType" 
                checked={searchType === 'smiles'} 
                onChange={() => setSearchType('smiles')} 
              />
              SMILES
            </label>
            <label>
              <input 
                type="radio" 
                name="searchType" 
                checked={searchType === 'similarity'} 
                onChange={() => setSearchType('similarity')} 
              />
              Similarity
            </label>
          </div>
          
          <div className="search-input-container">
            <input
              type="text"
              placeholder={`Search by ${searchType}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-button">Search</button>
          </div>
        </div>
        
        {searchType === 'similarity' && (
          <div className="search-help">
            <p>Enter a SMILES string to find similar molecules. Example: CC(=O)OC1=CC=CC=C1C(=O)O (Aspirin)</p>
          </div>
        )}
      </form>
      
      <div className="search-results">
        {isLoading ? (
          <div className="loading-indicator">Searching molecules...</div>
        ) : searchResults.length > 0 ? (
          <div className="results-table-container">
            <table className="results-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>SMILES</th>
                  <th>Molecular Weight</th>
                  {searchType === 'similarity' && <th>Similarity</th>}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {searchResults.map((molecule, index) => (
                  <tr key={index}>
                    <td>{molecule.Name}</td>
                    <td className="smiles-cell">{molecule.SMILES}</td>
                    <td>{molecule.MolecularWeight}</td>
                    {searchType === 'similarity' && <td>{molecule.similarity || 'N/A'}</td>}
                    <td>
                      <button 
                        className="view-molecule-btn"
                        onClick={() => onSelectMolecule(molecule)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : searchQuery ? (
          <div className="no-results">No molecules found matching your search criteria.</div>
        ) : null}
      </div>
    </div>
  );
};

export default MolecularSearch; 