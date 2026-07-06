import { Link, useLocation } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { Menu, X, User, LogOut, Activity, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useSettings } from '../../hooks/usePublicData';

const navLinks = [
  { to: '/', label: 'Beranda' },
  { to: '/tentang-kami', label: 'Tentang Kami' },
  { to: '/artikel', label: 'Artikel' },
  { to: '/program', label: 'Program' },
  { to: '/galeri', label: 'Galeri' },
  { to: '/jadwal', label: 'Jadwal' },
  { to: '/kontak', label: 'Kontak' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const dropdownRef = useRef(null);

  const { data: settings } = useSettings();
  const siteName = settings?.site_name || 'Posyandu';

  const logoSrc = darkMode ? '/logo.png' : '/logo.png';

  // Deteksi klik di luar area dropdown untuk menutup menu
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Deteksi gulir layar untuk mengaktifkan efek glassmorphism yang lebih pekat
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
  };
  
  const isActive = (path) => pathname === path;
  const basePath = user?.role === 'ADMIN' ? '/admin' : '/dashboard';
  const dashboardRoute = user?.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard';

  return (
    <div className="fixed top-0 left-0 w-full z-50 px-4 sm:px-6 lg:px-8 pt-4 pointer-events-none flex justify-center">
      {/* Floating Glassmorphism Navbar */}
      <nav 
        className={`pointer-events-auto transition-all duration-300 rounded-full border 
          ${scrolled 
            ? 'w-full xl:w-[95%] max-w-7xl bg-white/70 dark:bg-gray-900/70 shadow-lg border-white/40 dark:border-gray-700/50 backdrop-blur-md' 
            : 'w-full xl:w-[98%] max-w-7xl bg-white/40 dark:bg-gray-900/40 shadow-sm border-white/20 dark:border-gray-800/30 backdrop-blur-sm'
          }`}
      >
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* ── Logo ── */}
            <Link to="/" className="flex items-center gap-3 group shrink-0">
              <img
                src={logoSrc}
                alt="Logo Posyandu"
                className="h-10 w-auto group-hover:scale-105 transition-transform rounded-full" 
              />
              <span className="font-heading font-bold text-lg text-content dark:text-white tracking-tight hidden sm:block max-w-[150px] truncate">
                {siteName}
              </span>
            </Link>

            {/* ── Desktop Navigation (Hanya tampil di ukuran Layar Besar/lg ke atas) ── */}
            <div className="hidden lg:flex items-center space-x-1 xl:space-x-2">
              {navLinks.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center px-3 xl:px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive(to)
                      ? 'bg-primary-50/80 text-primary-800 shadow-sm dark:bg-gray-800/80 dark:text-primary-400'
                      : 'text-content-muted hover:bg-white/50 hover:text-primary-800 dark:text-gray-300 dark:hover:bg-gray-800/50 dark:hover:text-primary-400'
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>

            {/* ── Desktop Actions (Hanya tampil di ukuran Layar Besar/lg ke atas) ── */}
            <div className="hidden lg:flex items-center gap-3 shrink-0">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full bg-white/50 text-content-muted shadow-sm hover:text-primary-800 hover:bg-primary-50 dark:bg-gray-800/50 dark:text-gray-300 dark:hover:text-primary-400 dark:hover:bg-gray-700 transition-colors border border-white/20 dark:border-gray-700/30"
                title={darkMode ? "Mode Terang" : "Mode Gelap"}
              >
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              {!isAuthenticated ? (
                <Link
                  to="/login"
                  className="px-5 py-2 rounded-full text-sm font-medium bg-primary-800/90 backdrop-blur-sm text-white hover:bg-primary-900 transition-all shadow-md hover:shadow-lg border border-primary-700/50"
                >
                  Login Kader
                </Link>
              ) : (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-white/50 hover:bg-white/80 dark:bg-gray-800/50 dark:hover:bg-gray-800/80 transition-all border border-white/20 dark:border-gray-700/30 shadow-sm"
                  >
                    <div className="w-7 h-7 rounded-full bg-primary-100 text-primary-800 dark:bg-gray-700 dark:text-primary-400 flex items-center justify-center font-bold text-xs overflow-hidden">
                      {user?.avatar ? (
                        <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        user?.name?.charAt(0).toUpperCase()
                      )}
                    </div>
                    <span className="text-sm font-medium text-content dark:text-white max-w-[100px] truncate">
                      {user?.name?.split(' ')[0]}
                    </span>
                  </button>

                  {/* Dropdown Menu - Glassmorphism */}
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-3 w-48 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/40 dark:border-gray-700/50 py-2 overflow-hidden z-50">
                      <Link
                        to={`${basePath}/profil`}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-content hover:bg-white/60 dark:text-gray-200 dark:hover:bg-gray-800/60 transition-colors"
                      >
                        <User className="w-4 h-4" /> Profil
                      </Link>
                      <Link
                        to={dashboardRoute}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-content hover:bg-white/60 dark:text-gray-200 dark:hover:bg-gray-800/60 transition-colors"
                      >
                        <Activity className="w-4 h-4" /> Dashboard
                      </Link>
                      <div className="h-px bg-surface-200/50 dark:bg-gray-700/50 my-2" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-status-danger hover:bg-red-50/50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> Keluar
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ── Mobile & Tablet Actions ── */}
            <div className="lg:hidden flex items-center gap-2">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full bg-white/50 text-content-muted shadow-sm hover:text-primary-800 dark:bg-gray-800/50 dark:text-gray-300 border border-white/20 dark:border-gray-700/30 transition-colors"
              >
                {darkMode ? <Sun className="w-5 h-5 sm:w-4 sm:h-4" /> : <Moon className="w-5 h-5 sm:w-4 sm:h-4" />}
              </button>
              <button
                onClick={() => setOpen(!open)}
                className="p-2 rounded-full bg-white/50 text-content shadow-sm dark:bg-gray-800/50 dark:text-white border border-white/20 dark:border-gray-700/30 transition-colors"
              >
                {open ? <X className="w-6 h-6 sm:w-5 sm:h-5" /> : <Menu className="w-6 h-6 sm:w-5 sm:h-5" />}
              </button>
            </div>
            
          </div>
        </div>

        {/* ── Mobile Menu Dropdown (Tampil di Layar Kecil dan Tablet) ── */}
        {open && (
          <div className="absolute top-full left-0 right-0 mt-3 lg:hidden px-2 pb-4">
            {/* max-h-[80vh] dan overflow-y-auto mencegah menu melebihi batas bawah layar */}
            <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-3xl shadow-xl border border-white/40 dark:border-gray-700/50 p-4 max-h-[80vh] overflow-y-auto overscroll-contain">
              <div className="space-y-1">
                {navLinks.map(({ to, label }) => (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setOpen(false)}
                    className={`block px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                      isActive(to)
                        ? 'bg-primary-50/80 text-primary-800 dark:bg-gray-800/80 dark:text-primary-400'
                        : 'text-content-muted hover:bg-white/60 dark:text-gray-300 dark:hover:bg-gray-800/50'
                    }`}
                  >
                    {label}
                  </Link>
                ))}
              </div>
              
              <div className="h-px bg-surface-200/50 dark:bg-gray-700/50 my-4"></div>
              
              {!isAuthenticated ? (
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="block w-full px-4 py-3 text-center rounded-xl text-base font-medium bg-primary-800/90 backdrop-blur-sm text-white hover:bg-primary-900 transition-colors shadow-md"
                >
                  Login Kader
                </Link>
              ) : (
                <div className="space-y-1">
                  <div className="px-4 py-2 text-xs font-semibold text-content-muted uppercase tracking-wider">
                    Akun Anda
                  </div>
                  <Link
                    to={`${basePath}/profil`}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-content hover:bg-white/60 dark:text-gray-300 dark:hover:bg-gray-800/50"
                  >
                    <User className="w-5 h-5" /> Profil
                  </Link>
                  <Link
                    to={dashboardRoute}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-content hover:bg-white/60 dark:text-gray-300 dark:hover:bg-gray-800/50"
                  >
                    <Activity className="w-5 h-5" /> Dashboard
                  </Link>
                  <button
                    onClick={() => { handleLogout(); setOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-status-danger hover:bg-red-50/50 dark:hover:bg-red-900/20 text-left"
                  >
                    <LogOut className="w-5 h-5" /> Keluar
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}