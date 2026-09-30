# Personal Expense & Budget Tracker

A simple, clean, functional, and beginner-friendly **Personal Expense & Budget Tracker** built with the **MERN stack** (MongoDB, Express.js, React.js, Node.js). Designed as a 15-day internship project to showcase core web development skills, REST APIs, CRUD operations, budget tracking, and simple data visualization.

---

## 📌 Project Overview

This single-user web application helps users manage their personal finances by tracking monthly income, expenses, and budget usage in real-time.

### Key Features
* 💰 **Monthly Budget Management**: Set and update your monthly budget limit.
* ➕ **Add Transactions**: Easily record income and expense entries with title, amount, category, date, and type.
* 📋 **View Transactions**: Browse all transactions in a clean, responsive table layout.
* ✏️ **Edit & Delete**: Full CRUD capabilities with instant dashboard updates and confirmation modal dialogs.
* 🔍 **Search & Filter**: Search transactions by title, or filter by Type (Income/Expense), Category (Food, Transport, Shopping, Bills, etc.), and Date ranges.
* 📊 **Dashboard Summaries & Cards**: Real-time calculation of Total Income, Total Expenses, Remaining Budget, and Savings.
* 📈 **Interactive Charts (Recharts)**:
  * **Expenses by Category**: Donut Chart visualizing expense distribution.
  * **Income vs Expense**: Bar Chart comparing total earnings vs total spending.
* ⏳ **Budget Progress Tracker**: Visual progress bar showing used budget percentage with "Budget Exceeded" alert when spending surpasses budget limits.
* 📱 **Responsive UI**: Clean design optimized for desktop, tablet, and mobile browsers.

---

## 🛠️ Technology Stack

### Frontend
* **React.js** (Vite builder)
* **JavaScript** (ES6+)
* **React Router DOM v6**
* **Axios**
* **Recharts** (Data Visualization)
* **Lucide React** (Modern Icons)
* **Vanilla CSS** (Custom responsive design system)

### Backend
* **Node.js**
* **Express.js**
* **MongoDB / MongoDB Atlas**
* **Mongoose**
* **dotenv** & **cors**

---

## 📂 Project Structure

```text
expense-budget-tracker/
│
├── client/                     # React Frontend
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── SummaryCard.jsx
│   │   │   ├── BudgetProgress.jsx
│   │   │   ├── ChartCard.jsx
│   │   │   ├── TransactionFormModal.jsx
│   │   │   ├── BudgetModal.jsx
│   │   │   ├── ConfirmDialog.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── Toast.jsx
│   │   │   └── TransactionFilter.jsx
│   │   ├── pages/              # Main Page Views
│   │   │   ├── Dashboard.jsx
│   │   │   └── TransactionsPage.jsx
│   │   ├── services/           # Axios API services
│   │   │   └── api.js
│   │   ├── utils/              # Formatting helpers (Currency, Date)
│   │   │   └── formatters.js
│   │   ├── App.jsx             # Main Application Container & Routes
│   │   ├── main.jsx            # React Entry Point
│   │   └── index.css           # Global Stylesheet
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Node.js & Express Backend
│   ├── config/
│   │   └── db.js               # MongoDB Mongoose Connection
│   ├── controllers/
│   │   ├── transactionController.js
│   │   └── budgetController.js
│   ├── models/
│   │   ├── Transaction.js      # Mongoose Transaction Schema
│   │   └── Budget.js           # Mongoose Budget Schema
│   ├── routes/
│   │   ├── transactionRoutes.js
│   │   └── budgetRoutes.js
│   ├── middleware/
│   │   └── errorMiddleware.js  # Global & 404 Error Handlers
│   ├── seed.js                 # Sample Seed Data Script
│   ├── server.js               # Express Server Entry Point
│   ├── package.json
│   └── .env.example
│
├── README.md
└── .gitignore
```

---

## ⚙️ Installation & Setup

### 1. Clone the repository
```bash
git clone <repository-url>
cd expense-budget-tracker
```

### 2. Set up Backend (Server)
```bash
cd server
npm install
```

Create a `.env` file inside the `server/` directory (refer to `.env.example`):
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/expense_tracker
```

*(Optional) Seed the database with sample transactions:*
```bash
npm run seed
```

### 3. Set up Frontend (Client)
```bash
cd ../client
npm install
```

Create a `.env` file inside the `client/` directory (refer to `.env.example`):
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🚀 Running the Application

### Start Backend Server
From `server/` directory:
```bash
# Development mode with Nodemon
npm run dev

# Production mode
npm start
```
*Server will start at `http://localhost:5000`*

### Start Frontend Application
From `client/` directory:
```bash
npm run dev
```
*Frontend will launch at `http://localhost:5173`*

---

## 🔗 REST API Endpoints

### Health Check
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Check API server status |

### Transactions API
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/transactions` | Get all transactions (Supports query filters: `search`, `type`, `category`, `startDate`, `endDate`) |
| `GET` | `/api/transactions/:id` | Get single transaction details |
| `POST` | `/api/transactions` | Create a new transaction |
| `PUT` | `/api/transactions/:id` | Update an existing transaction |
| `DELETE` | `/api/transactions/:id` | Delete a transaction |

#### Sample Transaction Request Body (`POST /api/transactions`)
```json
{
  "title": "Lunch",
  "amount": 250,
  "category": "Food",
  "date": "2026-09-29",
  "type": "Expense"
}
```

### Budget API
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/budget` | Get current monthly budget |
| `PUT` | `/api/budget` | Set or update monthly budget |

#### Sample Budget Request Body (`PUT /api/budget`)
```json
{
  "amount": 30000,
  "month": "2026-09"
}
```

---

## 📸 Screenshots

*(Add screenshots of Dashboard and Transactions page here)*

---

## 🔮 Future Improvements

While kept simple for internship scope, potential enhancements include:
* 🔐 User Authentication (JWT / Multi-user support)
* 📄 Export reports to PDF / CSV format
* 🔄 Recurring income and expense support
* 🔔 E-mail/SMS budget threshold alerts
