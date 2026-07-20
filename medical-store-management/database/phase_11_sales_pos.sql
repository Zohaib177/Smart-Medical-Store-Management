USE medical_store_db;

ALTER TABLE sales
  ADD COLUMN sale_number VARCHAR(30) NULL AFTER id,
  ADD COLUMN paid_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00 AFTER grand_total,
  ADD COLUMN due_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00 AFTER paid_amount,
  ADD COLUMN received_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00 AFTER due_amount,
  ADD COLUMN change_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00 AFTER received_amount,
  ADD COLUMN sale_status ENUM('completed','cancelled') NOT NULL DEFAULT 'completed' AFTER payment_status,
  ADD COLUMN notes TEXT NULL AFTER sale_status,
  ADD COLUMN created_by INT UNSIGNED NULL AFTER notes,
  ADD COLUMN cancelled_by INT UNSIGNED NULL AFTER created_by,
  ADD COLUMN cancelled_at TIMESTAMP NULL AFTER cancelled_by,
  ADD COLUMN cancellation_reason VARCHAR(500) NULL AFTER cancelled_at,
  MODIFY COLUMN payment_status ENUM('paid','pending','partial','unpaid') NOT NULL DEFAULT 'paid';

ALTER TABLE sales
  ADD UNIQUE INDEX uk_sales_sale_number (sale_number),
  ADD INDEX idx_sales_payment_method (payment_method),
  ADD INDEX idx_sales_payment_status (payment_status),
  ADD INDEX idx_sales_sale_status (sale_status),
  ADD INDEX idx_sales_created_by (created_by),
  ADD CONSTRAINT fk_sales_created_by FOREIGN KEY (created_by) REFERENCES admins(id) ON UPDATE CASCADE ON DELETE SET NULL,
  ADD CONSTRAINT fk_sales_cancelled_by FOREIGN KEY (cancelled_by) REFERENCES admins(id) ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE inventory_logs
  MODIFY COLUMN transaction_type ENUM('purchase','sale','adjustment','return','stock_in','stock_out','correction','sale_cancellation') NOT NULL;
