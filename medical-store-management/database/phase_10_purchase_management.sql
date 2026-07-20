USE medical_store_db;

ALTER TABLE purchases
  ADD COLUMN purchase_number VARCHAR(30) NULL AFTER id,
  ADD COLUMN subtotal DECIMAL(12,2) NOT NULL DEFAULT 0.00 AFTER invoice_number,
  ADD COLUMN discount_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00 AFTER subtotal,
  ADD COLUMN tax_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00 AFTER discount_amount,
  ADD COLUMN paid_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00 AFTER total_amount,
  ADD COLUMN due_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00 AFTER paid_amount,
  ADD COLUMN purchase_status ENUM('completed','cancelled') NOT NULL DEFAULT 'completed' AFTER payment_status,
  ADD COLUMN created_by INT UNSIGNED NULL AFTER remarks,
  ADD COLUMN cancelled_by INT UNSIGNED NULL AFTER created_by,
  ADD COLUMN cancelled_at TIMESTAMP NULL AFTER cancelled_by,
  ADD COLUMN cancellation_reason VARCHAR(500) NULL AFTER cancelled_at,
  MODIFY COLUMN payment_status ENUM('paid','pending','partial','unpaid') NOT NULL DEFAULT 'unpaid';

ALTER TABLE purchases
  ADD UNIQUE INDEX uk_purchases_purchase_number (purchase_number),
  ADD INDEX idx_purchases_status (purchase_status),
  ADD INDEX idx_purchases_payment_status (payment_status),
  ADD INDEX idx_purchases_created_by (created_by),
  ADD CONSTRAINT fk_purchases_created_by FOREIGN KEY (created_by) REFERENCES admins(id) ON UPDATE CASCADE ON DELETE SET NULL,
  ADD CONSTRAINT fk_purchases_cancelled_by FOREIGN KEY (cancelled_by) REFERENCES admins(id) ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE purchase_items
  ADD COLUMN batch_number VARCHAR(100) NULL AFTER medicine_id,
  ADD COLUMN expiry_date DATE NULL AFTER batch_number;
