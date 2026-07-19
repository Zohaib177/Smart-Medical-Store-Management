function buildUpdateClause(fields) {
  const columns = Object.keys(fields || {});
  if (columns.length === 0) {
    return { clause: '', values: [] };
  }

  const assignments = columns.map((field) => `${field} = ?`);
  const values = columns.map((field) => fields[field]);
  return { clause: assignments.join(', '), values };
}

function buildInsertClause(fields) {
  const columns = Object.keys(fields || {});
  if (columns.length === 0) {
    return { columns: [], placeholders: '', values: [] };
  }

  return {
    columns,
    placeholders: columns.map(() => '?').join(', '),
    values: columns.map((field) => fields[field]),
  };
}

function sanitizeSortDirection(direction) {
  const normalized = String(direction || 'ASC').toUpperCase();
  return normalized === 'DESC' ? 'DESC' : 'ASC';
}

function validateAllowedSortColumn(column, allowedColumns) {
  if (!column) {
    return null;
  }

  const normalizedColumn = String(column);
  return allowedColumns.includes(normalizedColumn) ? normalizedColumn : null;
}

module.exports = {
  buildUpdateClause,
  buildInsertClause,
  sanitizeSortDirection,
  validateAllowedSortColumn,
};
