const databaseConstants = require('../constants/databaseConstants');

function normalizePagination(page, limit) {
  const normalizedPage = Math.max(1, parseInt(page, 10) || databaseConstants.defaultPage);
  const normalizedLimit = Math.min(
    databaseConstants.maximumLimit,
    Math.max(1, parseInt(limit, 10) || databaseConstants.defaultLimit)
  );

  return { page: normalizedPage, limit: normalizedLimit };
}

function calculateOffset(page, limit) {
  const normalized = normalizePagination(page, limit);
  return (normalized.page - 1) * normalized.limit;
}

function buildPaginationMetadata(page, limit, totalRecords) {
  const normalized = normalizePagination(page, limit);
  const totalPages = Math.max(1, Math.ceil(totalRecords / normalized.limit));

  return {
    page: normalized.page,
    limit: normalized.limit,
    totalRecords,
    totalPages,
    hasNextPage: normalized.page < totalPages,
    hasPreviousPage: normalized.page > 1,
  };
}

module.exports = {
  normalizePagination,
  calculateOffset,
  buildPaginationMetadata,
};
