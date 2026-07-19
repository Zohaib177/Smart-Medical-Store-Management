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

## Phase 5 — Medicine Categories Management

Phase 5 replaces the category placeholder with a complete authenticated category-management module. Administrators can search, filter, sort, paginate, create, view, edit, activate, deactivate, refresh, and safely delete medicine categories.

### Backend routes

All category endpoints require an authenticated administrator:

```http
GET    /api/categories
GET    /api/categories/:id
POST   /api/categories
PUT    /api/categories/:id
PATCH  /api/categories/:id/status
DELETE /api/categories/:id
```

The list endpoint supports:

- `page` — positive integer, default `1`
- `limit` — integer from `1` to `100`, default `10`
- `search` — category name or description
- `status` — `active` or `inactive`
- `sortBy` — `category_name`, `status`, `created_at`, or `updated_at`
- `sortDirection` — `asc` or `desc`

Medicine counts are returned through one aggregated query rather than one query per category. Pagination metadata includes the current page, limit, total records, total pages, and next/previous-page flags.

### Validation and status rules

- Category name is required, trimmed, and must contain 2–100 characters.
- Repeated internal whitespace in names is normalized.
- Category names must be unique without regard to letter case.
- Description is optional, trimmed, and limited to 500 characters.
- Status must be `active` or `inactive`; new categories default to `active`.
- IDs must be positive integers.
- Sort columns and directions are allowlisted before being used in SQL.
- Only category fields are accepted and written by the category service.

Deactivation does not delete a category or its medicine relationships. It marks the category unavailable for future active selections.

### Safe deletion

Before physical deletion, the service counts medicines referencing the category. A category with linked medicines returns HTTP `409` with `CATEGORY_IN_USE`; medicines are never cascade-deleted. An unused category can be deleted permanently.

Category error codes:

- `CATEGORY_NOT_FOUND`
- `CATEGORY_ALREADY_EXISTS`
- `CATEGORY_IN_USE`
- `CATEGORY_CREATE_FAILED`
- `CATEGORY_UPDATE_FAILED`
- `CATEGORY_DELETE_FAILED`

Raw database errors are translated before reaching category API consumers.

### Frontend module

The protected frontend route is:

```text
/admin/categories
```

The page includes:

- Debounced name/description search
- Status and sort filters with reset support
- Responsive, horizontally contained category table
- Results count, pagination, and manual refresh
- Shared create/edit form with client and server validation
- Details modal with medicine count and timestamps
- Status-change confirmation
- Permanent-delete confirmation and safe conflict feedback
- Loading skeletons, filtered and unfiltered empty states, retry state, and toast notifications
- Accessible labels, dialog semantics, Escape handling, focus restoration, and labelled icon actions

### Phase 5 testing

1. Start MySQL and apply the existing Phase 0, Phase 1, and Phase 3 scripts if the tables are not present.
2. Seed an administrator with `node backend/scripts/seed-admin.js`.
3. Start the backend and frontend.
4. Confirm unauthenticated category requests return HTTP `401`.
5. Sign in and test list pagination, search, status filters, and every sort option.
6. Test valid creation plus empty name, duplicate name with different casing, invalid status, and descriptions over 500 characters.
7. Test details, editing, duplicate-name editing, activation, and deactivation.
8. Confirm unused categories delete successfully and linked categories return HTTP `409` with `CATEGORY_IN_USE`.
9. Confirm existing health, authentication, dashboard, and non-category admin routes continue to work.
10. Run `npm run lint` in `backend` and `npm run build` in `admin-panel`.

## Phase 6 — Medicine Companies Management

Phase 6 replaces the company placeholder with a complete authenticated pharmaceutical-company management module. Administrators can search, filter, sort, paginate, create, view, edit, activate, deactivate, refresh, and safely delete companies.

### Backend routes

All company endpoints require an authenticated administrator:

```http
GET    /api/companies
GET    /api/companies/:id
POST   /api/companies
PUT    /api/companies/:id
PATCH  /api/companies/:id/status
DELETE /api/companies/:id
```

The list endpoint supports `page`, `limit`, `search`, `status`, `sortBy`, and `sortDirection`. Search covers company name, contact person, email, phone, and address. Allowed sort fields are `company_name`, `contact_person`, `email`, `phone`, `status`, `created_at`, and `updated_at`. Medicine counts are returned through an aggregate query without N+1 requests.

### Fields and validation

- Company name is required, trimmed, normalized, 2–150 characters, and unique without regard to letter case.
- Contact person is optional, trimmed, and limited to 120 characters.
- Email is optional, lowercased, validated, and limited to 150 characters. The existing schema does not make email unique, so Phase 6 does not impose email uniqueness.
- Phone is optional, limited to 30 characters, and permits numbers, spaces, plus, hyphen, and parentheses.
- Address is optional, trimmed, and limited to 1000 characters.
- Status is `active` or `inactive`; new companies default to `active`.
- Pagination values are bounded and SQL sort columns are allowlisted.

### Safe deletion and status

Before physical deletion, the service counts medicines referencing the company. A linked company returns HTTP `409` with `COMPANY_IN_USE`; medicines are never cascade-deleted. Deactivation leaves existing medicine relationships unchanged while making the company unavailable for future active selections.

Company error codes:

- `COMPANY_NOT_FOUND`
- `COMPANY_ALREADY_EXISTS`
- `COMPANY_IN_USE`
- `COMPANY_CREATE_FAILED`
- `COMPANY_UPDATE_FAILED`
- `COMPANY_DELETE_FAILED`

Raw database errors are translated before reaching company API clients.

### Frontend module

The protected route is `/admin/companies`. The responsive page provides debounced search, filters, sorting, result count, refresh, pagination, add/edit forms, details, status confirmation, permanent-delete confirmation, loading skeletons, empty and retry states, and reusable toast feedback. Long email, phone, and address values are contained safely; full address information appears in the details modal.

### Phase 6 testing

1. Confirm unauthenticated company requests return HTTP `401`.
2. Test pagination, search across every supported field, both statuses, and each sorting option.
3. Test creation plus empty name, differently-cased duplicate name, invalid email, invalid phone characters, and overlong values.
4. Test details, editing, duplicate-name editing, activation, and deactivation.
5. Confirm unused companies delete successfully and linked companies return HTTP `409` with `COMPANY_IN_USE`.
6. Confirm health, authentication, dashboard, categories, and other admin routes still work.
7. Run `npm run lint` in `backend` and `npm run build` in `admin-panel`.

## Phase 7 — Medicine Management

Phase 7 replaces the medicine placeholder with a complete authenticated medicine-management module. Administrators can search, filter, sort, paginate, create, view, edit, activate, deactivate, refresh, and safely delete medicines while tracking pricing, stock, category, company, barcode, batch, and expiry information.

### Database relationships and field mapping

`medicines.category_id` references `medicine_categories.id` and `medicines.company_id` references `medicine_companies.id`. Both relations are required. New and normally edited medicines must reference active records.

The API maps the existing `selling_price` column to `salePrice` and the existing `image` column to `imageUrl`. Image upload infrastructure is not installed, so Phase 7 accepts only an optional validated HTTP/HTTPS image URL. The schema has no `unit` column, so no unit value is stored or invented.

### Backend routes

All endpoints require an authenticated administrator. `/options` is registered before `/:id`.

```http
GET    /api/medicines
GET    /api/medicines/options
GET    /api/medicines/:id
POST   /api/medicines
PUT    /api/medicines/:id
PATCH  /api/medicines/:id/status
DELETE /api/medicines/:id
```

The list endpoint supports `page`, `limit`, `search`, `status`, `categoryId`, `companyId`, `stockStatus`, `expiryStatus`, `sortBy`, and `sortDirection`. Search covers medicine name, generic name, barcode, batch, description, category name, and company name. Joins avoid N+1 relation queries.

### Validation and business rules

- Medicine name is required, normalized, and limited to 2–150 characters.
- Category and company IDs are required, must exist, and must be active.
- Generic name, batch, barcode, dosage form, and strength are optional and length-limited according to the schema.
- Blank barcode values become `null`; provided barcodes are unique.
- Purchase and sale prices are non-negative and limited to two decimal places.
- Sale price cannot be lower than purchase price.
- Stock and minimum stock are non-negative integers.
- Manufacturing and expiry values are ISO dates; expiry must be later than manufacturing date.
- New expired medicines are rejected. An existing expired record can be edited when its expired date is unchanged.
- Prescription requirement is stored as a boolean-compatible value.
- Admin-managed status is `active` or `inactive`. Stock status is derived rather than written to the legacy `out_of_stock` enum value.
- Image URL is optional, HTTP/HTTPS only, and limited to the existing 255-character column.

### Derived stock and expiry states

Stock status is not stored:

- `outOfStock`: quantity is zero or below
- `lowStock`: quantity is above zero and at or below minimum stock
- `inStock`: quantity is above minimum stock

Expiry status is calculated with MySQL's current calendar date:

- `expired`: expiry date is before today
- `expiringSoon`: today through the following 30 days
- `valid`: more than 30 days away
- `unknown`: no expiry date

`daysUntilExpiry` is negative for expired stock, zero for today, positive for future dates, and `null` without an expiry date.

### Options and safe deletion

`GET /api/medicines/options` returns alphabetized active categories and companies plus allowed statuses. Before deletion, the service checks `purchase_items`, `sale_items`, and `inventory_logs`. Any linked transaction returns HTTP `409` with `MEDICINE_IN_USE`; transaction data is never cascade-deleted.

Medicine error codes include:

- `MEDICINE_NOT_FOUND`
- `MEDICINE_BARCODE_EXISTS`
- `MEDICINE_IN_USE`
- `INVALID_CATEGORY` / `CATEGORY_INACTIVE`
- `INVALID_COMPANY` / `COMPANY_INACTIVE`
- `INVALID_PRICE_RANGE`
- `INVALID_EXPIRY_DATE`
- `MEDICINE_CREATE_FAILED`
- `MEDICINE_UPDATE_FAILED`
- `MEDICINE_DELETE_FAILED`

### Frontend module

The protected route is `/admin/medicines`. The page provides debounced search, six filter/sort controls, result count, refresh, pagination, a sectioned create/edit form, category/company options, image preview, details, status and delete confirmation, stock and expiry badges, loading skeletons, empty/error states, and toast feedback. The wide table is contained within its card so it does not create page-level horizontal overflow.

### Phase 7 testing

1. Verify unauthenticated medicine requests return HTTP `401` and options contain only active relations.
2. Test search plus status, category, company, stock, and expiry filters and all allowlisted sorts.
3. Test valid creation and joined details with numeric prices/counts and derived statuses.
4. Test invalid/missing relations, inactive relations, duplicate barcodes, negative values, price range, decimal precision, date order, and expired-date rules.
5. Test updates with the same barcode, activation/deactivation, and editing unchanged expired records.
6. Confirm unused medicines delete and linked medicines return HTTP `409 MEDICINE_IN_USE`.
7. Confirm categories, companies, dashboard, authentication, and health routes still work.
8. Run `npm run lint` in `backend` and `npm run build` in `admin-panel`.

## Phase 8 — Inventory Management

Phase 8 replaces the inventory placeholder at `/admin/inventory` with a protected inventory workspace. It provides live summary cards, current-stock and audit-history tabs, debounced search, allowlisted filters and sorting, pagination, current-page CSV export, manual stock adjustment, and medicine-specific paginated history. It does not add purchases, sales, suppliers, barcode scanning, or multi-store behavior.

### Inventory API routes

All routes require an authenticated administrator:

```http
GET  /api/inventory
GET  /api/inventory/summary
GET  /api/inventory/history
GET  /api/inventory/medicines/:medicineId/history
POST /api/inventory/medicines/:medicineId/adjust
```

The inventory list supports `page`, `limit`, `search`, `status`, `categoryId`, `companyId`, `stockStatus`, `expiryStatus`, `sortBy`, and `sortDirection`. History supports pagination, search, medicine, transaction type, administrator, inclusive date range, and sort direction filters. Dates are validated and `dateFrom` cannot be later than `dateTo`.

### Stock adjustments and transaction safety

Manual types are `stockIn`, `stockOut`, and `correction`, stored as `stock_in`, `stock_out`, and `correction`. Stock-in adds a positive whole number, stock-out subtracts a positive whole number, and correction sets an exact non-negative quantity. A 3–255 character reason is required; notes are optional up to 1000 characters.

The service starts one MySQL transaction, selects the medicine with `SELECT ... FOR UPDATE`, reads the authoritative quantity, calculates the signed change, rejects negative stock, updates `medicines.stock_quantity`, and inserts the audit log before committing. Any failure rolls both writes back. The authenticated `req.admin.id` is recorded; an administrator ID from the request body is never accepted.

`inventory_logs` retains its original `quantity`, `remaining_stock`, `remarks`, and legacy transaction types. The non-destructive Phase 8 migration adds `admin_id`, `quantity_change`, `previous_quantity`, `new_quantity`, `reference_type`, `reference_id`, `reason`, and `notes`, plus administrator and transaction-type indexes. The migration is [database/phase_8_inventory_management.sql](database/phase_8_inventory_management.sql).

### Inventory summary

- Total medicines counts all catalog records.
- Total stock units sums `stock_quantity` and returns zero rather than null.
- In stock means quantity is above `minimum_stock`.
- Low stock means quantity is positive and at or below `minimum_stock`.
- Out of stock means quantity is zero or below.
- Expired means the expiry date is before today.
- Expiring soon means today through 30 days from today, so expired records are excluded.
- Inventory cost value is `SUM(stock_quantity * purchase_price)`; no sales value is invented.

### Frontend components

`InventoryPage` uses `useInventory` and the shared UI system. Its inventory components include summary cards, inventory/history filters and tables, stock/expiry and transaction badges, signed stock-change display, a two-step adjustment modal with live preview, and a medicine-history modal. The backend remains authoritative for all preview calculations.

### Phase 8 testing

1. Apply `database/phase_8_inventory_management.sql` once to an existing Phase 1 database, then restart the backend.
2. Confirm anonymous inventory requests return `401` and authenticated list, summary, history, and medicine-history responses include pagination where applicable.
3. Exercise every search/filter/sort allowlist and verify an invalid date range returns `422 INVALID_DATE_RANGE`.
4. Verify stock-in, stock-out, and positive/negative/zero corrections produce correct previous, change, and new quantities.
5. Verify stock-out beyond current quantity returns `409 INSUFFICIENT_STOCK`; negative input, missing reason, and invalid types return validation errors.
6. Confirm the medicine update and audit insert commit together, failed inserts roll back, the locked row prevents lost concurrent updates, and the logged administrator matches the authenticated session.
7. Check auth, dashboard, category, company, and medicine routes for regressions.
8. Run `npm run lint` in `backend` and `npm run build` in `admin-panel`.

Inventory errors include `MEDICINE_NOT_FOUND`, `INVALID_TRANSACTION_TYPE`, `INVALID_ADJUSTMENT_QUANTITY`, `INSUFFICIENT_STOCK`, `NEGATIVE_STOCK_NOT_ALLOWED`, `INVALID_DATE_RANGE`, `INVENTORY_ADJUSTMENT_FAILED`, and `INVENTORY_HISTORY_FAILED`. Database details are normalized by the existing API error middleware rather than returned as raw SQL errors.
