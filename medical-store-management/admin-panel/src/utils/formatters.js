export function formatNumber(value) {
  return new Intl.NumberFormat('en-PK').format(Number(value) || 0);
}

export function formatDate(value) {
  if (!value) return '—';
  return new Intl.DateTimeFormat('en-PK', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(value));
}

export function formatDateTime(value) {
  if (!value) return '—';
  return new Intl.DateTimeFormat('en-PK', {
    day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit',
  }).format(new Date(value));
}

export function formatCurrency(value, currency = 'PKR') {
  return new Intl.NumberFormat('en-PK', { style: 'currency', currency }).format(Number(value) || 0);
}
