
export function parseId(potentialId) {
  const parsed = (Number.isNaN(potentialId) || potentialId === null) ? null : parseInt(potentialId, 10);
  // need to allow negatives because of our placeholers for non-collection/non-source ids
  return Number.isNaN(parsed) ? null : parsed;
}

export const TEMP = 'temp';
