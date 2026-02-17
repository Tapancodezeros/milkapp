# MilkApp - Daily Milk Delivery System

MilkApp is a comprehensive v4.0 platform designed to streamline the connection between milk vendors and customers. It supports daily subscriptions, one-time purchases, wallet management, digital receipts, and delivery tracking.

## 🚀 Features

### ✨ UX/UI Design
- **Premium Aesthetics**: Glassmorphism effects, smooth transitions, and a modern color palette.
- **Dark/Light Mode**: Fully responsive theme switching with persistent state.
- **Interactive Elements**: Custom animated toast notifications, micro-interactions, and loading states.
- **Responsive Layouts**: Optimized for seamless experience across all devices.

### 👤 For Customers
- **Smart Dashboard**: Real-time overview of wallet balance, active subscriptions, and monthly spending charts.
- **Wallet & Transactions**: Secure top-up system (up to ₹50,000) with detailed transaction history and **CSV Export** functionality.
- **Flexible Subscriptions**: Subscribe to daily deliveries (7 days, 1 month, or 3 months) with pause/resume capabilities.
- **Digital Receipts**: Instant verified receipts for every delivery with options to **Print** or **Download**.
- **Delivery Verification**: Interactive system to verify or report delivery issues.

### 🏪 For Vendors
- **Business Operations**: Real-time inventory management and rate setting.
- **Sales Intelligence**: Detailed analytics charts for monthly revenue and volume trends.
- **Ledger Management**: comprehensive sales history with **CSV Export** for offline accounting.
- **Order Fulfillment**: Bulk processing for daily subscriptions and individual one-time orders.
- **Availability Control**: Toggle "Holiday Mode" to pause new orders when unavailable.

### 🛡️ For Administrators
- **Advanced User Management**: capable table views with **Sorting**, **Pagination**, and **Search** for Customers and Vendors.
- **Secure Controls**: Custom confirmation modals for critical actions (Delete/Edit) to prevent accidental data loss.
- **Activity Monitoring**: Track system-wide metrics, active subscriptions, and transaction flows.
- **Edit Capabilities**: Seamless inline editing for user details with change tracking and validation.

## 🛠️ Tech Stack

### Frontend
- **React**: Core UI library.
- **Tailwind CSS**: Utility-first styling with custom animations.
- **Lucide React**: Modern, consistent icon set.
- **Recharts**: Interactive data visualization.
- **React Hot Toast**: Beautiful, stackable toast notifications.
- **Axios**: Optimized HTTP client with interceptors.

### Backend
- **Node.js & Express**: Server-side logic.
- **Sequelize (PostgreSQL)**: ORM for database management.
- **JWT & Bcryptjs**: Secure authentication and password hashing.
- **CORS**: Cross-origin resource sharing.
- **Swagger UI**: API documentation and testing interface.

## 📦 Project Structure

```text
milkapp/
├── backend/                # Node.js Express server
│   ├── config/            # Database and app configuration
│   ├── models/            # Sequelize ORM models
│   ├── routes/            # API route handlers
│   ├── middleware/        # Custom Express middlewares
│   ├── validations/       # Request validation logic
│   ├── migrations/        # Sequelize database migrations
│   ├── index.js           # Main server entry point
│   └── .env               # Backend environment variables
├── frontend/               # React application
│   ├── src/               # React application source
│   │   ├── components/    # UI Components
│   │   │   ├── shared/    # Reusable components (Header, Modal, etc.)
│   │   │   ├── customer/  # Customer-specific components
│   │   │   ├── vendor/    # Vendor-specific components
│   │   │   └── admin/     # Admin-specific components
│   │   ├── pages/         # Page-level components (Dashboards)
│   │   ├── context/       # Global state (ThemeContext, AuthContext)
│   │   ├── api/           # API configuration
│   │   └── App.js         # Main App Component
│   ├── public/            # Static assets
│   └── .env               # Frontend configuration
└── README.md               # Project documentation
```

## ⚙️ Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL

### 1. Database Setup
Create a PostgreSQL database named `yourdbname`.

### 2. Backend Configuration
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file (refer to `.env.example` in the root):
   ```env
   PORT=5000
   SECRET_KEY=your_secret_key
   DB_USERNAME=postgres
   DB_PASSWORD=your_password
   DB_NAME=yourdbname
   DB_HOST=127.0.0.1
   DB_PORT=5432
   DB_DIALECT=postgres
   ```
4. Start the server:
   ```bash
   npm run dev
   ```
5. Access API Documentation:
   http://localhost:5000/api-docs

### 3. Frontend Configuration
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```
4. Start the frontend:
   ```bash
   npm start
   ```

## 🔐 Environment Variables

### Backend (`/backend/.env`)
| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Port the server runs on | 5000 |
| SECRET_KEY | JWT signing key | `supersecretkey` |
| DB_NAME | PostgreSQL database name | `milk_app` |
| DB_USERNAME | PostgreSQL username | `postgres` |
| DB_PASSWORD | PostgreSQL password | `postgres` |
| DB_HOST | PostgreSQL host | `localhost` |
| DB_PORT | PostgreSQL port | `5433` |
| DB_DIALECT | Database dialect | `postgres` |

### Frontend (`/frontend/.env`)
| Variable | Description | Default |
|----------|-------------|---------|
| REACT_APP_API_URL | Backend API base URL | `http://localhost:5000/api` |
