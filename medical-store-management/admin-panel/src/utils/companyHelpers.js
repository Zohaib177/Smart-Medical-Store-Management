export function getCompanyErrorMessage(error, fallback = 'Unable to complete the company request.') {
  return error?.response?.data?.message || fallback;
}
export function getCompanyFieldErrors(error) {
  const errors = error?.response?.data?.errors;
  return Array.isArray(errors) ? Object.fromEntries(errors.map((item) => [item.field, item.message])) : {};
}
export function getCompanySortValue(filters) { return `${filters.sortBy}:${filters.sortDirection}`; }
