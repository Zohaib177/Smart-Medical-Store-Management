# Medical Store Management System

## Overview
This project creates the Phase 0 foundation for a professional medical store management platform with two connected parts:

- Admin Panel for store owners
- Customer-facing website ready for future integration

## Phase 0 Objective
The goal of Phase 0 is to set up the initial architecture, including:

- React + Vite frontend
- Express + Node backend
- MySQL connection pool
- Health-check API
- Environment configuration
- Error handling and security middleware
- SQL initialization script

## Technology Stack

### Frontend
- React
- Vite
- JavaScript
- Tailwind CSS
- React Router DOM
- Axios
- Lucide React

### Backend
- Node.js
- Express.js
- MySQL
- mysql2
- dotenv
- cors
- helmet
- morgan
- express-rate-limit
- nodemon

## Folder Structure

medical-store-management/
├── admin-panel/
├── backend/
├── database/
├── .gitignore
└── README.md

## Prerequisites
- Node.js 18+
- MySQL 8 running locally on port 3306
- npm

## MySQL Setup
1. Open MySQL Workbench or MySQL CLI.
2. Create a database named medical_store_db if it does not exist.
3. Run the SQL file at database/phase_0_setup.sql.

## Backend Installation
```bash
cd backend
npm install
```

## Frontend Installation
```bash
cd admin-panel
npm install
```

## Environment Variables
### Backend
Create backend/.env with:
```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=medical_store_db
CLIENT_URL=http://localhost:5173
```

### Frontend
Create admin-panel/.env with:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## Start Backend
```bash
cd backend
npm run dev
```

## Start Frontend
```bash
cd admin-panel
npm run dev
```

## API Endpoints
- GET /api
- GET /api/health

### Expected API Response
```json
{
  "success": true,
  "message": "Medical Store API is running",
  "server": "connected",
  "database": "connected",
  "timestamp": "2026-01-01T00:00:00.000Z"
}
```

## Phase 1 Database Design
Phase 1 introduces the professional relational database schema for the medical store system.

### What is included
- Admins table for system administrators
- Medicine categories and medicine companies lookup tables
- Medicines table with pricing, stock, and expiry data
- Suppliers and customers tables
- Purchases and purchase_items for procurement flow
- Sales and sale_items for billing flow
- Inventory logs for stock movement tracking

### Relationships
- medicines.category_id -> medicine_categories.id
- medicines.company_id -> medicine_companies.id
- purchases.supplier_id -> suppliers.id
- purchase_items.purchase_id -> purchases.id
- purchase_items.medicine_id -> medicines.id
- sales.customer_id -> customers.id
- sale_items.sale_id -> sales.id
- sale_items.medicine_id -> medicines.id
- inventory_logs.medicine_id -> medicines.id

### SQL file
Run the Phase 1 schema file:
```bash
mysql -u root -p < database/phase_1_database_schema.sql
```

### Notes
- The schema uses InnoDB for all tables.
- It includes indexes, foreign keys, and check constraints where supported.
- Seed data is included for default admin, categories, and companies.

## Troubleshooting
- Ensure MySQL is running.
- Verify the database credentials in backend/.env.
- Confirm the backend can reach MySQL on port 3306.
- If the frontend cannot connect, verify VITE_API_BASE_URL.
