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
   This command installs all production dependencies (e.g., `@nestjs/core`, `@nestjs/jwt`, `pg`, `nodemailer`, `bcrypt`) and development dependencies (e.g., `@nestjs/cli`, `jest`, `eslint`, `prettier`). No additional `npm install` commands are needed, as `package.json` includes everything required.

3. **Set Up Environment Variables**:
   Create a `.env` file in the project root based on the `.env.example` (if provided) or use the following template:
   ```plaintext
   # Database configuration
   DATABASE_URL="postgresql://user:password@localhost:5432/database"

   # JWT configuration
   JWT_SECRET=your_jwt_secret_key

   # Email configuration (e.g., Gmail)
   GOOGLE_APP_PASSWORD=your google app password
   GOOGLE_APP_EMAIL=exampleemail@gmail.com

   # API port
   PORT=3000
   ```
   - Replace `user`, `password`, and `database` with your PostgreSQL credentials.
   - Generate a secure `JWT_SECRET` (e.g., a random string).
   - For `GOOGLE_APP_PASSWORD`, use a Gmail app password (create one in your Google Account settings).

4. **Set up the database schema**
   -  Download or copy the database ![Schema](https://raw.githubusercontent.com/XstremiscX/TechnovaBackend/refs/heads/main/database-schema.sql) and run it   into your database

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

Use a tool like Postman to test the API. Protected endpoints require a JWT in the `Authorization: <token>` header.

For full documentation ![Swagger UI Documentation](https://petstore.swagger.io/?url=https://raw.githubusercontent.com/XstremiscX/TechnovaBackend/refs/heads/main/user-management-api/docs/openapi.json).

## 📝 Notes

- **Database**: Ensure your PostgreSQL database is running and accessible. The `pg` driver is used, and the `database-schema.sql` file provides the table structure. If using an ORM, configure it in `src/main.ts` or a dedicated module.
- **Email**: For email verification, configure Nodemailer with a valid email service. Gmail requires an app password for security.
- **Security**: The `.gitignore` file excludes sensitive files like `.env`, `node_modules`, and `dist`. Do not commit sensitive data.
- **Dependencies**: All required packages are listed in `package.json`. Running `npm install` is sufficient to install everything for both development and production.

## 🛡️ License

[MIT License](LICENSE) - Feel free to use, modify, and distribute, but include attribution.

## 📬 Contact

Hire me on [Fiverr](https://www.fiverr.com/users/jose_gallego_ca) for NestJS backend development, API creation, or database setup. Check my GitHub for more projects or email me at [josecarva16@gmail.com].
