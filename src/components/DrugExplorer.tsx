import React, { useState, useEffect, useMemo } from 'react';
import { Molecule, molecules } from '../data/molecules';

interface DrugExplorerProps {
  molecules: Molecule[];
  onSelectMolecule: (molecule: Molecule) => void;
}

const DrugExplorer: React.FC<DrugExplorerProps> = ({ molecules, onSelectMolecule }) => {
  const [filteredMolecules, setFilteredMolecules] = useState<Molecule[]>(molecules);
  const [sortField, setSortField] = useState<keyof Molecule>('Binding_Affinity');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filters, setFilters] = useState({
    status: 'All',
    bindingThreshold: -9.0,
    admetThreshold: 80,
    similarityThreshold: 85
  });
  const [searchQuery, setSearchQuery] = useState('');

  // Enhanced filtering logic
  const applyFilters = useMemo(() => {
    return molecules.filter(mol => {
      if (filters.status !== 'All' && mol.Status !== filters.status) return false;
      if (mol.Binding_Affinity > filters.bindingThreshold) return false;
      if (mol.ADMET_Score < filters.admetThreshold) return false;
      if (mol.Similarity_Score < filters.similarityThreshold) return false;
      
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          mol.name.toLowerCase().includes(query) ||
          mol.SMILES.toLowerCase().includes(query) ||
          mol.Status.toLowerCase().includes(query)
        );
      }
      
      return true;
    });
  }, [molecules, filters, searchQuery]);

  // Enhanced sorting with multiple criteria
  const sortMolecules = useMemo(() => {
    return [...applyFilters].sort((a, b) => {
      let comparison = 0;
      
      // Primary sort by selected field
      if (typeof a[sortField] === 'number' && typeof b[sortField] === 'number') {
        comparison = sortField === 'Binding_Affinity' 
          ? (a[sortField] as number) - (b[sortField] as number)
          : (b[sortField] as number) - (a[sortField] as number);
      } else {
        // Handle non-numeric fields (like Status) using string comparison
        comparison = String(b[sortField]).localeCompare(String(a[sortField]));
      }
      
      // Secondary sort by ADMET score
      if (comparison === 0) {
        comparison = b.ADMET_Score - a.ADMET_Score;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [applyFilters, sortField, sortDirection]);

  useEffect(() => {
    setFilteredMolecules(sortMolecules);
  }, [sortMolecules]);

  // Add statistical analysis
  const statistics = useMemo(() => {
    if (filteredMolecules.length === 0) return null;
    
    return {
      count: filteredMolecules.length,
      averageBinding: filteredMolecules.reduce((sum, mol) => sum + mol.Binding_Affinity, 0) / filteredMolecules.length,
      averageADMET: filteredMolecules.reduce((sum, mol) => sum + mol.ADMET_Score, 0) / filteredMolecules.length,
      topCandidate: filteredMolecules.reduce((best, mol) => 
        mol.Binding_Affinity < best.Binding_Affinity ? mol : best
      ),
      statusDistribution: filteredMolecules.reduce((acc, mol) => {
        acc[mol.Status] = (acc[mol.Status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
  }, [filteredMolecules]);

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
            value={filters.status} 
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
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
      
      {statistics && (
        <div className="statistics-panel">
          <h3>Analysis Summary</h3>
          <div className="statistics-grid">
            <div className="stat-card">
              <h4>Total Molecules</h4>
              <p>{statistics.count}</p>
            </div>
            <div className="stat-card">
              <h4>Average Binding Affinity</h4>
              <p>{statistics.averageBinding.toFixed(2)} kcal/mol</p>
            </div>
            <div className="stat-card">
              <h4>Average ADMET Score</h4>
              <p>{statistics.averageADMET.toFixed(2)}</p>
            </div>
          </div>
          
          <h4>Status Distribution</h4>
          <div className="status-distribution">
            {Object.entries(statistics.statusDistribution).map(([status, count]) => (
              <div key={status} className="status-bar">
                <span>{status}</span>
                <div className="bar" style={{ width: `${(count / statistics.count) * 100}%` }}>
                  {count}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DrugExplorer; 