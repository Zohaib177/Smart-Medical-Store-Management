USE medical_store_db;

ALTER TABLE inventory_logs
  MODIFY COLUMN transaction_type ENUM('purchase', 'sale', 'adjustment', 'return', 'stock_in', 'stock_out', 'correction') NOT NULL,
  ADD COLUMN admin_id INT UNSIGNED NULL AFTER medicine_id,
  ADD COLUMN quantity_change INT NOT NULL DEFAULT 0 AFTER quantity,
  ADD COLUMN previous_quantity INT UNSIGNED NULL AFTER quantity_change,
  ADD COLUMN new_quantity INT UNSIGNED NULL AFTER previous_quantity,
  ADD COLUMN reference_type VARCHAR(30) NULL AFTER new_quantity,
  ADD COLUMN reference_id INT UNSIGNED NULL AFTER reference_type,
  ADD COLUMN reason VARCHAR(255) NULL AFTER reference_id,
  ADD COLUMN notes TEXT NULL AFTER reason;

ALTER TABLE inventory_logs
  ADD INDEX idx_inventory_logs_admin_id (admin_id),
  ADD INDEX idx_inventory_logs_transaction_type (transaction_type),
  ADD CONSTRAINT fk_inventory_logs_admin FOREIGN KEY (admin_id)
    REFERENCES admins(id) ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE inventory_logs
  DROP CHECK chk_inventory_logs_quantity,
  ADD CONSTRAINT chk_inventory_logs_quantity CHECK (quantity >= 0);
