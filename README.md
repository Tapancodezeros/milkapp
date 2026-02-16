# MilkApp - Daily Milk Delivery System

MilkApp is a comprehensive v4.0 platform designed to streamline the connection between milk vendors and customers. It supports daily subscriptions, one-time purchases, wallet management, digital receipts, and delivery tracking.

## 🚀 Features

### For Customers
- **Dashboard**: Real-time overview of wallet balance, active subscriptions, and monthly spending charts.
- **Wallet**: Secure top-up system (up to ₹50,000) for seamless automated or manual payments.
- **Subscriptions**: Subscribe to daily deliveries (7 days, 1 month, or 3 months) with fixed rates.
- **Manual Payments**: Pay for pending subscription orders directly from the dashboard.
- **Subscription Management**: Flexible control to pause, resume, or cancel delivery connections.
- **One-time Purchase**: Buy milk directly from available vendors using wallet balance.
- **Delivery Verification**: Verify delivery status to unlock digital receipts and track order history.
- **Digital Receipts**: View, print, or export detailed receipts for all verified transactions.

### For Vendors
- **Inventory Management**: Update milk stock levels and set daily rates.
- **Subscription Processing**: Process daily subscription orders for all active customers with a single click.
- **Delivery Management**: Update delivery status (Delivered/Failed) for all daily orders.
- **Reports & Analytics**: Comprehensive monthly revenue and volume reports with visual data charts.
- **Transaction History**: Monitor sales and payments through a paginated ledger stream.

### For Administrators
- **Dashboard Overview**: Comprehensive view of system metrics (Total Customers, Vendors, Revenue, Active Subscriptions) with date-based filtering (All Time, This Month, Last Month, This Week).
- **User Management**: Full control to Create, Update, and Delete Customers and Vendors. Includes password reset functionality.
- **Transaction Oversight**: View recent transactions and filter full transaction history by status (Paid/Pending).
- **Subscription Monitoring**: Track and monitor all active subscriptions in the system.

## 🛠️ Tech Stack

### Frontend
- **React**: UI library.
- **Tailwind CSS**: Modern styling.
- **Lucide React**: Icon set.
- **Axios**: API communication.
- **Recharts**: Data visualization for reports.
- **React Hot Toast**: Toast notifications.

### Backend
- **Node.js & Express**: Server-side logic.
- **Sequelize (PostgreSQL)**: ORM for database management.
- **JWT & Bcryptjs**: Secure authentication and password hashing.
- **CORS**: Cross-origin resource sharing.

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
│   ├── src/               # React components, pages, and logic
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page-level components
│   │   └── api/           # API configuration and service calls
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
