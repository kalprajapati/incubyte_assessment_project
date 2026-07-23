# 🚗 Car Dealership Inventory System

A production-ready, full-stack monorepo web application built with **React 19, Vite, Tailwind CSS v4, Express.js, and MongoDB**. Designed following **Clean Layered Architecture**, **Role-Based Access Control (RBAC)**, **Test-Driven Development (TDD)**, and **Modern Web Guidelines**.

---

## 📑 Table of Contents

- [Project Overview](#-project-overview)
- [Architecture](#-architecture)
- [Folder Structure](#-folder-structure)
- [Installation & Setup](#-installation--setup)
- [Environment Variables](#-environment-variables)
- [Running the Backend](#-running-the-backend)
- [Running the Frontend](#-running-the-frontend)
- [API Endpoints](#-api-endpoints)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Screenshots](#-screenshots)
- [AI Usage & Transparency](#-ai-usage--transparency)
- [Future Improvements](#-future-improvements)
- [License](#-license)

---

## 🎯 Project Overview

The **Car Dealership Inventory System** provides an end-to-end platform for browsing, searching, and managing automotive vehicle inventory:

- **Public & User Features**: Responsive vehicle search with filters (Make, Model, Category, Price Range), real-time stock status, and account registration/authentication.
- **Admin Features**: Full CRUD management (Create, Read, Update, Delete), stock restocking with modal dialogs, and real-time inventory statistics.
- **Security & UX**: JWT-based auth with token persistence & auto-refresh verification, automatic `401 Unauthorized` redirect handling, accessible modal dialogs, loading skeletons, and toast notifications.

---

## 🏛️ Architecture

The monorepo follows a strict **Clean Layered Architecture**:

```
[ Client Layer (React 19 + Vite + TailwindCSS v4) ]
       │
       ▼  HTTP / REST (Axios + JWT Interceptors)
[ API / Routing Layer (Express Router + express-validator) ]
       │
       ▼
[ Controller Layer (HTTP Request/Response Normalization) ]
       │
       ▼
[ Service / Business Logic Layer (Domain Logic, Transactions) ]
       │
       ▼
[ Data Access Layer (Mongoose Schemas + MongoDB Atlas) ]
```

### Key Architectural Patterns
1. **Controller-Service Pattern**: Business logic is fully decoupled from Express HTTP handlers into reusable service modules.
2. **Centralized Error & Response Standard**: Custom `ApiError` and `ApiResponse` utilities ensure uniform JSON payloads across all REST endpoints.
3. **Reactive Auth State & Persistence**: `AuthContext` validates persisted JWT tokens via `/api/auth/me` upon page refresh while maintaining `state.from` for seamless post-login redirects.
4. **Resilient HTTP Client**: Axios interceptors automatically attach `Bearer` headers to outgoing requests and intercept `401` errors to clear local storage and redirect to login.

---

## 📁 Folder Structure

```
incubyte/
├── client/                     # React 19 + Vite Frontend Application
│   ├── src/
│   │   ├── components/         # Reusable UI components (Modal, ConfirmDialog, RestockModal, VehicleCard, ProtectedRoute)
│   │   ├── contexts/           # Global State Providers (AuthContext)
│   │   ├── hooks/              # Custom Hooks (useAuth, useVehicleSearch)
│   │   ├── pages/              # View Pages (LoginPage, RegisterPage, DashboardPage, SearchPage, AdminPage)
│   │   ├── services/           # Axios API services (api.js, auth.service.js, vehicle.service.js)
│   │   ├── utils/              # App constants, design tokens & formatters
│   │   ├── App.jsx             # React Router v7 routes setup
│   │   ├── main.jsx            # React root entry point
│   │   └── index.css           # TailwindCSS v4 setup & custom tokens
│   ├── vite.config.js          # Vite config with API proxy
│   └── package.json
│
├── server/                     # Node.js + Express.js Backend Application
│   ├── config/                 # Database connection & configurations
│   ├── controllers/            # Request handlers (auth, vehicle)
│   ├── middlewares/            # Auth, RBAC, Validation & Error middlewares
│   ├── models/                 # Mongoose schemas (User, Vehicle)
│   ├── routes/                 # RESTful route definitions
│   ├── services/               # Core business logic services
│   ├── validators/             # Express-validator schema rules
│   ├── utils/                  # ApiError, ApiResponse & JWT utilities
│   ├── tests/                  # Jest & Supertest API integration test suites
│   ├── app.js                  # Express middleware setup
│   ├── server.js               # Entry point & DB listener
│   └── package.json
│
├── README.md                   # Monorepo documentation
├── PROMPTS.md                  # AI prompt log & development record
└── .gitignore
```

---

## 📦 Installation & Setup

### Prerequisites
- **Node.js**: v18.x or higher
- **npm**: v9.x or higher
- **MongoDB Atlas**: Database cluster URL

### 1. Clone Repository
```bash
git clone https://github.com/kalprajapati/incubyte_assessment_project.git
cd incubyte
```

### 2. Backend Dependencies
```bash
cd server
npm install
```

### 3. Frontend Dependencies
```bash
cd ../client
npm install
```

---

## 🔑 Environment Variables

### Backend (`server/.env`)
Create a `.env` file inside the `server/` directory:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/dealership?retryWrites=true&w=majority
DB_MAX_RETRIES=5
DB_RETRY_INTERVAL_MS=3000
JWT_SECRET=super_secret_jwt_key_incubyte_2026
JWT_EXPIRES_IN=7d
NODE_ENV=development
ADMIN_SECRET=admin_secret_key_123
```

### Frontend (`client/.env`)
Create a `.env` file inside the `client/` directory:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 🚀 Running the Backend

```bash
cd server

# Development mode (Nodemon)
npm run dev

# Production mode
npm start
```
The server runs at **`http://localhost:5000`**.

---

## 💻 Running the Frontend

```bash
cd client

# Development dev server
npm run dev

# Production build preview
npm run build
npm run preview
```
The client app runs at **`http://localhost:5173`**.

---

## 🔌 API Endpoints

### 🔐 Auth Routes (`/api/auth`)
| Method | Endpoint | Access | Description |
| text | text | text | text |
| `POST` | `/api/auth/register` | Public | Register a user or admin (`adminSecret` required for Admin) |
| `POST` | `/api/auth/login` | Public | Authenticate user & return JWT token |
| `POST` | `/api/auth/logout` | Authenticated | Logout user and clear session cookies |
| `GET` | `/api/auth/me` | Authenticated | Fetch current user profile |
| `GET` | `/api/auth/admin-test` | Admin | Route guard test endpoint for Admin role |

### 🚗 Vehicle Routes (`/api/vehicles`)
| Method | Endpoint | Access | Description |
| text | text | text | text |
| `GET` | `/api/vehicles` | Public | Fetch all vehicles |
| `GET` | `/api/vehicles/search` | Public | Search with query params (`make`, `model`, `category`, `minPrice`, `maxPrice`, `page`, `limit`) |
| `GET` | `/api/vehicles/:id` | Public | Get single vehicle details by ID |
| `POST` | `/api/vehicles` | Admin | Create a new vehicle |
| `PUT` | `/api/vehicles/:id` | Admin | Update vehicle details |
| `DELETE` | `/api/vehicles/:id` | Admin | Delete vehicle from inventory |
| `POST` | `/api/vehicles/:id/purchase` | Authenticated | Purchase 1 unit of a vehicle |
| `POST` | `/api/vehicles/:id/restock` | Admin | Add restock units to inventory |

---

## 🧪 Testing

Integration tests for API routes are written with **Jest** and **Supertest**.

```bash
cd server

# Run all test suites
npm test

# Run tests in watch mode
npm run test:watch
```

---

## 🌐 Deployment

### Backend (Render / Railway / Heroku)
1. Set Environment Variables (`MONGODB_URI`, `JWT_SECRET`, `NODE_ENV=production`, `ADMIN_SECRET`).
2. Build command: `npm install`
3. Start command: `node server.js`

### Frontend (Vercel / Netlify)
1. Root directory: `client`
2. Build command: `npm run build`
3. Output directory: `dist`
4. Set Environment Variable: `VITE_API_BASE_URL=https://your-backend-api.com/api`

---

## 🖼️ Screenshots

| Page | Preview |
|---|---|
| **Login Page** | *![Login Page Mockup](https://via.placeholder.com/800x450/0f172a/6366f1?text=Login+Page+Mockup)* |
| **Registration Page** | *![Register Page Mockup](https://via.placeholder.com/800x450/0f172a/6366f1?text=Register+Page+Mockup)* |
| **Search Page** | *![Search Page Mockup](https://via.placeholder.com/800x450/0f172a/6366f1?text=Vehicle+Search+Mockup)* |
| **Admin Dashboard** | *![Admin Dashboard Mockup](https://via.placeholder.com/800x450/0f172a/6366f1?text=Admin+Dashboard+Mockup)* |

---

## 🤖 AI Usage & Transparency

In compliance with AI-assisted software development evaluation criteria:
- **Pair Programming**: Built using AI assistance (Antigravity AI) for initial scaffold generation, UI design token alignment, unit test generation, and documentation.
- **Prompt Log**: Detailed prompts, design decisions, and architectural iterations are documented in [`PROMPTS.md`](./PROMPTS.md).
- **Code Review**: Every generated module was inspected, verified with automated Vite build checks (`npm run build`), and validated against backend API contracts.

---

## 🚀 Future Improvements

- [ ] **Transaction History**: User purchase history and invoice downloading.
- [ ] **Image Upload**: Cloudinary integration for uploading multi-angle vehicle photos.
- [ ] **Analytics Charts**: Visual inventory distribution graphs (Recharts / Chart.js) in the Admin Dashboard.
- [ ] **Dark / Light Theme Toggle**: Dynamic theme switcher using CSS custom properties.

---

## 📜 License

Distributed under the **MIT License**. See `LICENSE` for more information.
