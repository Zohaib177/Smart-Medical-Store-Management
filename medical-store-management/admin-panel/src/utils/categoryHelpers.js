export function getCategoryErrorMessage(error, fallback = 'Unable to complete the category request.') {
  return error?.response?.data?.message || fallback;
}

export function getCategoryFieldErrors(error) {
  const errors = error?.response?.data?.errors;
  if (!Array.isArray(errors)) return {};
  return Object.fromEntries(errors.map((item) => [item.field, item.message]));
}

export function getSortValue(filters) {
  return `${filters.sortBy}:${filters.sortDirection}`;
}
