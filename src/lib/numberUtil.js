
export function parseId(potentialId) {
  const parsed = (Number.isNaN(potentialId) || potentialId === null) ? null : parseInt(potentialId, 10);
  if (Number.isNaN(parsed)) {
    return null;
  }
  return parsed;
}

export const TEMP = 'temp';
