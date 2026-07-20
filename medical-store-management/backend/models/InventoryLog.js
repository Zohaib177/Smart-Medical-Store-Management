const BaseModel = require('./BaseModel');
const { executeQuery, executeSingle } = require('../services/databaseService');
const { normalizePagination, calculateOffset, buildPaginationMetadata } = require('../utils/pagination');
const { mapInventoryLogRow, mapTransactionTypeToDatabase } = require('../utils/inventoryMapper');

class InventoryLog extends BaseModel {
  constructor() { super({ tableName: 'inventory_logs', primaryKey: 'id', allowedFields: ['medicine_id', 'admin_id', 'transaction_type', 'quantity', 'quantity_change', 'previous_quantity', 'new_quantity', 'remaining_stock', 'reference_type', 'reference_id', 'reason', 'notes', 'remarks'], searchableFields: ['reason', 'notes'], sortableFields: ['created_at'], defaultSortColumn: 'created_at', defaultSortDirection: 'DESC' }); }
  async createLog(data, connection) {
    const [result] = await connection.execute(`INSERT INTO inventory_logs (medicine_id,admin_id,transaction_type,quantity,quantity_change,previous_quantity,new_quantity,remaining_stock,reference_type,reference_id,reason,notes,remarks) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`, [data.medicineId, data.adminId, mapTransactionTypeToDatabase(data.transactionType), data.quantity, data.quantityChange, data.previousQuantity, data.newQuantity, data.newQuantity, data.referenceType || 'manual', data.referenceId || null, data.reason, data.notes || null, data.reason]);
    return { id: result.insertId };
  }
  buildFilters(options = {}, fixedMedicineId = null) {
    const where = []; const values = [];
    if (fixedMedicineId || options.medicineId) { where.push('il.medicine_id=?'); values.push(fixedMedicineId || options.medicineId); }
    if (options.adminId) { where.push('il.admin_id=?'); values.push(options.adminId); }
    if (options.transactionType) { where.push('il.transaction_type=?'); values.push(mapTransactionTypeToDatabase(options.transactionType)); }
    if (options.dateFrom) { where.push('il.created_at >= ?'); values.push(`${options.dateFrom} 00:00:00`); }
    if (options.dateTo) { where.push('il.created_at <= ?'); values.push(`${options.dateTo} 23:59:59`); }
    if (options.search) { const s=`%${String(options.search).trim()}%`; where.push('(m.medicine_name LIKE ? OR m.barcode LIKE ? OR m.batch_number LIKE ? OR il.reason LIKE ? OR il.notes LIKE ? OR a.full_name LIKE ? OR a.email LIKE ?)'); values.push(...Array(7).fill(s)); }
    return { whereSql: where.length ? `WHERE ${where.join(' AND ')}` : '', values };
  }
  async findAllWithRelations(options = {}, fixedMedicineId = null) {
    const { page, limit }=normalizePagination(options.page,options.limit); const offset=calculateOffset(page,limit); const {whereSql,values}=this.buildFilters(options,fixedMedicineId); const direction=String(options.sortDirection).toLowerCase()==='asc'?'ASC':'DESC'; const joins='JOIN medicines m ON m.id=il.medicine_id LEFT JOIN admins a ON a.id=il.admin_id';
    const rows=await executeQuery(`SELECT il.*,m.medicine_name,m.barcode,m.batch_number,a.full_name AS admin_name,a.email AS admin_email FROM inventory_logs il ${joins} ${whereSql} ORDER BY il.created_at ${direction} LIMIT ${limit} OFFSET ${offset}`,values); const count=await executeSingle(`SELECT COUNT(*) totalRecords FROM inventory_logs il ${joins} ${whereSql}`,values); return {data:rows.map(mapInventoryLogRow),pagination:buildPaginationMetadata(page,limit,Number(count?.totalRecords||0))};
  }
  async findByMedicineId(id, options={}) { return this.findAllWithRelations(options,id); }
  async countWithFilters(options={}) { const {whereSql,values}=this.buildFilters(options); const row=await executeSingle(`SELECT COUNT(*) totalRecords FROM inventory_logs il JOIN medicines m ON m.id=il.medicine_id LEFT JOIN admins a ON a.id=il.admin_id ${whereSql}`,values); return Number(row?.totalRecords||0); }
  async findByIdWithRelations(id) { const row=await executeSingle('SELECT il.*,m.medicine_name,m.barcode,m.batch_number,a.full_name admin_name,a.email admin_email FROM inventory_logs il JOIN medicines m ON m.id=il.medicine_id LEFT JOIN admins a ON a.id=il.admin_id WHERE il.id=?',[id]); return mapInventoryLogRow(row); }
}
module.exports = new InventoryLog();
