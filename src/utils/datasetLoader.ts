// Utility for loading and parsing dataset files

// Function to fetch and parse CSV files
export async function loadCSVDataset(filename: string) {
  try {
    const response = await fetch(`/dataset/${filename}`);
    const csvText = await response.text();
    return parseCSV(csvText);
  } catch (error) {
    console.error(`Error loading dataset ${filename}:`, error);
    return [];
  }
}

// Simple CSV parser
function parseCSV(csvText: string) {
  const lines = csvText.split('\n');
  if (lines.length < 2) return [];
  
  const headers = lines[0].split(',').map(h => h.trim());
  
  return lines.slice(1)
    .filter(line => line.trim().length > 0)
    .map(line => {
      const values = line.split(',').map(v => v.trim());
      const row: Record<string, string> = {};
      
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      
      return row;
    });
}

// Dataset descriptions
export const datasetDescriptions = {
  'pubchem_mock.csv': {
    name: 'PubChem Subset',
    description: 'Chemical compounds with their SMILES representation',
    source: 'PubChem',
  },
  'bindingdb_mock.csv': {
    name: 'BindingDB Dataset',
    description: 'Drug-target binding affinities',
    source: 'BindingDB',
  },
  'davis_mock.csv': {
    name: 'DAVIS Kinase Dataset',
    description: 'Kinase inhibitors and their target kinases',
    source: 'DAVIS',
  },
  'kiba_mock.csv': {
    name: 'KIBA Benchmark Dataset',
    description: 'Bioactivity scores for kinase inhibitors',
    source: 'KIBA',
  },
  'clintox_mock.csv': {
    name: 'ClinTox Dataset',
    description: 'Drug toxicity (approved vs. failed drugs)',
    source: 'ClinTox',
  },
};

// Get all available datasets
export const availableDatasets = Object.keys(datasetDescriptions); 