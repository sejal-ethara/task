# ProjectManager Web App

A complete, production-ready full-stack Project Management Web Application built with Next.js 14, Prisma, PostgreSQL, and Tailwind CSS. 

## Features

- **Role-Based Access Control**: Admin and Member roles with specific permissions.
- **Project Management**: Create, update, and track project deadlines and overall progress.
- **Task Board**: Add tasks to projects, assign them to members, and update their statuses and priorities.
- **Real-time Analytics**: Visual overview of tasks and project stats using Recharts.
- **Secure Authentication**: Custom JWT authentication implementation with HttpOnly cookies.
- **Responsive UI**: Fully responsive sidebar, navigation, and data cards tailored for mobile, tablet, and desktop using shadcn/ui.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, Tailwind CSS, shadcn/ui, Recharts, React Hook Form, Zod.
- **Backend**: Next.js API Routes, Next.js Middleware (Edge).
- **Database**: PostgreSQL, Prisma ORM.
- **Security**: bcryptjs, jose (Edge-compatible JWT).

## Local Installation

1. **Clone the repository** (or download the source).
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Configure Environment Variables**:
   Copy `.env.example` to `.env` and update the values:
   ```bash
   cp .env.example .env
   ```
   *Make sure you have a local PostgreSQL instance running and update the `DATABASE_URL`.*
4. **Run Prisma Migrations**:
   ```bash
   npx prisma migrate dev --name init
   ```
   *(This applies the schema to your database and automatically runs `prisma generate` to build the client)*
5. **Start the Development Server**:
   ```bash
   npm run dev
   ```
6. **Open your browser** to [http://localhost:3000](http://localhost:3000).

## API Endpoints

- **Auth**: `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`, `POST /api/auth/logout`
- **Projects**: `GET /api/projects`, `POST /api/projects`, `GET /api/projects/:id`, `PUT /api/projects/:id`, `DELETE /api/projects/:id`
- **Tasks**: `GET /api/tasks`, `POST /api/tasks`, `PUT /api/tasks/:id`, `DELETE /api/tasks/:id`

## Railway Deployment Guide

This app is optimized for Railway deployment with `output: "standalone"` enabled.

1. **Create a Railway Account** and connect your GitHub repository.
2. **Add a PostgreSQL Plugin** to your Railway project.
3. **Set Environment Variables**:
   - `DATABASE_URL` (Use the Railway Postgres connection string)
   - `JWT_SECRET` (Generate a strong random string)
   - `NEXT_PUBLIC_API_URL` (Set to your production domain, e.g., `https://your-app.up.railway.app/api`)
4. **Deploy**: Railway will automatically detect Next.js.
5. **Database Migration**: To apply the schema in production, run the following in your Railway service's build/deploy settings, or manually run:
   ```bash
   npx prisma migrate deploy
   ```

*Note: The `package.json` has an automatic `postinstall` script (`prisma generate`) so the Prisma client builds correctly on Railway.*
