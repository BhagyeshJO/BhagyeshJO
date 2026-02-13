/**
 * Convert a Date to YYYY-MM-DD (local date).
 * @param {Date} date
 * @returns {string}
 */
export function toISODate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parse a YYYY-MM-DD string as local midnight.
 * @param {string} dateKey
 * @returns {Date}
 */
export function fromDateKey(dateKey) {
  return new Date(`${dateKey}T00:00:00`);
}

/**
 * Return the month title for a given date.
 * @param {Date} date
 * @returns {string}
 */
export function formatMonthYear(date) {
  return date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
}

/**
 * Return long readable date label.
 * @param {string} dateKey
 * @returns {string}
 */
export function formatLongDate(dateKey) {
  return fromDateKey(dateKey).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}
