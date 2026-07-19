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
- POST /api/auth/login
- POST /api/auth/refresh
- POST /api/auth/logout
- GET /api/auth/me
- GET /api/dashboard/summary (authenticated admin only)

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

## Phase 4 — Admin Dashboard Layout

Phase 4 adds the reusable authenticated workspace used by future management modules. It intentionally does not add medicine CRUD, purchasing, POS, inventory transactions, or business reports.

### Admin layout architecture

`AdminLayout` renders the sidebar, mobile overlay, sticky header, and nested route content. `SidebarProvider` owns desktop and mobile navigation state. Desktop collapse preference is stored in `localStorage`; the temporary mobile-open state is not persisted. Opening the mobile drawer locks background scrolling and closing it restores the previous document state.

Navigation labels, paths, descriptions, and Lucide icons are defined once in `src/config/navigationConfig.js`. The sidebar, header title, and breadcrumbs use this shared configuration.

The header includes:

- Mobile navigation control
- Current page title and route-derived breadcrumbs
- Visual-only search field and notification indicator
- Admin profile dropdown with account details, settings link, and Phase 3 logout integration

### Dashboard summary endpoint

```http
GET /api/dashboard/summary
```

The endpoint is protected by the existing admin authentication middleware and returns:

```json
{
  "success": true,
  "message": "Dashboard summary retrieved successfully",
  "data": {
    "totalMedicines": 0,
    "lowStockMedicines": 0,
    "expiringSoonMedicines": 0,
    "outOfStockMedicines": 0,
    "totalSuppliers": 0,
    "totalCustomers": 0,
    "generatedAt": "2026-01-01T00:00:00.000Z"
  }
}
```

Summary rules:

- Total medicines: every row in `medicines`
- Low stock: `stock_quantity > 0` and `stock_quantity <= minimum_stock`
- Expiring soon: expiry date is today through 30 days from today; already expired medicines are excluded
- Out of stock: `stock_quantity <= 0`
- Suppliers and customers: every row in their corresponding table

MySQL aggregate values are converted to JavaScript numbers before the response is returned.

### Protected frontend routes

- `/admin/dashboard`
- `/admin/medicines`
- `/admin/categories`
- `/admin/companies`
- `/admin/suppliers`
- `/admin/purchases`
- `/admin/sales`
- `/admin/inventory`
- `/admin/customers`
- `/admin/reports`
- `/admin/settings`

`/admin` redirects to `/admin/dashboard`. Unauthenticated admin requests redirect to `/login` while preserving the requested destination. `/setup` remains publicly available for connection diagnostics. The module routes render honest Phase 4 empty states rather than fake tables or records.

### Responsive and accessible behavior

- Desktop: persistent sidebar with expanded and icon-only modes
- Tablet: responsive grids and usable navigation spacing
- Mobile: left navigation drawer, dark overlay, Escape handling, close control, and body-scroll lock
- Icon-only buttons have accessible labels and keyboard focus rings
- Navigation links, profile actions, mobile controls, and retry controls are keyboard accessible
- The profile dropdown closes on outside click or Escape
- Dashboard cards reflow from one column to two and then three columns
- Main layout prevents horizontal page overflow

### Dashboard states

- Six loading skeletons preserve the summary grid layout
- Failed summary requests show an error message and manual Retry action
- Inventory alerts are derived only from real summary counts
- Recent activity clearly explains that data will appear after the relevant modules are implemented

### Phase 4 testing

1. Apply the Phase 1 schema and Phase 3 authentication migration to the configured database.
2. Seed an administrator with `node backend/scripts/seed-admin.js`.
3. Start the backend and frontend in separate terminals.
4. Confirm `/api/health` returns HTTP 200.
5. Confirm an unauthenticated `/api/dashboard/summary` request returns HTTP 401.
6. Sign in and confirm the summary request returns HTTP 200 with six numeric count properties.
7. Verify `/setup`, `/login`, all `/admin/*` routes, logout, refresh-token behavior, sidebar collapse persistence, mobile overlay, and Escape handling.
8. Check the layout at 375px, 768px, 1024px, and 1440px widths.
9. Run `npm run lint` in `backend` and `npm run build` in `admin-panel`.
