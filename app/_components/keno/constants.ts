export const GRID_NUMBERS = Array.from({ length: 40 }, (_, i) => i + 1);

export const RISK_LEVELS = [
  {
    label: 'Low',
    multipliers: [0, 0, 0, 1, 1.5, 2, 4, 8, 15, 30, 50],
  },
  {
    label: 'Medium',
    multipliers: [0, 0, 0, 0, 1.2, 1.8, 3.5, 7, 14, 25, 40],
  },
  {
    label: 'High',
    multipliers: [0, 0, 0, 0, 1.0, 1.5, 3, 6, 12, 20, 30],
  },
];

