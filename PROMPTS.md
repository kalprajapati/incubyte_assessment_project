# AI Transparency Log & Prompts Record

This document records the prompt history and architectural decisions made during the development of the **Car Dealership Inventory System**.

---

## 📌 Architecture & Design Principles

1. **Clean Architecture**:
   - `Routes`: Map HTTP endpoints to controllers and attach validation/auth middlewares.
   - `Controllers`: Handle request/response contracts; zero business logic.
   - `Services`: Contain domain business logic and database interactions.
   - `Models`: Define database schemas, validation rules, and indexes.

2. **Test-Driven Development (TDD)**:
   - Failing tests written first with Jest & Supertest.
   - Minimum implementation to pass tests.
   - Clean refactoring with all tests green.

3. **Security & Data Integrity**:
   - JWT tokens with HTTP-only cookies and Bearer headers.
   - `bcrypt` password hashing pre-save hook.
   - Input validation via `express-validator`.
   - Security headers with `helmet` and restrictive CORS policy.

---

## 📝 Initial Setup Prompt

> "Create a production-ready MERN monorepo, check if already exists. Scalable folder structure for both frontend and backend without business logic yet."

- **Actions Taken**:
  - Validated existing `/client` and `/server` monorepo layout.
  - Initialized clean architecture folder structure for backend (`config`, `controllers`, `middlewares`, `models`, `routes`, `services`, `validators`, `utils`, `tests`).
  - Initialized component-based folder structure for frontend (`components`, `contexts`, `hooks`, `layouts`, `pages`, `services`, `utils`).
  - Added root documentation (`README.md`, `PROMPTS.md`).
