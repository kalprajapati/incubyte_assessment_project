/**
 * Format a number as a USD currency string.
 * @param {number} value
 * @returns {string}  e.g. "$25,000"
 */
export function formatPrice(value) {
  if (value == null || isNaN(value)) return '—';
  return new Intl.NumberFormat('en-US', {
    style:    'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Format an ISO date string to a human-readable date.
 * @param {string|Date} date
 * @returns {string}  e.g. "Jan 15, 2025"
 */
export function formatDate(date) {
  if (!date) return '—';
  return new Intl.DateTimeFormat('en-US', {
    year:  'numeric',
    month: 'short',
    day:   'numeric',
  }).format(new Date(date));
}

/**
 * Truncate a string to a max length, appending "…" if cut.
 * @param {string} str
 * @param {number} max
 * @returns {string}
 */
export function truncate(str, max = 60) {
  if (!str) return '';
  return str.length <= max ? str : `${str.slice(0, max).trimEnd()}…`;
}

/**
 * Return a human-readable stock status label and colour token.
 * @param {number} qty
 * @returns {{ label: string, color: string }}
 */
export function stockStatus(qty) {
  if (qty === 0)  return { label: 'Out of Stock',  color: 'danger'  };
  if (qty <= 3)   return { label: 'Low Stock',     color: 'warning' };
  return              { label: 'In Stock',       color: 'success' };
}
