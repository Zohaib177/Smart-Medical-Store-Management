const databaseConstants = Object.freeze({
  defaultPage: 1,
  defaultLimit: 10,
  maximumLimit: 100,
  defaultSortDirection: 'ASC',
  allowedSortDirections: Object.freeze(['ASC', 'DESC']),
});

module.exports = databaseConstants;
