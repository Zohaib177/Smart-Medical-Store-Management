const { executeSingle } = require('./databaseService');

const EMPTY_SUMMARY = Object.freeze({
  totalMedicines: 0,
  lowStockMedicines: 0,
  expiringSoonMedicines: 0,
  outOfStockMedicines: 0,
  totalSuppliers: 0,
  totalCustomers: 0,
});

async function getDashboardSummary() {
  const row = await executeSingle(`
    SELECT
      COUNT(*) AS totalMedicines,
      COALESCE(SUM(CASE
        WHEN stock_quantity > 0 AND stock_quantity <= minimum_stock THEN 1
        ELSE 0
      END), 0) AS lowStockMedicines,
      COALESCE(SUM(CASE
        WHEN expiry_date IS NOT NULL
          AND expiry_date >= CURRENT_DATE
          AND expiry_date <= DATE_ADD(CURRENT_DATE, INTERVAL 30 DAY) THEN 1
        ELSE 0
      END), 0) AS expiringSoonMedicines,
      COALESCE(SUM(CASE WHEN stock_quantity <= 0 THEN 1 ELSE 0 END), 0) AS outOfStockMedicines,
      (SELECT COUNT(*) FROM suppliers) AS totalSuppliers,
      (SELECT COUNT(*) FROM customers) AS totalCustomers
    FROM medicines
  `);

  if (!row) {
    return { ...EMPTY_SUMMARY };
  }

  return Object.fromEntries(
    Object.keys(EMPTY_SUMMARY).map((key) => [key, Number(row[key] || 0)])
  );
}

module.exports = {
  getDashboardSummary,
};
