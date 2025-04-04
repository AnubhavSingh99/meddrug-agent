export interface GraphRelationship {
  id: string;
  Drug: string;
  Target_Protein: string;
  Disease: string;
  Binding_Affinity: number;
  Repurposing_Score: number;
}

export const graphRelationships: GraphRelationship[] = [
  {
    id: "rel-001",
    Drug: "MediG-001",
    Target_Protein: "P53 Tumor Suppressor",
    Disease: "Lung Cancer",
    Binding_Affinity: -9.3,
    Repurposing_Score: 75.4
  },
  {
    id: "rel-002",
    Drug: "FDA-Approved-Drug-001",
    Target_Protein: "EGFR",
    Disease: "Non-Small Cell Lung Cancer",
    Binding_Affinity: -11.0,
    Repurposing_Score: 92.7
  },
  {
    id: "rel-003",
    Drug: "MediG-002",
    Target_Protein: "BRAF",
    Disease: "Melanoma",
    Binding_Affinity: -8.9,
    Repurposing_Score: 81.3
  },
  {
    id: "rel-004",
    Drug: "MediG-003",
    Target_Protein: "ACE2",
    Disease: "Hypertension",
    Binding_Affinity: -7.8,
    Repurposing_Score: 68.9
  },
  {
    id: "rel-005",
    Drug: "FDA-Approved-Drug-002",
    Target_Protein: "Beta-Adrenergic Receptor",
    Disease: "Cardiovascular Disease",
    Binding_Affinity: -10.2,
    Repurposing_Score: 89.5
  },
  {
    id: "rel-006",
    Drug: "MediG-004",
    Target_Protein: "JAK2",
    Disease: "Myelofibrosis",
    Binding_Affinity: -6.5,
    Repurposing_Score: 62.1
  },
  {
    id: "rel-007",
    Drug: "MediG-005",
    Target_Protein: "VEGFR",
    Disease: "Renal Cell Carcinoma",
    Binding_Affinity: -9.1,
    Repurposing_Score: 78.6
  },
  {
    id: "rel-008",
    Drug: "FDA-Approved-Drug-003",
    Target_Protein: "Adenosine Receptor",
    Disease: "Insomnia",
    Binding_Affinity: -9.8,
    Repurposing_Score: 86.2
  }
]; 