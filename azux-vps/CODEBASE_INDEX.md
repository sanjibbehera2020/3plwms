# AZUX 3PL WMS Systems - Codebase Index

## Project Overview
A TanStack React Start application (TypeScript/React) for a multi-tenant 3PL (Third-Party Logistics) Warehouse Management System.

## Tech Stack
- **Framework**: TanStack React Start
- **UI**: React 19 + TypeScript
- **Styling**: Tailwind CSS
- **Routing**: TanStack Router
- **Data**: TanStack React Query (mock data currently)
- **Database**: PostgreSQL 16 (configured but not connected)
- **Deployment**: Docker, self-hosted on VPS

---

## Project Structure

```
azux-vps/
├── package.json          # Dependencies (React 19, TanStack, Radix UI, Recharts, etc.)
├── Dockerfile            # Multi-stage Docker build (bun→node)
├── docker-compose.yml    # App + PostgreSQL services
├── vite.config.ts        # Vite config (Cloudflare Workers target)
├── vite.config.node.ts   # Node.js target config (for self-hosting)
├── tsconfig.json
├── SELF_HOSTING.md       # Deployment guide
├── components.json
├── eslint.config.js
├── .env.example
├── db/
│   └── init/             # SQL initialization scripts (empty)
├── src/
│   ├── server.ts         # Custom server entry with error handling
│   ├── routes/
│   ├── components/
│   ├── lib/
│   └── ...
└── public/
```

---

## Routes (`/src/routes/`)

| File | Description |
|------|-------------|
| `index.tsx` | Operations Dashboard - KPIs, charts, warehouse capacity, operational logs |
| `inbound.tsx` | Inbound receipts and ASN (Advanced Shipping Notice) tracking |
| `inventory.tsx` | Inventory management with LIFO/FIFO allocation |
| `orders.tsx` | Order management and allocation |
| `shipments.tsx` | Shipment tracking and BOL (Bill of Lading) management |
| `pallets.tsx` | Pallet-level inventory tracking |
| `masters.tsx` | Master BOL consolidation |
| `edi.tsx` | EDI (Electronic Data Interchange) logs and management |
| `documents.tsx` | Document management |
| `billing.tsx` | Billing and invoicing |
| `settings.tsx` | Application settings |
| `__root.tsx` | Root route with QueryClient, app shell, error/404 handling |

---

## Components (`/src/components/`)

| File | Description |
|------|-------------|
| `app-shell.tsx` | Main layout with sidebar, topbar, theme toggle, user menu |
| `app-sidebar.tsx` | Navigation sidebar with role-based menu items |
| `workspace-context.tsx` | Context for tenant/warehouse/strategy selection |
| `csv-uploader.tsx` | CSV file upload component |
| `bol/` | BOL-specific components (5 files) |

---

## Mock Data Files (`/src/lib/`)

| File | Description |
|------|-------------|
| `mock-data.ts` | Tenants, warehouses, inventory items with batches |
| `edi-data.ts` | EDI transactions (832, 940, 943, 944, 945) and order data |
| `bol-data.ts` | Bill of Lading data structures and consolidation logic |
| `auth.tsx` | Authentication (mock user directory + role-based access) |
| Other lib files | Various utilities and helpers |

---

## Mock Data Entities

### Tenants (Clients)
- ACME Outdoor Co., Northstar Apparel, Harborlite Electronics, Verdant Wellness

### Warehouses
- ATL1 (Atlanta), ORD2 (Chicago), LAX3 (Los Angeles), EWR1 (Newark)

### Inventory
- SKU with batches (lot/receipt tracking)
- EDI sources: EDI_943, EDI_944, CSV, MANUAL
- Categories: Camping, Apparel, Audio, Supplements, Accessories

### Orders
- EDI 940 inbound orders
- Status: new, released, picking, packed, shipped, exception
- Sources: EDI_940, CSV, API

### EDI Transactions
- 832: Price/Sales Catalog
- 940: Warehouse Shipping Order
- 943: Stock Transfer Shipment Advice
- 944: Stock Transfer Receipt Advice
- 945: Warehouse Shipping Advice

### Bill of Lading
- VICS BOL v3.1 format
- Single and Master BOL support
- Consolidation groups by destination/carrier

---

## Features Ready for Implementation

Based on the SELF_HOSTING.md document, the following steps are needed to fully migrate from mock data:

### Step 2: Drizzle ORM Schema
Replace in-memory mock data with PostgreSQL tables:
- `tenants` table
- `warehouses` table
- `inventory_items` table
- `inventory_batches` table
- `orders` table
- `order_lines` table
- `edi_logs` table
- `bills_of_lading` table
- `users` table (for auth)

### Step 3: Server Functions
Replace direct imports with `createServerFn` calls:
- Move mock data functions to server functions
- Connect to PostgreSQL via Drizzle ORM
- Implement proper session handling with bcrypt + httpOnly cookies

---

## Authentication Roles

| Role | Accessible Routes |
|------|-----------------|
| Admin | All routes |
| Operations Manager | All except settings |
| Warehouse Lead | Main operations + documents |
| Receiver | Inbound + inventory + pallets |
| Picker | Orders + shipments + inventory |
| Billing | Billing + documents |
| Viewer | Dashboard + inventory only |

---

## Development Commands

```bash
# Development
bun install
bun run dev

# Production build (Node target)
bun run build

# Docker deployment
docker compose up -d --build
```

---

## Next Steps for Real Features

1. Add Drizzle ORM schema and migrations
2. Replace mock data with database queries
3. Implement real authentication with bcrypt + sessions
4. Add API endpoints for CRUD operations
5. Implement EDI file ingestion
6. Add reporting/export capabilities