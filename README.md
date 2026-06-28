# 🏥 Posyandu Information System

A modern full-stack web application for managing Posyandu (Pos Pelayanan Terpadu) community health posts.

## Tech Stack

### Frontend
- React 18 + Vite
- TailwindCSS 3
- React Router DOM 6
- TanStack Query
- React Hook Form + Zod
- Axios
- Lucide React

### Backend
- Node.js + Express.js
- Prisma ORM
- PostgreSQL (NeonDB)
- JWT Authentication
- Cloudinary (Image Upload)

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database (NeonDB recommended)
- Cloudinary account

### Backend Setup

```bash
cd server
npm install
cp .env.example .env
# Edit .env with your database and Cloudinary credentials
npx prisma generate
npx prisma db push
npm run seed
npm run dev
```

### Frontend Setup

```bash
cd client
npm install
cp .env.example .env
# Edit .env with your API URL
npm run dev
```

## Project Structure

```
web-posyandu/
├── client/          # React frontend (Vite)
├── server/          # Express.js backend
├── .gitignore
└── README.md
```

## Environment Variables

See `.env.example` files in both `client/` and `server/` directories.

## Roles

| Role | Permissions |
|------|------------|
| Admin | Full access to all features |
| Cadre | Manage own articles, upload gallery, edit profile |

## License

MIT
