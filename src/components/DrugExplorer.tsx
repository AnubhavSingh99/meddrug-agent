import React, { useState, useEffect } from 'react';
import { Molecule, molecules } from '../data/molecules';

interface DrugExplorerProps {
  onSelectMolecule?: (molecule: Molecule) => void;
}

const DrugExplorer: React.FC<DrugExplorerProps> = ({ onSelectMolecule }) => {
  const [filteredMolecules, setFilteredMolecules] = useState<Molecule[]>(molecules);
  const [sortField, setSortField] = useState<keyof Molecule>('Binding_Affinity');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    let result = [...molecules];
    
    // Apply status filter
    if (statusFilter !== 'All') {
      result = result.filter(molecule => molecule.Status === statusFilter);
    }
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(molecule => 
        molecule.name.toLowerCase().includes(query) || 
        molecule.SMILES.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      if (sortField === 'Binding_Affinity') {
        // For binding affinity, lower (more negative) is better
        return sortDirection === 'asc' 
          ? a[sortField] - b[sortField]
          : b[sortField] - a[sortField];
      } else {
        // For other numeric fields, higher is better
        return sortDirection === 'asc' 
          ? b[sortField] - a[sortField]
          : a[sortField] - b[sortField];
      }
    });
    
    setFilteredMolecules(result);
  }, [sortField, sortDirection, statusFilter, searchQuery]);

  const handleSort = (field: keyof Molecule) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: keyof Molecule) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="drug-explorer">
      <div className="explorer-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by name or SMILES..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-container">
          <label>Status:</label>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Generated">Generated</option>
            <option value="Approved">Approved</option>
            <option value="In Testing">In Testing</option>
            <option value="Failed">Failed</option>
          </select>
        </div>
      </div>
      
      <div className="table-container">
        <table className="molecules-table">
          <thead>
            <tr>
              <th>Structure</th>
              <th onClick={() => handleSort('name')}>
                Drug Name {getSortIcon('name')}
              </th>
              <th onClick={() => handleSort('Binding_Affinity')}>
                Binding Affinity {getSortIcon('Binding_Affinity')}
              </th>
              <th onClick={() => handleSort('ADMET_Score')}>
                ADMET Score {getSortIcon('ADMET_Score')}
              </th>
              <th onClick={() => handleSort('Similarity_Score')}>
                Similarity {getSortIcon('Similarity_Score')}
              </th>
              <th onClick={() => handleSort('Status')}>
                Status {getSortIcon('Status')}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMolecules.map(molecule => (
              <tr key={molecule.id}>
                <td className="molecule-structure-cell">
                  <div className="structure-thumbnail">
                    {molecule.structure_url ? (
                      <img src={molecule.structure_url} alt={molecule.name} />
                    ) : (
                      <div className="structure-placeholder">Structure</div>
                    )}
                  </div>
                </td>
                <td>{molecule.name}</td>
                <td className="numeric-cell">{molecule.Binding_Affinity.toFixed(1)} kcal/mol</td>
                <td className="numeric-cell">{molecule.ADMET_Score.toFixed(1)}</td>
                <td className="numeric-cell">{molecule.Similarity_Score.toFixed(1)}%</td>
                <td>
                  <span className={`status-badge status-${molecule.Status.toLowerCase()}`}>
                    {molecule.Status}
                  </span>
                </td>
                <td>
                  <button 
                    className="view-details-btn"
                    onClick={() => onSelectMolecule && onSelectMolecule(molecule)}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DrugExplorer; 