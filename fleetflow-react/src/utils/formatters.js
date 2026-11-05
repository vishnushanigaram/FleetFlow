export function formatCurrency(amount, currency = 'USD') {
  if (amount === undefined || amount === null || isNaN(amount)) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

export function formatNumber(val) {
  if (val === undefined || val === null || isNaN(val)) return '0';
  return new Intl.NumberFormat('en-US').format(val);
}

export function formatDistance(val) {
  if (val === undefined || val === null || isNaN(val)) return '0 km';
  return `${new Intl.NumberFormat('en-US').format(val)} km`;
}

export function formatFuel(val) {
  if (val === undefined || val === null || isNaN(val)) return '0 L';
  return `${new Intl.NumberFormat('en-US').format(val)} L`;
}

export function truncateText(str, maxLength = 30) {
  if (!str) return '';
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + '...';
}
