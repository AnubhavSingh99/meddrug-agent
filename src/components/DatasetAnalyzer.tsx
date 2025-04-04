import React, { useState, useEffect } from 'react';
import { loadCSVDataset, datasetDescriptions } from '../utils/datasetLoader';

interface DatasetAnalyzerProps {
  datasetId: string;
  onClose: () => void;
}

const DatasetAnalyzer: React.FC<DatasetAnalyzerProps> = ({ datasetId, onClose }) => {
  const [data, setData] = useState<Record<string, string>[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  
  const filename = `${datasetId}_mock.csv`;
  const datasetInfo = datasetDescriptions[filename];

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const loadedData = await loadCSVDataset(filename);
        setData(loadedData);
        
        // Perform basic analysis on the data
        const analysis = analyzeDataset(loadedData, datasetId);
        setAnalysisResults(analysis);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading dataset for analysis:', error);
        setError('Failed to load dataset for analysis.');
        setIsLoading(false);
      }
    }
    
    loadData();
  }, [datasetId, filename]);

  // Function to analyze dataset based on its type
  const analyzeDataset = (data: Record<string, string>[], datasetId: string) => {
    switch (datasetId) {
      case 'pubchem':
        return analyzePubChem(data);
      case 'bindingdb':
        return analyzeBindingDB(data);
      case 'davis':
        return analyzeDAVIS(data);
      case 'kiba':
        return analyzeKIBA(data);
      case 'clintox':
        return analyzeClinTox(data);
      default:
        return {
          summary: {
            rowCount: data.length,
            columnCount: Object.keys(data[0] || {}).length,
          }
        };
    }
  };

  // Dataset-specific analysis functions
  const analyzePubChem = (data: Record<string, string>[]) => {
    // Count compounds by molecular weight range
    const mwRanges = {
      'Under 200': 0,
      '200-300': 0,
      '300-400': 0,
      '400-500': 0,
      'Over 500': 0,
    };
    
    data.forEach(row => {
      const mw = parseFloat(row.MolecularWeight || '0');
      if (mw < 200) mwRanges['Under 200']++;
      else if (mw < 300) mwRanges['200-300']++;
      else if (mw < 400) mwRanges['300-400']++;
      else if (mw < 500) mwRanges['400-500']++;
      else mwRanges['Over 500']++;
    });
    
    return {
      summary: {
        rowCount: data.length,
        columnCount: Object.keys(data[0] || {}).length,
      },
      molecularWeightDistribution: mwRanges,
    };
  };

  const analyzeBindingDB = (data: Record<string, string>[]) => {
    // Count by binding affinity ranges
    const affinityRanges = {
      'Strong (<1 nM)': 0,
      'Moderate (1-100 nM)': 0,
      'Weak (>100 nM)': 0,
    };
    
    data.forEach(row => {
      const affinity = parseFloat(row.BindingAffinity || '0');
      if (affinity < 1) affinityRanges['Strong (<1 nM)']++;
      else if (affinity <= 100) affinityRanges['Moderate (1-100 nM)']++;
      else affinityRanges['Weak (>100 nM)']++;
    });
    
    return {
      summary: {
        rowCount: data.length,
        columnCount: Object.keys(data[0] || {}).length,
      },
      affinityDistribution: affinityRanges,
    };
  };

  const analyzeDAVIS = (data: Record<string, string>[]) => {
    // Count interactions by kinase family
    const kinaseFamilies: Record<string, number> = {};
    
    data.forEach(row => {
      const family = row.KinaseFamily || 'Unknown';
      kinaseFamilies[family] = (kinaseFamilies[family] || 0) + 1;
    });
    
    return {
      summary: {
        rowCount: data.length,
        columnCount: Object.keys(data[0] || {}).length,
      },
      kinaseFamilyDistribution: kinaseFamilies,
    };
  };

  const analyzeKIBA = (data: Record<string, string>[]) => {
    // Analyze KIBA scores
    const scoreRanges = {
      'Low (0-3)': 0,
      'Medium (3-6)': 0,
      'High (6-10)': 0,
      'Very High (>10)': 0,
    };
    
    data.forEach(row => {
      const score = parseFloat(row.KIBAScore || '0');
      if (score <= 3) scoreRanges['Low (0-3)']++;
      else if (score <= 6) scoreRanges['Medium (3-6)']++;
      else if (score <= 10) scoreRanges['High (6-10)']++;
      else scoreRanges['Very High (>10)']++;
    });
    
    return {
      summary: {
        rowCount: data.length,
        columnCount: Object.keys(data[0] || {}).length,
      },
      scoreDistribution: scoreRanges,
    };
  };

  const analyzeClinTox = (data: Record<string, string>[]) => {
    // Count approved vs. failed drugs
    let approved = 0;
    let failed = 0;
    
    data.forEach(row => {
      if (row.Approved === 'Yes') approved++;
      else failed++;
    });
    
    return {
      summary: {
        rowCount: data.length,
        columnCount: Object.keys(data[0] || {}).length,
      },
      approvalStatus: {
        'Approved': approved,
        'Failed': failed,
      },
    };
  };

  if (isLoading) {
    return (
      <div className="dataset-analyzer loading">
        <div className="analyzer-header">
          <h2>Analyzing {datasetInfo?.name || datasetId}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="loading-spinner">Loading dataset for analysis...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dataset-analyzer error">
        <div className="analyzer-header">
          <h2>Error</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="dataset-analyzer">
      <div className="analyzer-header">
        <h2>Analysis: {datasetInfo?.name || datasetId}</h2>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>
      
      <div className="analyzer-content">
        <div className="analysis-summary">
          <h3>Dataset Summary</h3>
          <div className="summary-stats">
            <div className="stat-card">
              <div className="stat-value">{analysisResults?.summary.rowCount}</div>
              <div className="stat-label">Entries</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{analysisResults?.summary.columnCount}</div>
              <div className="stat-label">Fields</div>
            </div>
          </div>
        </div>
        
        {datasetId === 'pubchem' && analysisResults?.molecularWeightDistribution && (
          <div className="analysis-section">
            <h3>Molecular Weight Distribution</h3>
            <div className="chart-container">
              <div className="bar-chart">
                {Object.entries(analysisResults.molecularWeightDistribution).map(([range, count]: [string, any]) => (
                  <div key={range} className="chart-item">
                    <div className="bar-label">{range}</div>
                    <div className="bar-container">
                      <div 
                        className="bar-fill"
                        style={{ 
                          width: `${(count / data.length) * 100}%`,
                          backgroundColor: '#3498db'
                        }}
                      ></div>
                    </div>
                    <div className="bar-value">{count}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {datasetId === 'bindingdb' && analysisResults?.affinityDistribution && (
          <div className="analysis-section">
            <h3>Binding Affinity Distribution</h3>
            <div className="chart-container">
              <div className="bar-chart">
                {Object.entries(analysisResults.affinityDistribution).map(([range, count]: [string, any]) => (
                  <div key={range} className="chart-item">
                    <div className="bar-label">{range}</div>
                    <div className="bar-container">
                      <div 
                        className="bar-fill"
                        style={{ 
                          width: `${(count / data.length) * 100}%`,
                          backgroundColor: '#e74c3c'
                        }}
                      ></div>
                    </div>
                    <div className="bar-value">{count}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {datasetId === 'davis' && analysisResults?.kinaseFamilyDistribution && (
          <div className="analysis-section">
            <h3>Kinase Family Distribution</h3>
            <div className="chart-container">
              <div className="bar-chart">
                {Object.entries(analysisResults.kinaseFamilyDistribution)
                  .sort((a, b) => (b[1] as number) - (a[1] as number))
                  .slice(0, 10)
                  .map(([family, count]: [string, any]) => (
                    <div key={family} className="chart-item">
                      <div className="bar-label">{family}</div>
                      <div className="bar-container">
                        <div 
                          className="bar-fill"
                          style={{ 
                            width: `${(count / data.length) * 100}%`,
                            backgroundColor: '#2ecc71'
                          }}
                        ></div>
                      </div>
                      <div className="bar-value">{count}</div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
        
        {datasetId === 'kiba' && analysisResults?.scoreDistribution && (
          <div className="analysis-section">
            <h3>KIBA Score Distribution</h3>
            <div className="chart-container">
              <div className="bar-chart">
                {Object.entries(analysisResults.scoreDistribution).map(([range, count]: [string, any]) => (
                  <div key={range} className="chart-item">
                    <div className="bar-label">{range}</div>
                    <div className="bar-container">
                      <div 
                        className="bar-fill"
                        style={{ 
                          width: `${(count / data.length) * 100}%`,
                          backgroundColor: '#9b59b6'
                        }}
                      ></div>
                    </div>
                    <div className="bar-value">{count}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {datasetId === 'clintox' && analysisResults?.approvalStatus && (
          <div className="analysis-section">
            <h3>Drug Approval Status</h3>
            <div className="chart-container">
              <div className="pie-chart-container">
                <div className="pie-chart">
                  <div 
                    className="pie-slice approved"
                    style={{ 
                      transform: `rotate(0deg)`,
                      clip: `rect(0px, 150px, 300px, 0px)`,
                      backgroundColor: '#2ecc71',
                      opacity: 0.8,
                    }}
                  ></div>
                  <div 
                    className="pie-slice failed"
                    style={{ 
                      transform: `rotate(${(analysisResults.approvalStatus.Approved / data.length) * 360}deg)`,
                      clip: `rect(0px, 150px, 300px, 0px)`,
                      backgroundColor: '#e74c3c',
                      opacity: 0.8,
                    }}
                  ></div>
                </div>
                <div className="pie-legend">
                  <div className="legend-item">
                    <div className="legend-color" style={{ backgroundColor: '#2ecc71' }}></div>
                    <div className="legend-label">Approved: {analysisResults.approvalStatus.Approved}</div>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color" style={{ backgroundColor: '#e74c3c' }}></div>
                    <div className="legend-label">Failed: {analysisResults.approvalStatus.Failed}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="analysis-actions">
          <button className="action-btn">Export Analysis</button>
          <button className="action-btn">Generate Report</button>
        </div>
      </div>
    </div>
  );
};

export default DatasetAnalyzer; 