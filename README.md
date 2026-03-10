# Helo-Med Retailer Dashboard

Retailer-facing application for managing products, orders, and payments on the Helo-Med platform.

## Features

- 🔐 Secure OTP-based authentication
- 📦 Product inventory management
- 📋 Order processing and tracking
- 💰 Payment history and settlements
- 👤 Profile and shop settings

## Setup

### Prerequisites
- Node.js 18+ and npm

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```
App will be available at http://localhost:5001

### Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Environment Variables

Create a `.env` file in the root:
```
VITE_API_BASE_URL=https://helo.thynxai.cloud
VITE_S3_BASE_URL=https://helomed.s3.ap-south-2.amazonaws.com
VITE_APP_NAME=Helo-Med Retailer
VITE_PORT=5001
```

## Project Structure

```
src/
├── api/              # API clients and services
├── components/       # Reusable UI components
├── context/          # React context providers
├── pages/            # Route pages
├── utils/            # Helper functions
├── types/            # TypeScript definitions
├── App.tsx           # Main app component
└── main.tsx          # Entry point
```

## Routes

- `/login` - Retailer login
- `/signup` - Retailer registration
- `/dashboard` - Stats overview
- `/all-products` - Master products catalog
- `/products` - Manage inventory
- `/orders` - Process orders
- `/payments` - View settlements
- `/profile` - Account settings

## Technologies

- React 19
- TypeScript
- Vite
- React Router
- Framer Motion
- Axios
- Lucide Icons

## License

Proprietary - UDI DIGI SWASTHYATECH Pvt. Ltd.
# helomed_retailer
