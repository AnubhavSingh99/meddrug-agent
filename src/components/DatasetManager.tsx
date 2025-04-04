import React, { useState, useEffect } from 'react';
import { loadCSVDataset, datasetDescriptions, availableDatasets } from '../utils/datasetLoader';
import DatasetAnalyzer from './DatasetAnalyzer';

interface Dataset {
  id: string;
  name: string;
  source: string;
  description: string;
  data: Record<string, string>[];
  lastUpdated: string;
}

const DatasetManager: React.FC = () => {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [analyzingDataset, setAnalyzingDataset] = useState<string | null>(null);

  useEffect(() => {
    async function loadDatasets() {
      try {
        const loadedDatasets = await Promise.all(
          availableDatasets.map(async (filename) => {
            const data = await loadCSVDataset(filename);
            return {
              id: filename.replace('_mock.csv', ''),
              name: datasetDescriptions[filename].name,
              source: datasetDescriptions[filename].source,
              description: datasetDescriptions[filename].description,
              data,
              lastUpdated: new Date().toISOString().split('T')[0],
            };
          })
        );
        
        setDatasets(loadedDatasets);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading datasets:', error);
        setError('Failed to load datasets. Please try again later.');
        setIsLoading(false);
      }
    }
    
    loadDatasets();
  }, []);

  const handleViewDataset = (dataset: Dataset) => {
    setSelectedDataset(dataset);
    setAnalyzingDataset(null);
  };

  const handleCloseDatasetView = () => {
    setSelectedDataset(null);
  };

  const handleAnalyzeDataset = (datasetId: string) => {
    setAnalyzingDataset(datasetId);
    setSelectedDataset(null);
  };

  const handleCloseAnalyzer = () => {
    setAnalyzingDataset(null);
  };

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    // In a real app, this would filter the data
    console.log('Searching for:', searchQuery);
  };

  if (isLoading) {
    return <div className="loading-spinner">Loading datasets...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  if (analyzingDataset) {
    return <DatasetAnalyzer datasetId={analyzingDataset} onClose={handleCloseAnalyzer} />;
  }

  return (
    <div className="dataset-manager">
      {selectedDataset ? (
        <div className="dataset-viewer">
          <div className="dataset-viewer-header">
            <h2>{selectedDataset.name}</h2>
            <button className="close-btn" onClick={handleCloseDatasetView}>×</button>
          </div>
          
          <div className="dataset-search">
            <form onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search in dataset..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit">Search</button>
            </form>
          </div>
          
          <div className="dataset-table-container">
            {selectedDataset.data.length > 0 ? (
              <table className="dataset-table">
                <thead>
                  <tr>
                    {Object.keys(selectedDataset.data[0]).map(header => (
                      <th key={header}>{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {selectedDataset.data.slice(0, 100).map((row, index) => (
                    <tr key={index}>
                      {Object.values(row).map((value, i) => (
                        <td key={i}>{value}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="no-data">No data available in this dataset.</p>
            )}
            
            {selectedDataset.data.length > 100 && (
              <div className="dataset-pagination">
                <p>Showing 1-100 of {selectedDataset.data.length} entries</p>
                <div className="pagination-controls">
                  <button disabled>Previous</button>
                  <span className="page-indicator">Page 1</span>
                  <button>Next</button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="dataset-header">
            <h2>Available Datasets</h2>
          </div>
          
          <div className="datasets-grid">
            {datasets.map(dataset => (
              <div key={dataset.id} className="dataset-card">
                <div className="dataset-card-header">
                  <h3>{dataset.name}</h3>
                  <span className="dataset-source">{dataset.source}</span>
                </div>
                <p className="dataset-description">{dataset.description}</p>
                <div className="dataset-stats">
                  <div className="stat">
                    <span className="stat-value">{dataset.data.length}</span>
                    <span className="stat-label">Entries</span>
                  </div>
                  <div className="stat">
                    <span className="stat-value">{Object.keys(dataset.data[0] || {}).length}</span>
                    <span className="stat-label">Fields</span>
                  </div>
                </div>
                <div className="dataset-actions">
                  <button 
                    className="view-dataset-btn"
                    onClick={() => handleViewDataset(dataset)}
                  >
                    View Dataset
                  </button>
                  <button 
                    className="analyze-btn"
                    onClick={() => handleAnalyzeDataset(dataset.id)}
                  >
                    Analyze
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default DatasetManager; 