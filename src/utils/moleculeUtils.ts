/**
 * Basic validation for SMILES strings
 * Note: This is a simplified validation. For production,
 * consider using a chemistry library like RDKit.js
 */
export function validateSMILES(smiles: string): boolean {
  if (!smiles || smiles.trim().length === 0) return false;
  
  // Check for balanced parentheses
  let openCount = 0;
  for (const char of smiles) {
    if (char === '(') openCount++;
    if (char === ')') openCount--;
    if (openCount < 0) return false; // Unbalanced parentheses
  }
  if (openCount !== 0) return false; // Unbalanced parentheses
  
  // Check for valid characters (simplified)
  const validCharsRegex = /^[A-Za-z0-9@\-=#()[\]\\\/+.%]*$/;
  if (!validCharsRegex.test(smiles)) return false;
  
  // Check for at least one valid atom
  const atomRegex = /[A-Z][a-z]?/;
  if (!atomRegex.test(smiles)) return false;
  
  return true;
}

/**
 * Calculate molecular weight from SMILES (simplified mock implementation)
 * In a real application, this would use a chemistry library
 */
export function calculateMolecularWeight(smiles: string): number {
  // This is a mock implementation
  // In reality, you would use a chemistry library like RDKit.js
  return smiles.length * 10;
}

/**
 * Check if a molecule passes Lipinski's Rule of Five
 */
export function checkLipinskiRules(properties: {
  molecularWeight: number;
  logP: number;
  hBondDonors: number;
  hBondAcceptors: number;
}): {
  passes: boolean;
  violations: number;
  details: boolean[];
} {
  const rules = [
    properties.molecularWeight <= 500,
    properties.logP <= 5,
    properties.hBondDonors <= 5,
    properties.hBondAcceptors <= 10
  ];
  
  const violations = rules.filter(rule => !rule).length;
  
  return {
    passes: violations <= 1, // Lipinski allows for one violation
    violations,
    details: rules
  };
} 