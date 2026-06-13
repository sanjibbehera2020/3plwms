# Firestore Migration Plan

## Overview
Migrate AZUX 3PL WMS from mock data to Google Firestore database while maintaining the existing TanStack React Start architecture.

## Firebase Configuration (Provided)
```
Project ID: wms-3pl-79a05
Auth Domain: wms-3pl-79a05.firebaseapp.com
Storage Bucket: wms-3pl-79a05.firebasestorage.app
API Key: AIzaSyBJYHc1F82v-IboPGFjGFn9xZ8Lt35YTkM
App ID: 1:213756667050:web:88e060d061075e1d6f5cd3
```

## Firestore Collections Schema

### 1. `tenants`
```javascript
{
  id: string,           // auto-generated
  code: string,         // e.g., "ACME"
  name: string,         // e.g., "Acme Outdoor Co."
  createdAt: timestamp
}
```

### 2. `warehouses`
```javascript
{
  id: string,           // auto-generated
  code: string,         // e.g., "ATL1"
  name: string,         // e.g., "ATL-1 Distribution"
  city: string,
  state: string,
  capacityPct: number,
  tenantId: string,     // reference to tenant
  createdAt: timestamp
}
```

### 3. `inventory_items`
```javascript
{
  id: string,           // auto-generated
  sku: string,
  upc: string,
  itemStyle: string,
  description: string,
  category: string,
  uom: string,
  unitCost: number,
  unitPrice: number,
  caseQty: number,
  weightLbs: number,
  tenantId: string,
  warehouseId: string,
  status: "active" | "low" | "out" | "hold",
  createdAt: timestamp
}
```

### 4. `inventory_batches`
```javascript
{
  id: string,           // auto-generated
  batchId: string,      // Lot / Receipt batch
  palletId: string,     // Unique pallet ID
  itemId: string,       // reference to inventory_items
  receivedAt: timestamp,
  qty: number,
  location: string,     // Aisle-Shelf-Bin
  poNumber: string,
  ediSource: "EDI_943" | "EDI_944" | "CSV" | "MANUAL"
}
```

### 5. `orders`
```javascript
{
  id: string,           // auto-generated
  orderNumber: string,  // e.g., "SO-554120"
  poNumber: string,
  ediRef: string,
  tenantId: string,
  warehouseId: string,
  shipTo: string,
  carrier: string,
  serviceLevel: string,
  status: "new" | "released" | "picking" | "packed" | "shipped" | "exception",
  source: "EDI_940" | "CSV" | "API",
  receivedAt: timestamp,
  requiredShipBy: timestamp
}
```

### 6. `order_lines`
```javascript
{
  id: string,
  orderId: string,      // reference to orders
  sku: string,
  description: string,
  qtyOrdered: number,
  qtyAllocated: number,
  unitPrice: number
}
```

### 7. `edi_logs`
```javascript
{
  id: string,
  txn: "832" | "940" | "943" | "944" | "945",
  direction: "inbound" | "outbound",
  status: "accepted" | "processed" | "pending" | "warning" | "rejected",
  partner: string,
  isaControl: string,
  gsControl: string,
  documentRef: string,
  tenantId: string,
  warehouseId: string,
  segments: number,
  bytes: number,
  receivedAt: timestamp,
  ackStatus: "997-TA1" | "997-AK9" | "999" | "pending" | "—",
  message: string
}
```

### 8. `bills_of_lading`
```javascript
{
  id: string,
  proNumber: string,
  bolNumber: string,
  type: "single" | "master",
  status: "draft" | "issued" | "tendered" | "in-transit" | "delivered" | "void",
  tenantId: string,
  warehouseId: string,
  carrier: string,
  scac: string,
  serviceLevel: string,
  trailerNumber: string,
  sealNumber: string,
  freightChargeTerms: "prepaid" | "collect" | "third-party",
  thirdPartyAccount: string,
  cod: number,
  declaredValue: number,
  shipper: object,
  consignee: object,
  billTo: object,
  specialInstructions: string,
  pickupDate: timestamp,
  createdAt: timestamp,
  childOrderIds: array,
  childBolIds: array,
  lines: array,
  totals: object
}
```

### 9. `users`
```javascript
{
  id: string,           // Firebase Auth UID
  email: string,
  name: string,
  role: "Admin" | "Operations Manager" | "Warehouse Lead" | "Picker" | "Receiver" | "Billing" | "Viewer",
  warehouseCode: string,
  tenantId: string,
  createdAt: timestamp
}
```

## Implementation Steps

### Step 1: Install Firebase Dependencies
```bash
bun add firebase
bun add -D @types/react-firebase-hooks
```

### Step 2: Create Firebase Configuration
- Create `src/lib/firebase.ts` - Firebase initialization
- Create `src/lib/firestore-services.ts` - Data access layer

### Step 3: Update Environment Variables
- Add Firebase config to `.env` and `.env.example`
- Create `.env` with actual values

### Step 4: Update Mock Data Files
- Convert `mock-data.ts` to use Firestore
- Convert `edi-data.ts` to use Firestore
- Convert `bol-data.ts` to use Firestore

### Step 5: Update Authentication
- Replace mock auth with Firebase Auth
- Add role-based access control

### Step 6: Configure Firebase Hosting
- Create `firebase.json`
- Create `.firebaserc`
- Update build configuration

### Step 7: Seed Initial Data
- Create seed script to populate Firestore with initial data

## Security Rules (Firestore)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /tenants/{tenant} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'Admin';
    }
    match /warehouses/{warehouse} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['Admin', 'Operations Manager'];
    }
    // ... more rules
  }
}
```

## Deployment Commands
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase (if not done)
firebase init

# Deploy to Firebase
firebase deploy