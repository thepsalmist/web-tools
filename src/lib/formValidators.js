
const MIN_PASSWORD_LENGTH = 8;

export function notEmptyString(value) {
  return (value !== null) && (value !== undefined) && (value.trim() !== '');
}

export function emptyString(value) {
  return (value === null) || (value === undefined) || (value.trim() === '');
}

export function validEmail(value) {
  return notEmptyString(value) && /^[^@]+@[^@]+\.[^@]+$/i.test(value);
}

export function invalidEmail(value) {
  return !validEmail(value);
}

export function nullOrUndefined(value) {
  return (value === null) || (value === undefined);
}

export function invalidDate(value) {
  return /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/g.test(value) !== true;
}

export function validDate(value) {
  return !invalidDate(value);
}

export function stringTooShort(value, minLength) {
  return (value && (value.length < minLength));
}

export function passwordTooShort(value) {
  return stringTooShort(value, MIN_PASSWORD_LENGTH);
}

export function stringsDoNotMatch(value1, value2) {
  return ((value1 !== undefined) && (value2 !== undefined) && (value1 !== value2));
}

export function invalidUrl(value) {
  // Source: https://github.com/jzaefferer/jquery-validation/blob/c1db10a34c0847c28a5bd30e3ee1117e137ca834/src/core.js#L1349
  return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value) !== true;
}

export const MAX_RECOMMENDED_STORIES = 100000;
export const MIN_RECOMMENDED_STORIES = 500;
export const WARNING_LIMIT_RECOMMENDED_STORIES = 70000;
