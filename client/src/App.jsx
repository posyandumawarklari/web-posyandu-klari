import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { Loader2 } from 'lucide-react';
import ProtectedRoute from './components/ProtectedRoute';

// ─── Lazy-loaded Layouts ───────────────────────────
const PublicLayout = lazy(() => import('./layouts/PublicLayout'));
const AdminLayout = lazy(() => import('./layouts/AdminLayout'));

// ─── Lazy-loaded Public Pages ──────────────────────
const HomePage = lazy(() => import('./pages/public/HomePage'));
const ArticlesPage = lazy(() => import('./pages/public/ArticlesPage'));
const ArticleDetailPage = lazy(() => import('./pages/public/ArticleDetailPage'));
const ProgramsPage = lazy(() => import('./pages/public/ProgramsPage'));
const GalleryPage = lazy(() => import('./pages/public/GalleryPage'));
const SchedulePage = lazy(() => import('./pages/public/SchedulePage'));
const ContactPage = lazy(() => import('./pages/public/ContactPage'));

// ─── Lazy-loaded Auth Pages ────────────────────────
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));

// ─── Lazy-loaded Admin Pages ───────────────────────
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminArticles = lazy(() => import('./pages/admin/ArticlesPage'));
const AdminArticleForm = lazy(() => import('./pages/admin/ArticleFormPage'));
const AdminCategories = lazy(() => import('./pages/admin/CategoriesPage'));
const AdminTags = lazy(() => import('./pages/admin/TagsPage'));
const AdminPrograms = lazy(() => import('./pages/admin/ProgramsPage'));
const AdminGallery = lazy(() => import('./pages/admin/GalleryPage'));
const AdminSchedules = lazy(() => import('./pages/admin/SchedulesPage'));
const AdminUsers = lazy(() => import('./pages/admin/UsersPage'));
const AdminSettings = lazy(() => import('./pages/admin/SettingsPage'));
const AdminProfile = lazy(() => import('./pages/admin/ProfilePage'));

// ─── Loading Fallback ──────────────────────────────
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
        <p className="text-sm text-slate-500 dark:text-slate-400">Memuat halaman...</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* ── Public Routes ────────────────────── */}
        <Route element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="artikel" element={<ArticlesPage />} />
          <Route path="artikel/:slug" element={<ArticleDetailPage />} />
          <Route path="program" element={<ProgramsPage />} />
          <Route path="galeri" element={<GalleryPage />} />
          <Route path="jadwal" element={<SchedulePage />} />
          <Route path="kontak" element={<ContactPage />} />
        </Route>

        {/* ── Auth Route ───────────────────────── */}
        <Route path="login" element={<LoginPage />} />

        {/* ── Admin Routes ─────────────────────── */}
        <Route
          path="admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="artikel" element={<AdminArticles />} />
          <Route path="artikel/baru" element={<AdminArticleForm />} />
          <Route path="artikel/:id/edit" element={<AdminArticleForm />} />
          <Route path="kategori" element={<AdminCategories />} />
          <Route path="tag" element={<AdminTags />} />
          <Route path="program" element={<AdminPrograms />} />
          <Route path="galeri" element={<AdminGallery />} />
          <Route path="jadwal" element={<AdminSchedules />} />
          <Route
            path="pengguna"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="pengaturan"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminSettings />
              </ProtectedRoute>
            }
          />
          <Route path="profil" element={<AdminProfile />} />
        </Route>

        {/* ── Catch-all ────────────────────────── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
