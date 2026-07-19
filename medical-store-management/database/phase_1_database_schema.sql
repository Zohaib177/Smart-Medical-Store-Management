-- Phase 1: Professional MySQL schema for Medical Store Management System
-- Database: medical_store_db

USE medical_store_db;

SET foreign_key_checks = 0;

-- Drop existing Phase 1 objects safely if they exist
DROP TABLE IF EXISTS inventory_logs;
DROP TABLE IF EXISTS sale_items;
DROP TABLE IF EXISTS sales;
DROP TABLE IF EXISTS purchase_items;
DROP TABLE IF EXISTS purchases;
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS suppliers;
DROP TABLE IF EXISTS medicines;
DROP TABLE IF EXISTS medicine_companies;
DROP TABLE IF EXISTS medicine_categories;
DROP TABLE IF EXISTS admins;

SET foreign_key_checks = 1;

-- 1. admins
CREATE TABLE admins (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(30) NULL,
    profile_image VARCHAR(255) NULL,
    status ENUM('active', 'inactive', 'suspended') NOT NULL DEFAULT 'active',
    last_login TIMESTAMP NULL DEFAULT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_admins_email (email),
    KEY idx_admins_status (status),
    KEY idx_admins_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. medicine_categories
CREATE TABLE medicine_categories (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    category_name VARCHAR(100) NOT NULL,
    description TEXT NULL,
    status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_medicine_categories_name (category_name),
    KEY idx_medicine_categories_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. medicine_companies
CREATE TABLE medicine_companies (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    company_name VARCHAR(150) NOT NULL,
    contact_person VARCHAR(150) NULL,
    email VARCHAR(150) NULL,
    phone VARCHAR(30) NULL,
    address TEXT NULL,
    status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_medicine_companies_name (company_name),
    KEY idx_medicine_companies_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. medicines
CREATE TABLE medicines (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    medicine_name VARCHAR(150) NOT NULL,
    generic_name VARCHAR(150) NULL,
    category_id INT UNSIGNED NOT NULL,
    company_id INT UNSIGNED NOT NULL,
    barcode VARCHAR(100) NULL,
    batch_number VARCHAR(100) NULL,
    strength VARCHAR(100) NULL,
    dosage_form VARCHAR(100) NULL,
    purchase_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    selling_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    stock_quantity INT NOT NULL DEFAULT 0,
    minimum_stock INT NOT NULL DEFAULT 0,
    expiry_date DATE NULL,
    manufacturing_date DATE NULL,
    description TEXT NULL,
    image VARCHAR(255) NULL,
    prescription_required TINYINT(1) NOT NULL DEFAULT 0,
    status ENUM('active', 'inactive', 'out_of_stock') NOT NULL DEFAULT 'active',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_medicines_barcode (barcode),
    KEY idx_medicines_category_id (category_id),
    KEY idx_medicines_company_id (company_id),
    KEY idx_medicines_status (status),
    KEY idx_medicines_stock (stock_quantity),
    CONSTRAINT fk_medicines_category FOREIGN KEY (category_id)
        REFERENCES medicine_categories (id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT fk_medicines_company FOREIGN KEY (company_id)
        REFERENCES medicine_companies (id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT chk_medicines_purchase_price CHECK (purchase_price >= 0),
    CONSTRAINT chk_medicines_selling_price CHECK (selling_price >= 0),
    CONSTRAINT chk_medicines_stock_quantity CHECK (stock_quantity >= 0),
    CONSTRAINT chk_medicines_minimum_stock CHECK (minimum_stock >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. suppliers
CREATE TABLE suppliers (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    supplier_name VARCHAR(150) NOT NULL,
    contact_person VARCHAR(150) NULL,
    email VARCHAR(150) NULL,
    phone VARCHAR(30) NULL,
    address TEXT NULL,
    city VARCHAR(100) NULL,
    country VARCHAR(100) NULL,
    status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_suppliers_email (email),
    KEY idx_suppliers_status (status),
    KEY idx_suppliers_name (supplier_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. customers
CREATE TABLE customers (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    customer_name VARCHAR(150) NOT NULL,
    phone VARCHAR(30) NULL,
    email VARCHAR(150) NULL,
    address TEXT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_customers_email (email),
    KEY idx_customers_phone (phone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. purchases
CREATE TABLE purchases (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    supplier_id INT UNSIGNED NOT NULL,
    purchase_date DATE NOT NULL,
    invoice_number VARCHAR(100) NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    payment_status ENUM('paid', 'pending', 'partial') NOT NULL DEFAULT 'pending',
    remarks TEXT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_purchases_invoice_number (invoice_number),
    KEY idx_purchases_supplier_id (supplier_id),
    KEY idx_purchases_date (purchase_date),
    CONSTRAINT fk_purchases_supplier FOREIGN KEY (supplier_id)
        REFERENCES suppliers (id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT chk_purchases_total_amount CHECK (total_amount >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. purchase_items
CREATE TABLE purchase_items (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    purchase_id INT UNSIGNED NOT NULL,
    medicine_id INT UNSIGNED NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    purchase_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    subtotal DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_purchase_items_purchase_id (purchase_id),
    KEY idx_purchase_items_medicine_id (medicine_id),
    CONSTRAINT fk_purchase_items_purchase FOREIGN KEY (purchase_id)
        REFERENCES purchases (id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_purchase_items_medicine FOREIGN KEY (medicine_id)
        REFERENCES medicines (id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT chk_purchase_items_quantity CHECK (quantity > 0),
    CONSTRAINT chk_purchase_items_purchase_price CHECK (purchase_price >= 0),
    CONSTRAINT chk_purchase_items_subtotal CHECK (subtotal >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. sales
CREATE TABLE sales (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    customer_id INT UNSIGNED NULL,
    invoice_number VARCHAR(100) NOT NULL,
    sale_date DATE NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    discount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    tax DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    grand_total DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    payment_method ENUM('cash', 'card', 'online', 'credit') NOT NULL DEFAULT 'cash',
    payment_status ENUM('paid', 'pending', 'partial') NOT NULL DEFAULT 'paid',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_sales_invoice_number (invoice_number),
    KEY idx_sales_customer_id (customer_id),
    KEY idx_sales_date (sale_date),
    CONSTRAINT fk_sales_customer FOREIGN KEY (customer_id)
        REFERENCES customers (id)
        ON UPDATE CASCADE
        ON DELETE SET NULL,
    CONSTRAINT chk_sales_total_amount CHECK (total_amount >= 0),
    CONSTRAINT chk_sales_discount CHECK (discount >= 0),
    CONSTRAINT chk_sales_tax CHECK (tax >= 0),
    CONSTRAINT chk_sales_grand_total CHECK (grand_total >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. sale_items
CREATE TABLE sale_items (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    sale_id INT UNSIGNED NOT NULL,
    medicine_id INT UNSIGNED NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    unit_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    subtotal DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_sale_items_sale_id (sale_id),
    KEY idx_sale_items_medicine_id (medicine_id),
    CONSTRAINT fk_sale_items_sale FOREIGN KEY (sale_id)
        REFERENCES sales (id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_sale_items_medicine FOREIGN KEY (medicine_id)
        REFERENCES medicines (id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT chk_sale_items_quantity CHECK (quantity > 0),
    CONSTRAINT chk_sale_items_unit_price CHECK (unit_price >= 0),
    CONSTRAINT chk_sale_items_subtotal CHECK (subtotal >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. inventory_logs
CREATE TABLE inventory_logs (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    medicine_id INT UNSIGNED NOT NULL,
    transaction_type ENUM('purchase', 'sale', 'adjustment', 'return') NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    remaining_stock INT NOT NULL DEFAULT 0,
    remarks TEXT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_inventory_logs_medicine_id (medicine_id),
    KEY idx_inventory_logs_created_at (created_at),
    CONSTRAINT fk_inventory_logs_medicine FOREIGN KEY (medicine_id)
        REFERENCES medicines (id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT chk_inventory_logs_quantity CHECK (quantity > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed data for core lookup tables
INSERT INTO medicine_categories (category_name, description, status) VALUES
('Pain Killer', 'Pain relief medicines', 'active'),
('Antibiotic', 'Medicines for bacterial infections', 'active'),
('Vitamin', 'Vitamin supplements', 'active'),
('Diabetes', 'Medicines for diabetic care', 'active'),
('Heart', 'Cardiovascular medications', 'active'),
('Skin Care', 'Dermatology products', 'active'),
('Baby Care', 'Products for infants and babies', 'active'),
('Medical Equipment', 'Medical devices and accessories', 'active');

INSERT INTO medicine_companies (company_name, contact_person, email, phone, address, status) VALUES
('GSK', 'Sales Team', 'sales@gsk.com', '03000000001', 'Karachi, Pakistan', 'active'),
('Getz Pharma', 'Operations Team', 'ops@getzpharma.com', '03000000002', 'Lahore, Pakistan', 'active'),
('Hilton Pharma', 'Support Team', 'support@hiltonpharma.com', '03000000003', 'Islamabad, Pakistan', 'active'),
('Pfizer', 'Account Manager', 'accounts@pfizer.com', '03000000004', 'Rawalpindi, Pakistan', 'active'),
('Abbott', 'Distribution Team', 'dist@abbott.com', '03000000005', 'Faisalabad, Pakistan', 'active');

INSERT INTO admins (full_name, email, password, phone, status) VALUES
('Super Admin', 'admin@medicalstore.com', 'hashed_placeholder_for_phase_1', '03000000000', 'active');
