
export function parseId(potentialId) {
  const parsed = (Number.isNaN(potentialId) || potentialId === null) ? null : parseInt(potentialId, 10);
  return (Number.isNaN(parsed) || parsed < 0) ? null : parsed;
}

export const TEMP = 'temp';
