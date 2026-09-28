export const UnitConverter = {
  kgToLb(kg: number): number {
    return Math.round(kg * 2.20462 * 10) / 10;
  },

  lbToKg(lb: number): number {
    return Math.round((lb / 2.20462) * 10) / 10;
  },

  cmToInches(cm: number): number {
    return Math.round((cm / 2.54) * 10) / 10;
  },

  inchesToCm(inches: number): number {
    return Math.round(inches * 2.54 * 10) / 10;
  },

  cmToFeetAndInches(cm: number): { feet: number; inches: number } {
    const totalInches = cm / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return { feet, inches };
  },

  feetAndInchesToCm(feet: number, inches: number): number {
    const totalInches = feet * 12 + inches;
    return Math.round(totalInches * 2.54);
  },

  // Display weight formatted
  formatWeight(kg: number, system: 'metric' | 'imperial' = 'metric'): string {
    if (system === 'imperial') {
      const lb = this.kgToLb(kg);
      return `${lb} lb`;
    }
    return `${Math.round(kg * 10) / 10} kg`;
  },

  // Display measurement length formatted
  formatLength(cm: number, system: 'metric' | 'imperial' = 'metric'): string {
    if (system === 'imperial') {
      const inches = this.cmToInches(cm);
      return `${inches} in`;
    }
    return `${cm} cm`;
  }
};
