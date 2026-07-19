CREATE DATABASE IF NOT EXISTS medical_store_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE medical_store_db;

CREATE TABLE IF NOT EXISTS system_settings (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    store_name VARCHAR(150) NOT NULL DEFAULT 'Medical Store',
    store_email VARCHAR(150) NULL,
    store_phone VARCHAR(30) NULL,
    store_address TEXT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO system_settings (
    store_name,
    store_email,
    store_phone,
    store_address
)
SELECT
    'Medical Store',
    'admin@medicalstore.com',
    '03000000000',
    'Lahore, Pakistan'
WHERE NOT EXISTS (
    SELECT 1 FROM system_settings
);
