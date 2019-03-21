
export function parseId(potentialId) {
  return (Number.isNaN(potentialId) || potentialId === null) ? null : parseInt(potentialId, 10);
}

export const TEMP = 'temp';
