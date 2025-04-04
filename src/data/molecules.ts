export interface Molecule {
  id: string;
  name: string;
  SMILES: string;
  ADMET_Score: number;
  Binding_Affinity: number;
  Similarity_Score: number;
  Status: 'Generated' | 'Approved' | 'In Testing' | 'Failed';
  structure_url?: string;
}

export const molecules: Molecule[] = [
  {
    id: "mol-001",
    name: "MediG-001",
    SMILES: "CC(C)CC(C(=O)O)N",
    ADMET_Score: 87.5,
    Binding_Affinity: -9.3,
    Similarity_Score: 92.1,
    Status: "Generated",
    structure_url: "/molecules/mol-001.png"
  },
  {
    id: "mol-002",
    name: "FDA-Approved-Drug-001",
    SMILES: "C1=CC=C(C=C1)C2=CC=CC=C2O",
    ADMET_Score: 95.2,
    Binding_Affinity: -11.0,
    Similarity_Score: 98.3,
    Status: "Approved",
    structure_url: "/molecules/mol-002.png"
  },
  {
    id: "mol-003",
    name: "MediG-002",
    SMILES: "CC1=C(C=C(C=C1)NC(=O)C2=CC=C(C=C2)CN3CCN(CC3)C)NC4=NC=CC(=N4)C5=CN=CC=C5",
    ADMET_Score: 82.7,
    Binding_Affinity: -8.9,
    Similarity_Score: 88.4,
    Status: "In Testing",
    structure_url: "/molecules/mol-003.png"
  },
  {
    id: "mol-004",
    name: "MediG-003",
    SMILES: "COC1=CC=C(C=C1)CCN2C=NC3=C2C=C(C=C3)C(=O)N",
    ADMET_Score: 79.3,
    Binding_Affinity: -7.8,
    Similarity_Score: 85.2,
    Status: "Generated",
    structure_url: "/molecules/mol-004.png"
  },
  {
    id: "mol-005",
    name: "FDA-Approved-Drug-002",
    SMILES: "CC(C)NCC(COC1=CC=CC2=CC=CC=C21)O",
    ADMET_Score: 93.1,
    Binding_Affinity: -10.2,
    Similarity_Score: 96.7,
    Status: "Approved",
    structure_url: "/molecules/mol-005.png"
  },
  {
    id: "mol-006",
    name: "MediG-004",
    SMILES: "CC(C)(C)NC(=O)C1CCN(CC1)C2=NC3=C(C=NN3C=C2)C4=CC=C(C=C4)F",
    ADMET_Score: 68.9,
    Binding_Affinity: -6.5,
    Similarity_Score: 72.3,
    Status: "Failed",
    structure_url: "/molecules/mol-006.png"
  },
  {
    id: "mol-007",
    name: "MediG-005",
    SMILES: "COC1=C(C=C2C(=C1)C(=NC=N2)NC3=CC(=C(C=C3)F)Cl)OCCCN4CCOCC4",
    ADMET_Score: 84.6,
    Binding_Affinity: -9.1,
    Similarity_Score: 89.8,
    Status: "In Testing",
    structure_url: "/molecules/mol-007.png"
  },
  {
    id: "mol-008",
    name: "FDA-Approved-Drug-003",
    SMILES: "CN1C=NC2=C1C(=O)N(C(=O)N2C)C",
    ADMET_Score: 91.5,
    Binding_Affinity: -9.8,
    Similarity_Score: 94.2,
    Status: "Approved",
    structure_url: "/molecules/mol-008.png"
  }
]; 