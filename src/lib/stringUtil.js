
export function trimToMaxLength(string, maxLength) {
  if ((string === undefined) || (string === null)) {
    return string; // is this right, or should we return empty string?
  }
  if (string.length < maxLength) {
    return string;
  }
  return `${string.substring(0, maxLength)}...`;
}

export function humanReadableNumber(number, numSigFigs, formatNumber) {
  const pow = Math.round(number).toString().length;

  if (pow > 12) {
    return '>1 trillion';
  }
  if (pow >= 10 && pow <= 12) {
    const abbrev = formatNumber(number / 1000000000, { maximumSignificantDigits: numSigFigs });
    return abbrev.concat(' billion');
  }
  if (pow >= 7 && pow <= 9) {
    const abbrev = formatNumber(number / 1000000, { maximumSignificantDigits: numSigFigs });
    return abbrev.concat(' million');
  }
  if (pow >= 4 && pow <= 6) {
    const abbrev = formatNumber(number / 1000, { maximumSignificantDigits: numSigFigs });
    return abbrev.concat('k');
  }

  return formatNumber(number);
}
