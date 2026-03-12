# 🏪 Helo-Med Retailer Project - Extraction Guide

## 📋 Table of Contents
1. [Overview](#overview)
2. [Project Structure](#project-structure)
3. [Files to Extract](#files-to-extract)
4. [Dependencies](#dependencies)
5. [Setup Instructions](#setup-instructions)
6. [API Endpoints](#api-endpoints)
7. [Shared Utilities](#shared-utilities)
8. [Environment Configuration](#environment-configuration)
9. [Changes to Main Project](#changes-to-main-project)
10. [Integration Points](#integration-points)

---

## 🎯 Overview

This guide details how to extract the **Retailer Management System** from the Helo-Med monolithic application into a separate, standalone project.

**Purpose:** Create an independent retailer-facing application for managing products, orders, and payments.

**Tech Stack:** 
- React 19 + TypeScript + Vite
- Framer Motion for animations
- Axios for API calls
- React Router DOM for routing

---

## 📁 Project Structure

### New Retailer Project Structure:
```
helo-med-retailer/
├── public/
│   └── images/
│       └── logo.png
├── src/
│   ├── api/
│   │   ├── retailerClient.ts          # Axios instance
│   │   ├── retailerAuth.ts            # Auth APIs
│   │   ├── retailerProducts.ts        # Product APIs
│   │   ├── retailerOrders.ts          # Order APIs
│   │   ├── retailerPayments.ts        # Payment APIs
│   │   └── uploads.ts                 # Image upload APIs
│   ├── components/
│   │   ├── RetailerLayout.tsx         # Sidebar layout
│   │   ├── RetailerLayout.css         # Layout styles
│   │   └── Toast.tsx                  # Toast notifications
│   │   └── Toast.css
│   ├── context/
│   │   └── RetailerAuthContext.tsx    # Auth state management
│   ├── pages/
│   │   ├── RetailerLoginPage.tsx      # Login page
│   │   ├── RetailerSignupPage.tsx     # Signup page
│   │   ├── RetailerDashboardPage.tsx  # Dashboard
│   │   ├── RetailerAllProductsPage.tsx # Master products
│   │   ├── RetailerProductsPage.tsx   # Retailer's products
│   │   ├── RetailerOrdersPage.tsx     # Orders management
│   │   ├── RetailerPaymentsPage.tsx   # Payments & settlements
│   │   ├── RetailerProfilePage.tsx    # Profile settings
│   │   └── RetailerPages.css          # Page styles
│   ├── utils/
│   │   └── api.ts                     # Shared API utilities
│   ├── types/
│   │   └── index.ts                   # TypeScript types
│   ├── App.tsx                        # Main app component
│   ├── App.css                        # Global styles
│   ├── main.tsx                       # Entry point
│   └── index.css                      # Root styles
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
└── index.html
```

---

## 📦 Files to Extract

### 1. **API Layer** (`src/api/`)
Extract these files completely:
- ✅ `retailerClient.ts` - Axios instance with token interceptor
- ✅ `retailerAuth.ts` - Login, signup, logout, profile APIs
- ✅ `retailerProducts.ts` - Product CRUD, master products, suggestions
- ✅ `retailerOrders.ts` - Order management APIs
- ✅ `retailerPayments.ts` - Payment history, settlements
- ✅ `uploads.ts` - S3 presigned URL for image uploads

### 2. **Context** (`src/context/`)
- ✅ `RetailerAuthContext.tsx` - Authentication state management

### 3. **Components** (`src/components/`)
- ✅ `RetailerLayout.tsx` - Sidebar navigation layout
- ✅ `RetailerLayout.css` - Layout styling
- ⚠️ `Toast.tsx` - Notification system (shared, needs copy)
- ⚠️ `Toast.css` - Toast styling

### 4. **Pages** (`src/pages/retailer/`)
Extract entire folder:
- ✅ `RetailerDashboardPage.tsx` - Stats overview
- ✅ `RetailerAllProductsPage.tsx` - Browse master products catalog
- ✅ `RetailerProductsPage.tsx` - Manage retailer's product inventory
- ✅ `RetailerOrdersPage.tsx` - View and manage orders
- ✅ `RetailerPaymentsPage.tsx` - Payment history and settlements
- ✅ `RetailerProfilePage.tsx` - Profile and shop settings
- ✅ `RetailerPages.css` - Shared page styles

### 5. **Login/Signup Pages**
From main `src/pages/`, extract retailer logic:
- 🔄 Create `RetailerLoginPage.tsx` - Extract retailer flow from `LoginPage.tsx`
- 🔄 Create `RetailerSignupPage.tsx` - Extract retailer form from `SignupPage.tsx`

### 6. **Shared Utilities**
Copy from main project:
- ⚠️ `src/utils/` - Any shared utilities (if they exist)
- ⚠️ `src/types/` - TypeScript type definitions

### 7. **Assets**
- ⚠️ `public/images/logo.png` - Company logo
- ⚠️ Any retailer-specific images

### 8. **Configuration Files**
Create new versions:
- 🆕 `package.json` - With only retailer dependencies
- 🆕 `vite.config.ts` - Vite configuration
- 🆕 `tsconfig.json` - TypeScript config
- 🆕 `index.html` - Entry HTML
- 🆕 `.env` - Environment variables

---

## 📚 Dependencies

### `package.json` for Retailer Project:
```json
{
  "name": "helo-med-retailer",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "axios": "^1.13.5",
    "clsx": "^2.1.1",
    "framer-motion": "^12.34.0",
    "lucide-react": "^0.563.0",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "react-router-dom": "^7.13.0"
  },
  "devDependencies": {
    "@eslint/js": "^9.39.1",
    "@types/node": "^24.10.1",
    "@types/react": "^19.2.5",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^5.1.1",
    "eslint": "^9.39.1",
    "eslint-plugin-react-hooks": "^7.0.1",
    "eslint-plugin-react-refresh": "^0.4.24",
    "globals": "^16.5.0",
    "typescript": "~5.9.3",
    "typescript-eslint": "^8.46.4",
    "vite": "^5.4.0"
  }
}
```

**Note:** Removed from main project:
- `jspdf` / `jspdf-autotable` (user-only for invoices)
- `socket.io-client` (user-only for real-time order updates)

---

## 🚀 Setup Instructions

### Step 1: Create New Project
```bash
# Create project directory
mkdir helo-med-retailer
cd helo-med-retailer

# Initialize Vite + React + TypeScript
npm create vite@latest . -- --template react-ts

# Install dependencies
npm install
```

### Step 2: Copy Files
```bash
# From the main Helo-Med project, copy:

# API files
cp ../Helo-Med/src/api/retailer*.ts src/api/
cp ../Helo-Med/src/api/uploads.ts src/api/

# Create retailerClient.ts as the main client
# (rename if needed to client.ts in new project)

# Context
cp ../Helo-Med/src/context/RetailerAuthContext.tsx src/context/AuthContext.tsx
# Note: Rename to AuthContext.tsx in new project for simplicity

# Components
cp ../Helo-Med/src/components/RetailerLayout.* src/components/
cp ../Helo-Med/src/components/Toast.* src/components/

# Pages - entire retailer folder
cp -r ../Helo-Med/src/pages/retailer/* src/pages/

# Assets
cp ../Helo-Med/public/images/logo.png public/images/
```

### Step 3: Create Login/Signup Pages
Extract retailer logic from `LoginPage.tsx` and `SignupPage.tsx`:

**`src/pages/LoginPage.tsx`** (new retailer project):
```typescript
// Copy LoginPage.tsx but:
// 1. Remove role toggle (always retailer)
// 2. Use retailerSendOtp/retailerVerifyOtp directly
// 3. Navigate to /dashboard after login
// 4. Remove customer-specific UI
```

**`src/pages/SignupPage.tsx`** (new retailer project):
```typescript
// Copy SignupPage.tsx but:
// 1. Remove role toggle
// 2. Show only retailer form fields
// 3. Use retailerSignup API directly
```

### Step 4: Create `App.tsx`
```typescript
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './components/Toast';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import AllProductsPage from './pages/AllProductsPage';
import ProductsPage from './pages/ProductsPage';
import OrdersPage from './pages/OrdersPage';
import PaymentsPage from './pages/PaymentsPage';
import ProfilePage from './pages/ProfilePage';
import './App.css';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/all-products" element={<ProtectedRoute><AllProductsPage /></ProtectedRoute>} />
            <Route path="/products" element={<ProtectedRoute><ProductsPage /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
            <Route path="/payments" element={<ProtectedRoute><PaymentsPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            
            {/* Redirect root to dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
```

### Step 5: Update All Imports
In the new project, update all imports:

❌ Old:
```typescript
import { useRetailerAuth } from '../context/RetailerAuthContext';
import { retailerClient } from '../api/retailerClient';
```

✅ New:
```typescript
import { useAuth } from '../context/AuthContext';
import { client } from '../api/client';
```

Rename files:
- `RetailerAuthContext.tsx` → `AuthContext.tsx`
- `retailerClient.ts` → `client.ts`
- `retailerAuth.ts` → `auth.ts`
- `retailerProducts.ts` → `products.ts`
- `retailerOrders.ts` → `orders.ts`
- `retailerPayments.ts` → `payments.ts`

Remove "retailer" prefixes from function names:
- `retailerLogin()` → `login()`
- `retailerSendOtp()` → `sendOtp()`
- etc.

### Step 6: Update Navigation Links
In `RetailerLayout.tsx`, update all routes to remove `/retailer` prefix:

❌ Old:
```typescript
<NavLink to="/retailer/dashboard">Dashboard</NavLink>
```

✅ New:
```typescript
<NavLink to="/dashboard">Dashboard</NavLink>
```

---

## 🌐 API Endpoints

### Base URL:
```
https://helo.thynxai.cloud
```

### Authentication API (`retailerAuth.ts`)
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/retailer/send-otp` | POST | Send OTP to retailer phone |
| `/retailer/verify-otp` | POST | Verify OTP and login |
| `/retailer/signup` | POST | Register new retailer |
| `/retailer/profile` | GET | Get retailer profile |
| `/retailer/profile` | PUT | Update retailer profile |
| `/retailer/logout` | POST | Logout retailer |

### Products API (`retailerProducts.ts`)
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/retailer/products` | GET | Get retailer's products |
| `/retailer/products` | POST | Add new product |
| `/retailer/products/:id` | PUT | Update product |
| `/retailer/products/:id` | DELETE | Delete product |
| `/master-products` | GET | Get all master products |
| `/master-products/:id` | GET | Get master product details |
| `/master-products/search` | GET | Search master products |
| `/master-products/suggestions` | GET | Get product name suggestions |

### Orders API (`retailerOrders.ts`)
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/retailer/orders` | GET | Get all orders for retailer |
| `/retailer/orders/:id` | GET | Get order details |
| `/retailer/orders/:id/accept` | POST | Accept an order |
| `/retailer/orders/:id/reject` | POST | Reject an order |
| `/retailer/orders/:id/complete` | POST | Mark order as completed |

### Payments API (`retailerPayments.ts`)
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/retailer/payments` | GET | Get payment history |
| `/retailer/settlements` | GET | Get settlement records |
| `/retailer/earnings` | GET | Get earnings summary |

### Uploads API (`uploads.ts`)
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/presigned-url` | POST | Get S3 presigned URL for image upload |

---

## 🔧 Shared Utilities

### Create `src/utils/api.ts`:
```typescript
/**
 * Unwrap nested API response data
 * Backend returns inconsistent nesting: data.data, data, or raw array
 */
export const unwrapData = <T = any>(payload: any): T => {
  return payload?.data?.data ?? payload?.data ?? payload;
};

/**
 * Get full image URL from S3 key
 */
const S3_BASE = 'https://helomed.s3.ap-south-2.amazonaws.com/';
export const getImageUrl = (key: string | undefined): string => {
  if (!key) return '/placeholder.png';
  if (key.startsWith('http')) return key;
  return `${S3_BASE}${key}`;
};

/**
 * Format currency
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0
  }).format(amount);
};

/**
 * Format date
 */
export const formatDate = (date: string | Date): string => {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(new Date(date));
};
```

### Create `src/types/index.ts`:
```typescript
export interface Retailer {
  id: number;
  shop_name: string;
  owner_name: string;
  phone: string;
  email?: string;
  full_address?: string;
  latitude?: number;
  longitude?: number;
  shop_type?: number;
  license_number?: string;
  gst_number?: string;
  opening_time?: string;
  closing_time?: string;
  is_active?: boolean;
}

export interface Product {
  id: number;
  product_id: number;
  name: string;
  brand_name?: string;
  price: number;
  mrp: number;
  stock: number;
  image?: string;
  requires_prescription?: boolean;
}

export interface Order {
  id: number;
  order_number: string;
  user_id: number;
  total: number;
  status: number;
  payment_mode: number;
  created_at: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: number;
  product_id: number;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

export interface Payment {
  id: number;
  order_id: number;
  amount: number;
  status: number;
  payment_date: string;
}
```

---

## ⚙️ Environment Configuration

### `.env` file:
```env
# API Base URL
VITE_API_BASE_URL=https://helo.thynxai.cloud

# S3 Base URL for images
VITE_S3_BASE_URL=https://helomed.s3.ap-south-2.amazonaws.com

# App name
VITE_APP_NAME=Helo-Med Retailer

# Port (optional)
VITE_PORT=5001
```

### Update `vite.config.ts`:
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5001, // Different from consumer app
  },
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          motion: ['framer-motion'],
          icons: ['lucide-react'],
          vendor: ['axios', 'clsx']
        }
      }
    }
  }
});
```

---

## 🔄 Changes to Main Project

After extracting retailer code, update the **main Helo-Med (consumer) project**:

### 1. **Remove Files**
Delete these files completely:
```bash
# API files
rm src/api/retailerClient.ts
rm src/api/retailerAuth.ts
rm src/api/retailerProducts.ts
rm src/api/retailerOrders.ts
rm src/api/retailerPayments.ts

# Context
rm src/context/RetailerAuthContext.tsx

# Components
rm src/components/RetailerLayout.tsx
rm src/components/RetailerLayout.css

# Pages
rm -rf src/pages/retailer/
```

### 2. **Update `App.tsx`**
Remove all retailer imports and routes:

```typescript
// ❌ Remove these imports:
// import { RetailerAuthProvider, useRetailerAuth } from './context/RetailerAuthContext';
// import RetailerDashboardPage from './pages/retailer/RetailerDashboardPage';
// ... all retailer page imports

// ❌ Remove RetailerAuthProvider from provider nesting
// ❌ Remove RetailerProtectedRoute component
// ❌ Remove all /retailer/* routes
```

**Updated `App.tsx`:**
```typescript
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { AnimationProvider } from './context/AnimationContext';
import FlyToCartLayer from './components/FlyToCartLayer';
import { ToastProvider } from './components/Toast';
import Home from './pages/Home';
// ... other user pages

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <SocketProvider>
          <AnimationProvider>
            <CartProvider>
              <FlyToCartLayer />
              <Router>
                <ScrollToTop />
                <Routes>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  
                  {/* Only user routes */}
                  <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                  <Route path="/categories" element={<ProtectedRoute><CategoriesPage /></ProtectedRoute>} />
                  {/* ... other user routes */}
                </Routes>
              </Router>
            </CartProvider>
          </AnimationProvider>
        </SocketProvider>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
```

### 3. **Update `LoginPage.tsx`**
Remove retailer role toggle:

```typescript
// ❌ Remove:
// import { ShoppingCart, Store } from 'lucide-react';
// import { useRetailerAuth } from '../context/RetailerAuthContext';
// import { retailerSendOtp, retailerVerifyOtp } from '../api/retailerAuth';

// ❌ Remove role state and toggle UI
// ❌ Simplify to only user flow
```

### 4. **Update `SignupPage.tsx`**
Remove retailer form:

```typescript
// ❌ Remove:
// import { retailerSignup } from '../api/retailerAuth';
// ❌ Remove all retailer state variables
// ❌ Remove role toggle
// ❌ Remove retailer form fields
```

### 5. **Update `package.json`**
Optional: Remove unused retailer-only dependencies (if any were added specifically for retailer features).

---

## 🔗 Integration Points

### How the Two Projects Communicate:

#### 1. **Shared Backend**
Both projects use the **same backend** at `https://helo.thynxai.cloud`:
- Consumer app uses `/user/*` endpoints
- Retailer app uses `/retailer/*` endpoints

#### 2. **Authentication**
- **Separate tokens:** `helo_med_token` (consumer) vs `helo_med_retailer_token` (retailer)
- **Separate localStorage keys**
- **No cross-authentication** - users must login separately to each app

#### 3. **Data Flow**
```
Consumer App                Backend API               Retailer App
────────────                ───────────                ────────────
Browse products        →    GET /products        ←     Manage products
Add to cart           →    POST /cart                 
Place order           →    POST /orders         ←     View orders
                                                  ←     Accept/reject orders
Track order           ←    GET /orders/:id      ←     Update order status
```

#### 4. **Cross-Origin Setup**
If hosting on different domains:
```typescript
// In retailerClient.ts
const client = axios.create({
  baseURL: 'https://helo.thynxai.cloud',
  withCredentials: false, // No cookies needed (using token auth)
  headers: {
    'Content-Type': 'application/json',
  }
});
```

#### 5. **Deployment Strategy**

**Option A: Separate Subdomains**
- Consumer: `https://shop.helomed.app`
- Retailer: `https://retailer.helomed.app`

**Option B: Separate Ports (Development)**
- Consumer: `http://localhost:5000`
- Retailer: `http://localhost:5001`

**Option C: Separate Repositories**
- Consumer: `https://github.com/company/helo-med-consumer`
- Retailer: `https://github.com/company/helo-med-retailer`

---

## 📝 Post-Extraction Checklist

### For Retailer Project:
- [ ] All files copied
- [ ] `package.json` created with correct dependencies
- [ ] All imports updated (removed "retailer" prefixes)
- [ ] Navigation paths updated (removed `/retailer` prefix)
- [ ] Environment variables configured
- [ ] Login/Signup pages created (retailer-only)
- [ ] `npm install` runs successfully
- [ ] `npm run dev` starts server on port 5001
- [ ] `npm run build` completes without errors
- [ ] Test login with retailer credentials
- [ ] Test all CRUD operations

### For Main (Consumer) Project:
- [ ] All retailer files removed
- [ ] `App.tsx` cleaned of retailer routes
- [ ] `LoginPage.tsx` simplified to user-only
- [ ] `SignupPage.tsx` simplified to user-only
- [ ] No retailer imports remaining
- [ ] `npm run build` completes without errors
- [ ] Test login with user credentials
- [ ] Verify no broken links

---

## 🎯 Benefits of Separation

### Technical:
✅ **Smaller bundle sizes** - Each app only loads what it needs  
✅ **Independent deployments** - Update retailer app without affecting consumer app  
✅ **Simplified codebase** - Easier to navigate and maintain  
✅ **Better performance** - No unused code in production bundles  

### Organizational:
✅ **Team segregation** - Different teams can own each codebase  
✅ **Access control** - Separate repositories with different permissions  
✅ **Release cycles** - Independent versioning and updates  

### Security:
✅ **Reduced attack surface** - Consumer app has no retailer logic  
✅ **Separate authentication** - Token leaks limited to one domain  

---

## 🚨 Important Notes

1. **Shared Types**: Consider publishing shared types as a separate npm package if both projects need them.

2. **API Versioning**: When backend adds `/v2` endpoints, both projects need coordinated updates.

3. **Common Components**: Toast, modals, etc. - consider creating a shared component library.

4. **Testing**: Set up separate test suites for each project.

5. **CI/CD**: Configure separate build pipelines:
   - Consumer: `helo-med-consumer.yml`
   - Retailer: `helo-med-retailer.yml`

6. **Documentation**: Maintain separate README.md files for each project.

---

## 📞 Support

For questions about this extraction:
- Review this guide thoroughly
- Check the original codebase for reference
- Test all functionality after extraction
- Document any issues encountered

---

**Last Updated:** March 9, 2026  
**Version:** 1.0.0  
**Author:** Helo-Med Development Team
