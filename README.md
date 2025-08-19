# E-commerce Backend API

Welcome to the backend of an e-commerce platform built with **NestJS** and **PostgreSQL**. This REST API handles user management, product listings, and purchases, supporting two user roles: **sellers** and **buyers**. It’s designed to be secure, scalable, and easy to integrate with a frontend (e.g., Angular).

## ✨ Features

- **User Management**:
  - Register, login, update, or delete a user (self-only).
  - Two roles: **Seller** (publishes and manages products) and **Buyer** (purchases products).
  - Email verification for registration using Nodemailer.
  - Secure authentication with JWT (JSON Web Tokens).
- **Product Management (Sellers)**:
  - Create, list, update, block (hide temporarily), or delete (soft delete) products.
  - Soft delete ensures products remain in the database for invoice integrity.
- **Purchases (Buyers)**:
  - Buy products and generate invoices.
  - View purchase history and invoices.
- **Security**:
  - Password hashing with bcrypt.
  - Input sanitization with sanitize-html.
  - Data validation using class-validator.

## 🛠️ Tech Stack

- **Framework**: NestJS
- **Languages**: TypeScript, JavaScript
- **Database**: PostgreSQL (using `pg` driver)
- **Authentication**: JWT (`@nestjs/jwt`)
- **Email**: Nodemailer for verification emails
- **Validation**: class-validator, class-transformer
- **Other**: dotenv for environment variables, uuid for unique IDs, cors for cross-origin requests

## 📋 Prerequisites

To run this project, ensure you have:
- **Node.js**: Version 18 or higher (download from [nodejs.org](https://nodejs.org))
- **npm**: Included with Node.js
- **PostgreSQL**: Installed and running (version 13 or higher recommended)
- **Email Account**: A service like Gmail with an app password for Nodemailer
- **Git**: For cloning the repository

## 🚀 Installation

Follow these steps to set up and run the project locally:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/your-backend-repo.git
   cd your-backend-repo
   ```

2. **Install Dependencies**:
   Install all required packages listed in `package.json`:
   ```bash
   npm install
   ```
   This installs production dependencies (e.g., `@nestjs/core`, `@nestjs/jwt`, `pg`, `nodemailer`, `bcrypt`) and development dependencies (e.g., `@nestjs/cli`, `jest`, `eslint`, `prettier`). No additional `npm install` commands are needed, as `package.json` includes everything.

3. **Set Up Environment Variables**:
   Create a `.env` file in the project root based on the `.env.example` (if provided) or use the following template:
   ```plaintext
   # Database configuration
   DATABASE_URL=postgresql://user:password@localhost:5432/ecommerce_db?schema=public

   # JWT configuration
   JWT_SECRET=your_jwt_secret_key

   # Email configuration (e.g., Gmail)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password

   # API port
   PORT=3000
   ```
   - Replace `user`, `password`, and `ecommerce_db` with your PostgreSQL credentials.
   - Generate a secure `JWT_SECRET` (e.g., a random string).
   - For `EMAIL_PASS`, use a Gmail app password (create one in your Google Account settings).

4. **Configure PostgreSQL**:
   - Ensure PostgreSQL is running.
   - Create a database named `ecommerce_db`:
     ```bash
     psql -U your_postgres_user -c "CREATE DATABASE ecommerce_db;"
     ```
   - If using an ORM like TypeORM or Prisma, run migrations to set up tables:
     ```bash
     npm run migration:run
     ```
     *Note*: Adjust the migration command based on your ORM setup (e.g., `npm run typeorm:migration:run` for TypeORM). If migrations are not set up, enable schema synchronization in your ORM configuration (not recommended for production).
  
   - ![Download Database Schema(SQL)](https://raw.githubusercontent.com/XstremiscX/TechnovaBackend/main/database-schema.sql)
 
5. **Run the Application**:
   - **Development Mode** (with hot-reload):
     ```bash
     npm run start:dev
     ```
   - **Production Mode**:
     ```bash
     npm run build
     npm run start:prod
     ```
   The API will be available at `http://localhost:3000` (or the port specified in `.env`).

6. **Optional: Run Tests**:
   Run unit tests to verify functionality:
   ```bash
   npm run test
   ```
   For end-to-end tests:
   ```bash
   npm run test:e2e
   ```
   For test coverage:
   ```bash
   npm run test:cov
   ```

## 📚 API Endpoints

Use a tool like Postman to test the API. Protected endpoints require a JWT in the `Authorization: Bearer <token>` header.

- **Authentication**:
  - `POST /auth/register`: Register a seller or buyer (requires email verification).
  - `POST /auth/login`: Login and receive a JWT.
- **Users**:
  - `PATCH /users/:id`: Update user (self-only).
  - `DELETE /users/:id`: Delete user (self-only).
- **Products (Sellers)**:
  - `POST /products`: Create a product.
  - `GET /products`: List all visible products (or seller’s own products).
  - `PATCH /products/:id`: Update a product.
  - `PATCH /products/:id/block`: Block a product (hide from listings).
  - `DELETE /products/:id`: Soft delete a product.
- **Purchases (Buyers)**:
  - `POST /purchases`: Purchase a product and generate an invoice.
  - `GET /purchases/:id`: Retrieve an invoice.

For full documentation, enable Swagger (if configured) at `http://localhost:3000/api`.

## 📝 Notes

- **Database**: Ensure your PostgreSQL database is running and accessible. The `pg` driver is used, but you may need to configure your ORM (e.g., TypeORM or Prisma) in `src/main.ts` or a dedicated module.
- **Email**: For email verification, configure Nodemailer with a valid email service. Gmail requires an app password for security.
- **Security**: The `.gitignore` file excludes sensitive files like `.env`, `node_modules`, and `dist`. Do not commit sensitive data.
- **Dependencies**: All required packages are listed in `package.json`. Running `npm install` is sufficient to install everything.

## 🛡️ License

[MIT License](LICENSE) - Feel free to use, modify, and distribute, but include attribution.

## 📬 Contact

Hire me on [Fiverr](https://www.fiverr.com/your-profile) for NestJS backend development, API creation, or database setup. Check my GitHub for more projects or email me at [your.email@example.com].
