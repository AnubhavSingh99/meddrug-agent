import React, { useState, useEffect } from 'react';
import { datasetApi } from '../services/api';

interface Dataset {
  id: string;
  name: string;
  source: string;
  description: string;
  entryCount: number;
  lastUpdated: string;
}

const DatasetManager: React.FC = () => {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [importSource, setImportSource] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  useEffect(() => {
    // In a real implementation, this would fetch from the API
    // For the MVP, we'll use dummy data
    const dummyDatasets: Dataset[] = [
      {
        id: 'pubchem-subset',
        name: 'PubChem Subset',
        source: 'PubChem',
        description: 'A curated subset of drug-like compounds from PubChem',
        entryCount: 10000,
        lastUpdated: '2023-09-15',
      },
      {
        id: 'bindingdb-kinases',
        name: 'BindingDB Kinase Inhibitors',
        source: 'BindingDB',
        description: 'Kinase inhibitors with binding data from BindingDB',
        entryCount: 5432,
        lastUpdated: '2023-08-22',
      },
      {
        id: 'davis-kinase',
        name: 'DAVIS Kinase Dataset',
        source: 'DAVIS',
        description: 'Comprehensive kinase inhibition dataset',
        entryCount: 442,
        lastUpdated: '2023-07-10',
      },
      {
        id: 'kiba-benchmark',
        name: 'KIBA Benchmark Dataset',
        source: 'KIBA',
        description: 'Kinase inhibitor bioactivity dataset',
        entryCount: 2111,
        lastUpdated: '2023-06-30',
      },
      {
        id: 'clintox',
        name: 'ClinTox Dataset',
        source: 'ClinTox',
        description: 'Clinical toxicity dataset for drug compounds',
        entryCount: 1478,
        lastUpdated: '2023-05-18',
      },
    ];

    setTimeout(() => {
      setDatasets(dummyDatasets);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleImportDataset = () => {
    if (!importSource) return;
    
    setIsImporting(true);
    
    // Simulate API call
    setTimeout(() => {
      const newDataset: Dataset = {
        id: `custom-${Date.now()}`,
        name: `Custom ${importSource} Dataset`,
        source: importSource,
        description: `Imported dataset from ${importSource}`,
        entryCount: Math.floor(Math.random() * 5000) + 1000,
        lastUpdated: new Date().toISOString().split('T')[0],
      };
      
      setDatasets(prev => [...prev, newDataset]);
      setImportSource('');
      setIsImporting(false);
    }, 2000);
  };

  if (isLoading) {
    return <div className="loading-spinner">Loading datasets...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="dataset-manager">
      <div className="dataset-header">
        <h2>Available Datasets</h2>
        <div className="import-controls">
          <input
            type="text"
            placeholder="Dataset source URL or identifier"
            value={importSource}
            onChange={(e) => setImportSource(e.target.value)}
            disabled={isImporting}
          />
          <button 
            onClick={handleImportDataset}
            disabled={!importSource || isImporting}
          >
            {isImporting ? 'Importing...' : 'Import Dataset'}
          </button>
        </div>
      </div>
      
      <div className="datasets-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Source</th>
              <th>Entries</th>
              <th>Last Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {datasets.map(dataset => (
              <tr key={dataset.id}>
                <td>
                  <div className="dataset-name">{dataset.name}</div>
                  <div className="dataset-description">{dataset.description}</div>
                </td>
                <td>{dataset.source}</td>
                <td>{dataset.entryCount.toLocaleString()}</td>
                <td>{dataset.lastUpdated}</td>
                <td>
                  <div className="dataset-actions">
                    <button className="action-btn">Browse</button>
                    <button className="action-btn">Export</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DatasetManager; 