# Car Dealership Inventory System

A production-ready MERN stack application built following **Clean Architecture**, **Test-Driven Development (TDD)**, **JWT Authentication & Role-Based Access Control (RBAC)**, **Centralized Error Handling**, and **React (Vite) + Tailwind CSS**.

---

## 📁 Repository Structure

```
incubyte/
├── client/                 # React + Vite Frontend Application
│   ├── src/
│   │   ├── assets/         # Static images, icons, and graphic resources
│   │   ├── components/     # Reusable UI components (Cards, Modals, Filters, Buttons)
│   │   ├── contexts/       # React Context API state providers (AuthContext)
│   │   ├── hooks/          # Custom React hooks
│   │   ├── layouts/        # Application layouts (MainLayout with Navbar & Footer)
│   │   ├── pages/          # View pages (Home, VehicleDetails, Login, Register, AdminDashboard, Transactions)
│   │   ├── services/       # Axios API client services (auth.service, vehicle.service, transaction.service)
│   │   └── utils/          # Frontend helpers and formatting utilities
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── server/                 # Express + Node.js Backend Application
│   ├── config/             # Database connection & server configurations
│   ├── controllers/        # Request & Response handlers (HTTP layer)
│   ├── middlewares/        # Auth, RBAC, Validation & Error handling middlewares
│   ├── models/             # Mongoose database schemas
│   ├── routes/             # RESTful API route definitions
│   ├── services/           # Business logic layer
│   ├── validators/         # Input validation schemas (express-validator)
│   ├── utils/              # Helper utilities (ApiError, ApiResponse, JWT helpers)
│   ├── tests/              # Jest & Supertest integration test suites
│   ├── app.js              # Express app setup and middleware configuration
│   ├── server.js           # Server listener & Database connector
│   └── package.json
│
├── README.md               # Monorepo documentation & setup instructions
├── PROMPTS.md              # AI prompt log & transparency record
└── .gitignore
```

---

## 🛠️ Tech Stack & Requirements

### Backend (`/server`)
- **Runtime & Framework**: Node.js, Express.js (CommonJS)
- **Database**: MongoDB Atlas via Mongoose schema modeling
- **Authentication**: JWT (JSON Web Tokens) with HTTP-only cookies & Bearer headers, `bcrypt` password hashing
- **Security & Utilities**: `helmet`, `cors`, `morgan`, `cookie-parser`, `dotenv`
- **Validation**: `express-validator`
- **Testing**: Jest + Supertest (TDD workflow)

### Frontend (`/client`)
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM (v7)
- **HTTP Client**: Axios
- **Form Management**: React Hook Form
- **Notifications**: React Toastify
- **Icons**: Lucide React

---

## 📦 Installation & Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/kalprajapati/incubyte_assessment_project.git
cd incubyte
```

### 2. Backend Setup
```bash
cd server
npm install
```

Create a `.env` file inside `/server`:
```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
NODE_ENV=development
ADMIN_SECRET=your_admin_secret_key
```

To run the backend server:
```bash
# Development mode
npm run dev

# Run test suites
npm test
```

### 3. Frontend Setup
```bash
cd ../client
npm install
```

Create a `.env` file inside `/client`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

To run the frontend client:
```bash
npm run dev
```

---

## 🏛️ Architecture & Best Practices

- **Global Currency Standard**: Indian Rupee (INR - ₹) is enforced across all financial models, test suites, and UI components.
- **Clean Layered Architecture**: Routes → Middlewares → Controllers → Services → Models.
- **Centralized Error Handling**: Standardized JSON responses for both success and error states.
- **Role-Based Access Control**: Strict role enforcement (`Admin` vs `User`).
- **Test-Driven Development**: All backend features validated with Jest & Supertest integration tests prior to implementation.
