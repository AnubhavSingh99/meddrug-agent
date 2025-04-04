// API service for MediGraph Agent

// Base API URL - would point to your backend server in production
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.medigraph.com/v1' 
  : 'http://localhost:5000/api';

// Helper function for API requests
async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  // In a real app, you would add authentication headers here
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      // 'Authorization': `Bearer ${getToken()}`, // Uncomment when auth is implemented
    },
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...defaultOptions,
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'API request failed');
  }

  return response.json();
}

// Dataset API endpoints
export const datasetApi = {
  // Get available datasets
  getDatasets: () => fetchWithAuth('/datasets'),
  
  // Get a specific dataset
  getDataset: (id: string) => fetchWithAuth(`/datasets/${id}`),
  
  // Search within a dataset
  searchDataset: (id: string, query: string) => 
    fetchWithAuth(`/datasets/${id}/search?q=${encodeURIComponent(query)}`),
    
  // Import a dataset from an external source (PubChem, BindingDB, etc.)
  importDataset: (source: string, options: any) => 
    fetchWithAuth('/datasets/import', {
      method: 'POST',
      body: JSON.stringify({ source, options }),
    }),
};

// Molecule API endpoints
export const moleculeApi = {
  // Get molecules with optional filtering
  getMolecules: (filters: any = {}) => 
    fetchWithAuth(`/molecules?${new URLSearchParams(filters).toString()}`),
  
  // Get a specific molecule by ID
  getMolecule: (id: string) => fetchWithAuth(`/molecules/${id}`),
  
  // Generate new molecules based on parameters
  generateMolecules: (params: any) => 
    fetchWithAuth('/molecules/generate', {
      method: 'POST',
      body: JSON.stringify(params),
    }),
    
  // Run prediction models on a molecule
  predictProperties: (id: string, models: string[]) => 
    fetchWithAuth(`/molecules/${id}/predict`, {
      method: 'POST',
      body: JSON.stringify({ models }),
    }),
};

// Computational API endpoints
export const computationApi = {
  // Run molecular docking simulation
  runDocking: (moleculeId: string, targetId: string, options: any = {}) => 
    fetchWithAuth('/computation/docking', {
      method: 'POST',
      body: JSON.stringify({ moleculeId, targetId, options }),
    }),
    
  // Run molecular dynamics simulation
  runDynamics: (moleculeId: string, options: any = {}) => 
    fetchWithAuth('/computation/dynamics', {
      method: 'POST',
      body: JSON.stringify({ moleculeId, options }),
    }),
    
  // Get status of a computation job
  getJobStatus: (jobId: string) => fetchWithAuth(`/computation/jobs/${jobId}`),
    
  // Cancel a computation job
  cancelJob: (jobId: string) => 
    fetchWithAuth(`/computation/jobs/${jobId}/cancel`, {
      method: 'POST',
    }),
};

// Graph API endpoints
export const graphApi = {
  // Get graph relationships
  getRelationships: (filters: any = {}) => 
    fetchWithAuth(`/graph/relationships?${new URLSearchParams(filters).toString()}`),
    
  // Get a specific relationship
  getRelationship: (id: string) => fetchWithAuth(`/graph/relationships/${id}`),
    
  // Find paths between entities
  findPaths: (startId: string, endId: string, options: any = {}) => 
    fetchWithAuth('/graph/paths', {
      method: 'POST',
      body: JSON.stringify({ startId, endId, options }),
    }),
}; 