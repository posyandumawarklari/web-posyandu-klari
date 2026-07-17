# 🏥 Sistem Informasi Posyandu (Web Posyandu)

Sistem Informasi Posyandu adalah aplikasi web *full-stack* modern yang dirancang untuk membantu pengelolaan dan publikasi informasi kegiatan Pos Pelayanan Terpadu (Posyandu) secara digital. Aplikasi ini memfasilitasi kader dan pengurus posyandu dalam menyampaikan edukasi kesehatan, jadwal kegiatan, galeri dokumentasi, hingga profil lokasi pos-pos posyandu kepada masyarakat luas.

## 🚀 Fitur Utama

- **Sistem Autentikasi & Otorisasi:** Akses aman dengan JWT untuk peran `Admin` dan `Kader (Cadre)`.
- **Manajemen Artikel (CMS):** Penulisan artikel kesehatan dan berita dengan dukungan *Rich Text Editor*, pengaturan Kategori, Tag, Status (Draft/Published), serta SEO Meta.
- **Galeri Dokumentasi:** Unggah dan kelola foto kegiatan posyandu langsung terintegrasi dengan Cloudinary.
- **Jadwal Kegiatan:** Publikasi jadwal pelayanan, lokasi, dan detail aktivitas posyandu.
- **Profil Pos Posyandu:** Pemetaan lokasi posyandu (Koordinat Peta), nama ketua, kontak, dan daftar nama kader yang bertugas.
- **Program Unggulan:** Informasi mengenai layanan atau program prioritas posyandu.
- **Pengaturan Website:** Konfigurasi informasi kontak, sosial media, dan pengaturan umum *website* secara dinamis.
- **Desain Modern & Responsif:** Tampilan UI/UX modern dengan dukungan *Dark Mode* terintegrasi penuh.

## 💻 Tech Stack

### Frontend
- **Framework:** React 19 + Vite
- **Styling:** TailwindCSS 3 (dengan dukungan Dark Mode & `@tailwindcss/typography`)
- **Routing:** React Router v7
- **State Management:** TanStack Query (React Query)
- **Form Handling & Validation:** React Hook Form + Zod
- **Rich Text Editor:** React Quill
- **HTTP Client:** Axios
- **Icons:** Lucide React

### Backend
- **Framework:** Node.js + Express.js
- **Database ORM:** Prisma
- **Database:** PostgreSQL (Direkomendasikan menggunakan NeonDB)
- **Authentication:** JSON Web Tokens (JWT) & bcryptjs
- **Media Storage:** Cloudinary
- **Keamanan:** Helmet, Express Rate Limit, CORS

## 🛠️ Persiapan Instalasi

Pastikan Anda telah menginstal kebutuhan dasar berikut di komputer Anda:
- Node.js (v18 atau lebih baru)
- Akun PostgreSQL (misal: Neon, Supabase, atau lokal)
- Akun Cloudinary (untuk penyimpanan gambar)

### Setup Backend

1. Buka terminal dan masuk ke direktori `server`:
   ```bash
   cd server
   ```
2. Instal semua dependensi:
   ```bash
   npm install
   ```
3. Salin file `.env.example` menjadi `.env` dan sesuaikan kredensialnya:
   ```bash
   cp .env.example .env
   ```
   *(Isi `DATABASE_URL` dengan URL PostgreSQL Anda, serta `CLOUDINARY_*` dan `JWT_SECRET`)*.
4. Generate Prisma Client dan migrasi skema ke database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```
5. *(Opsional)* Masukkan data awal (Seeding) untuk admin default:
   ```bash
   npm run seed
   ```
6. Jalankan server lokal:
   ```bash
   npm run dev
   ```
   *Server backend akan berjalan di `http://localhost:5000`*.

### Setup Frontend

1. Buka terminal baru dan masuk ke direktori `client`:
   ```bash
   cd client
   ```
2. Instal dependensi:
   ```bash
   npm install --legacy-peer-deps
   ```
3. Salin file environment:
   ```bash
   cp .env.example .env
   ```
   *(Pastikan `VITE_API_URL` mengarah ke URL server backend Anda, misalnya `http://localhost:5000/api`)*.
4. Jalankan aplikasi web:
   ```bash
   npm run dev
   ```
   *Aplikasi akan berjalan di `http://localhost:5173`*.

## 📂 Struktur Proyek

```
web-posyandu/
├── client/                 # React frontend (Vite)
│   ├── src/
│   │   ├── components/     # Komponen UI reusable (Tombol, Input, Modal, dll)
│   │   ├── context/        # React Context (Auth, Theme)
│   │   ├── hooks/          # Custom Hooks (Data fetching dengan React Query)
│   │   ├── pages/          # Halaman utama aplikasi (Admin & Publik)
│   │   ├── services/       # Konfigurasi API (Axios)
│   │   └── utils/          # Fungsi utility & helper
│   └── ...
├── server/                 # Express.js backend
│   ├── prisma/             # Schema Database & Seeder
│   ├── src/
│   │   ├── controllers/    # Logika request & response
│   │   ├── middlewares/    # Middleware Autentikasi, Upload, dan Error Handling
│   │   ├── repositories/   # Interaksi langsung ke database (Prisma)
│   │   ├── routes/         # Endpoint API
│   │   ├── services/       # Business logic layer
│   │   └── utils/          # Fungsi pembantu (Bcrypt, JWT, Response)
│   └── ...
└── README.md
```

## 🔒 Manajemen Akses (Roles)

| Peran (Role) | Hak Akses |
|--------------|------------|
| **Admin** | Memiliki akses penuh terhadap seluruh fitur (Pengaturan web, kategori, pengguna, dll). |
| **Kader** | Akses terbatas: Mengelola artikel yang dibuat sendiri, *upload* galeri, dan profil diri. |

## 📄 Lisensi

Proyek ini berada di bawah lisensi **MIT**. Anda bebas untuk menggunakan, menyalin, dan memodifikasi proyek ini untuk kebutuhan program KKN maupun komersial.
