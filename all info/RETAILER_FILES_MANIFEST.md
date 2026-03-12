# 📋 Retailer Project Files Manifest

## Quick Reference for File Extraction

This document provides an exact list of all files to extract for the retailer project.

---

## 🔴 Files to MOVE (Delete from main project)

### API Layer
```
src/api/retailerClient.ts           → Rename to: src/api/client.ts
src/api/retailerAuth.ts              → Rename to: src/api/auth.ts
src/api/retailerProducts.ts          → Rename to: src/api/products.ts
src/api/retailerOrders.ts            → Rename to: src/api/orders.ts
src/api/retailerPayments.ts          → Rename to: src/api/payments.ts
```

### Context
```
src/context/RetailerAuthContext.tsx  → Rename to: src/context/AuthContext.tsx
```

### Components
```
src/components/RetailerLayout.tsx    → Keep name or rename to: Layout.tsx
src/components/RetailerLayout.css    → Keep name or rename to: Layout.css
```

### Pages
```
src/pages/retailer/RetailerDashboardPage.tsx     → Rename to: src/pages/DashboardPage.tsx
src/pages/retailer/RetailerAllProductsPage.tsx   → Rename to: src/pages/AllProductsPage.tsx
src/pages/retailer/RetailerProductsPage.tsx      → Rename to: src/pages/ProductsPage.tsx
src/pages/retailer/RetailerOrdersPage.tsx        → Rename to: src/pages/OrdersPage.tsx
src/pages/retailer/RetailerPaymentsPage.tsx      → Rename to: src/pages/PaymentsPage.tsx
src/pages/retailer/RetailerProfilePage.tsx       → Rename to: src/pages/ProfilePage.tsx
src/pages/retailer/RetailerPages.css             → Rename to: src/pages/Pages.css or index.css
```

---

## 🟡 Files to COPY (Keep in main project, shared)

### Components (keep both places)
```
src/components/Toast.tsx             → Copy to retailer
src/components/Toast.css             → Copy to retailer
```

### API Utilities
```
src/api/uploads.ts                   → Copy to retailer (shared for image uploads)
```

### Assets
```
public/images/logo.png               → Copy to retailer
```

---

## 🟢 Files to CREATE in Retailer Project

### Login/Signup (extract from existing)
```
✅ Create: src/pages/LoginPage.tsx
   Source: Extract retailer flow from current LoginPage.tsx
   Changes:
   - Remove role toggle
   - Remove user auth imports
   - Keep only retailer OTP flow
   - Navigate to /dashboard instead of /retailer/dashboard

✅ Create: src/pages/SignupPage.tsx
   Source: Extract retailer form from current SignupPage.tsx
   Changes:
   - Remove role toggle
   - Remove user form fields
   - Keep only retailer form (30+ fields)
   - Keep file uploads and compressImage function
```

### Root Components
```
✅ Create: src/App.tsx
   - Simple router with retailer routes only
   - AuthProvider (renamed from RetailerAuthProvider)
   - ToastProvider
   - ProtectedRoute guard

✅ Create: src/main.tsx
   - React entry point
   - Same as consumer app

✅ Create: src/index.css
   - Root CSS variables
   - Copy from main project, keep only retailer colors

✅ Create: src/App.css
   - Global app styles
   - Copy relevant parts from main project
```

### Utilities
```
✅ Create: src/utils/api.ts
   - unwrapData() function
   - getImageUrl() function
   - formatCurrency() function
   - formatDate() function

✅ Create: src/types/index.ts
   - Retailer interface
   - Product interface
   - Order interface
   - Payment interface
```

### Configuration
```
✅ Create: vite.config.ts
✅ Create: tsconfig.json
✅ Create: tsconfig.app.json
✅ Create: tsconfig.node.json
✅ Create: eslint.config.js
✅ Create: package.json
✅ Create: index.html
✅ Create: .env
✅ Create: .gitignore
✅ Create: README.md
```

---

## 📊 File Count Summary

| Category | Files to Move | Files to Copy | Files to Create |
|----------|--------------|---------------|-----------------|
| API | 5 | 1 | 0 |
| Context | 1 | 0 | 0 |
| Components | 2 | 2 | 0 |
| Pages | 7 | 0 | 2 |
| Utilities | 0 | 0 | 2 |
| Config | 0 | 0 | 10 |
| Assets | 0 | 1 | 0 |
| **TOTAL** | **15** | **4** | **14** |

**Grand Total: 33 files**

---

## 🛠️ Step-by-Step Extraction Commands

### 1. Create New Project Structure
```bash
mkdir helo-med-retailer
cd helo-med-retailer
mkdir -p src/{api,components,context,pages,utils,types}
mkdir -p public/images
```

### 2. Copy API Files
```bash
cp ../Helo-Med/src/api/retailerClient.ts src/api/client.ts
cp ../Helo-Med/src/api/retailerAuth.ts src/api/auth.ts
cp ../Helo-Med/src/api/retailerProducts.ts src/api/products.ts
cp ../Helo-Med/src/api/retailerOrders.ts src/api/orders.ts
cp ../Helo-Med/src/api/retailerPayments.ts src/api/payments.ts
cp ../Helo-Med/src/api/uploads.ts src/api/uploads.ts
```

### 3. Copy Context
```bash
cp ../Helo-Med/src/context/RetailerAuthContext.tsx src/context/AuthContext.tsx
```

### 4. Copy Components
```bash
cp ../Helo-Med/src/components/RetailerLayout.tsx src/components/Layout.tsx
cp ../Helo-Med/src/components/RetailerLayout.css src/components/Layout.css
cp ../Helo-Med/src/components/Toast.tsx src/components/Toast.tsx
cp ../Helo-Med/src/components/Toast.css src/components/Toast.css
```

### 5. Copy Pages
```bash
cp ../Helo-Med/src/pages/retailer/RetailerDashboardPage.tsx src/pages/DashboardPage.tsx
cp ../Helo-Med/src/pages/retailer/RetailerAllProductsPage.tsx src/pages/AllProductsPage.tsx
cp ../Helo-Med/src/pages/retailer/RetailerProductsPage.tsx src/pages/ProductsPage.tsx
cp ../Helo-Med/src/pages/retailer/RetailerOrdersPage.tsx src/pages/OrdersPage.tsx
cp ../Helo-Med/src/pages/retailer/RetailerPaymentsPage.tsx src/pages/PaymentsPage.tsx
cp ../Helo-Med/src/pages/retailer/RetailerProfilePage.tsx src/pages/ProfilePage.tsx
cp ../Helo-Med/src/pages/retailer/RetailerPages.css src/pages/Pages.css
```

### 6. Copy Assets
```bash
cp ../Helo-Med/public/images/logo.png public/images/logo.png
```

### 7. Initialize npm Project
```bash
npm init -y
```

### 8. Install Dependencies
```bash
npm install react@^19.2.0 react-dom@^19.2.0 react-router-dom@^7.13.0
npm install axios@^1.13.5 framer-motion@^12.34.0 lucide-react@^0.563.0 clsx@^2.1.1
npm install -D vite@^5.4.0 @vitejs/plugin-react@^5.1.1
npm install -D typescript@~5.9.3 @types/react@^19.2.5 @types/react-dom@^19.2.3
npm install -D eslint@^9.39.1 typescript-eslint@^8.46.4
```

---

## 🔍 Import Updates Required

After copying, run find-and-replace across all files:

### In API Files (client.ts, auth.ts, etc.):
```typescript
// ❌ Old imports:
import { retailerClient } from './retailerClient';

// ✅ New imports:
import { client } from './client';
```

### In Context (AuthContext.tsx):
```typescript
// ❌ Old function names:
export const RetailerAuthProvider = ({ children }) => {
  const retailerLogin = (token, retailer) => { ... }
  const retailerLogout = () => { ... }
}

// ✅ New function names:
export const AuthProvider = ({ children }) => {
  const login = (token, retailer) => { ... }
  const logout = () => { ... }
}
```

### In Components (Layout.tsx):
```typescript
// ❌ Old imports:
import { useRetailerAuth } from '../context/RetailerAuthContext';

// ✅ New imports:
import { useAuth } from '../context/AuthContext';
```

```typescript
// ❌ Old route paths:
<NavLink to="/retailer/dashboard">Dashboard</NavLink>

// ✅ New route paths:
<NavLink to="/dashboard">Dashboard</NavLink>
```

### In All Page Files:
```typescript
// ❌ Old imports:
import { useRetailerAuth } from '../../context/RetailerAuthContext';
import { getRetailerProducts } from '../../api/retailerProducts';

// ✅ New imports:
import { useAuth } from '../context/AuthContext';
import { getProducts } from '../api/products';
```

---

## 🧹 Cleanup Main Project

After successful extraction, remove from **main (consumer) Helo-Med** project:

```bash
# Delete API files
rm src/api/retailerClient.ts
rm src/api/retailerAuth.ts
rm src/api/retailerProducts.ts
rm src/api/retailerOrders.ts
rm src/api/retailerPayments.ts

# Delete context
rm src/context/RetailerAuthContext.tsx

# Delete components
rm src/components/RetailerLayout.tsx
rm src/components/RetailerLayout.css

# Delete pages
rm -rf src/pages/retailer/
```

### Update `App.tsx`:
Remove all retailer-related code:
- Remove `RetailerAuthProvider` import and usage
- Remove `useRetailerAuth` import
- Remove all retailer page imports
- Remove `RetailerProtectedRoute` component
- Remove all `/retailer/*` routes

### Update `LoginPage.tsx`:
Remove retailer role:
- Remove `ShoppingCart`, `Store` icon imports
- Remove `useRetailerAuth` import
- Remove `retailerSendOtp`, `retailerVerifyOtp` imports
- Remove role state and toggle UI
- Remove retailer auth logic from handlers

### Update `SignupPage.tsx`:
Remove retailer form:
- Remove `retailerSignup` import
- Remove `compressImage` function (if only used for retailer)
- Remove all retailer state variables
- Remove role toggle UI
- Remove entire retailer form section (30+ fields)

---

## ✅ Verification Checklist

### Retailer Project:
```bash
# Should start without errors
npm run dev

# Should build without errors
npm run build

# Should have these routes working:
# http://localhost:5001/login
# http://localhost:5001/signup
# http://localhost:5001/dashboard (after login)
# http://localhost:5001/products
# http://localhost:5001/orders
# http://localhost:5001/payments
# http://localhost:5001/profile
```

### Main Consumer Project:
```bash
# Should start without errors
npm run dev

# Should build without errors
npm run build

# Should NOT have these:
# - No /retailer/* routes
# - No retailer API files
# - No RetailerAuthProvider
# - No role toggle in login/signup
```

---

## 📝 Notes

1. **File Sizes**: The retailer project will be approximately **40-50% smaller** than the combined project because it removes all consumer-specific features (cart, wishlist, socket.io, invoice generation).

2. **Shared Code**: Consider extracting shared utilities (Toast, getImageUrl, etc.) into a separate npm package if both projects will evolve independently.

3. **Backend Changes**: If backend API structure changes, both projects must be updated. Consider API versioning on the backend.

4. **Testing**: After extraction, test all CRUD operations:
   - Login/Signup
   - Product management (add, edit, delete)
   - Order acceptance/rejection
   - Payment history viewing
   - Profile updates

5. **Documentation**: Create separate README.md files for each project with specific setup and deployment instructions.

---

**Estimated Time for Extraction:**
- File copying: 15 minutes
- Import updates: 30-45 minutes
- Testing: 30-60 minutes
- **Total: 1.5 - 2 hours**

---

**Generated:** March 9, 2026  
**For:** Helo-Med Retailer Project Separation
