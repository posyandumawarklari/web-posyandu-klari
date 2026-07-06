import { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Heart, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const loginSchema = z.object({
  email: z.string().email('Format email tidak valid').min(1, 'Email wajib diisi'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const from = location.state?.from?.pathname || '/admin';

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({ resolver: zodResolver(loginSchema) });

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const userData = await login(data.email, data.password);
      
      // Determine redirection based on role, unless 'from' is already set to a valid deep link
      if (location.state?.from) {
        // Prevent CADRE from being sent to ADMIN routes directly from login
        if (userData.role === 'CADRE' && from.startsWith('/admin')) {
          navigate('/dashboard', { replace: true });
        } else if (userData.role === 'ADMIN' && from === '/dashboard') {
          // Prevent ADMIN from being sent to CADRE root dashboard directly from login
          navigate('/admin/dashboard', { replace: true });
        } else {
          navigate(from, { replace: true });
        }
      } else {
        if (userData.role === 'ADMIN') {
          navigate('/admin/dashboard', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Email atau password salah.';
      setError('root', { type: 'manual', message: msg });
      toast.error(msg); // Add toast for foolproof visibility
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-[420px]">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-800 rounded-3xl shadow-soft-xl mb-6 relative overflow-hidden group">
            <div className="absolute inset-0 bg-primary-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <Heart className="w-10 h-10 text-white relative z-10" />
          </div>
          <h1 className="text-3xl font-heading font-extrabold text-content dark:text-white tracking-tight">Masuk ke Dashboard</h1>
          <p className="text-base text-content-muted dark:text-gray-400 mt-2 font-medium">Sistem Informasi Posyandu</p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-soft-xl border border-surface-200 dark:border-gray-700 p-8 sm:p-12 relative overflow-hidden">
          {/* Decorative subtle element */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 dark:bg-primary-900/10 rounded-bl-[4rem] -z-0"></div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10">
            {/* Error message */}
            {errors.root && (
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <p className="text-sm font-medium text-red-600 dark:text-red-400">{errors.root.message}</p>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-bold text-content dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                {...register('email')}
                className={`w-full px-5 py-3.5 rounded-xl border bg-surface-50 dark:bg-gray-900 text-content dark:text-white placeholder-content-muted/50 focus:outline-none focus:ring-2 transition-all font-medium ${
                  errors.email
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50/50 dark:bg-red-900/10'
                    : 'border-surface-200 dark:border-gray-700 focus:ring-primary-500 focus:border-primary-500 hover:border-primary-300'
                }`}
                placeholder="admin@posyandu.id"
              />
              {errors.email && (
                <p className="mt-2 text-xs font-semibold text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-bold text-content dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  className={`w-full px-5 py-3.5 pr-12 rounded-xl border bg-surface-50 dark:bg-gray-900 text-content dark:text-white placeholder-content-muted/50 focus:outline-none focus:ring-2 transition-all font-medium ${
                    errors.password
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50/50 dark:bg-red-900/10'
                      : 'border-surface-200 dark:border-gray-700 focus:ring-primary-500 focus:border-primary-500 hover:border-primary-300'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-content-muted hover:text-primary-800 dark:hover:text-primary-400 transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-xs font-semibold text-red-500">{errors.password.message}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 px-5 py-4 mt-8 bg-primary-800 hover:bg-primary-900 text-white font-bold rounded-xl transition-all shadow-sm hover:shadow-soft-xl disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Memproses...
                </>
              ) : (
                'Masuk Sekarang'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-sm font-medium text-content-muted dark:text-gray-500 mt-10">
          &copy; {new Date().getFullYear()} Sistem Informasi Posyandu
        </p>
      </div>
    </div>
  );
}
