import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, FileText, FolderOpen, Tag, Heart,
  Image, CalendarDays, Users, Settings, User, LogOut,
  X, Stethoscope, MapPin, Home
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';


export default function Sidebar({ open, onClose }) {
  const { pathname } = useLocation();
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const isActive = (to, end) => {
    if (end) return pathname === to;
    return pathname.startsWith(to);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const basePath = isAdmin ? '/admin' : '/dashboard';

  const menuItems = [
    { to: basePath, icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: `${basePath}/artikel`, icon: FileText, label: 'Artikel' },
    { to: `${basePath}/kategori`, icon: FolderOpen, label: 'Kategori' },
    { to: `${basePath}/tag`, icon: Tag, label: 'Tag' },
    { to: `${basePath}/program`, icon: Stethoscope, label: 'Program' },
    { to: `${basePath}/posyandu`, icon: MapPin, label: 'Posyandu' },
    { to: `${basePath}/galeri`, icon: Image, label: 'Galeri' },
    { to: `${basePath}/jadwal`, icon: CalendarDays, label: 'Jadwal' },
  ];

  const adminOnlyItems = [
    { to: '/admin/pengguna', icon: Users, label: 'Pengguna' },
    { to: '/admin/pengaturan', icon: Settings, label: 'Pengaturan' },
  ];

  const allItems = isAdmin ? [...menuItems, ...adminOnlyItems] : menuItems;

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-surface-200 dark:border-gray-700">
        <Link to={basePath} className="flex items-center gap-3" onClick={onClose}>
          <div className="w-8 h-8 bg-primary-50 dark:bg-gray-800 rounded-lg flex items-center justify-center">
            <Heart className="w-4 h-4 text-primary-800 dark:text-primary-400" />
          </div>
          <span className="text-xl font-heading font-bold text-content dark:text-white tracking-tight">Posyandu</span>
        </Link>
        <button onClick={onClose} className="lg:hidden p-1.5 rounded-lg text-content-muted hover:bg-surface-100 dark:hover:bg-gray-800">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-1">
          {allItems.map(({ to, icon: Icon, label, end }) => (
            <li key={to}>
              <Link
                to={to}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive(to, end)
                    ? 'bg-primary-50 text-primary-800 font-semibold dark:bg-primary-900/30 dark:text-primary-400 border border-primary-100 dark:border-primary-800/50'
                    : 'text-content-muted hover:bg-surface-100 hover:text-content dark:text-gray-400 dark:hover:bg-gray-800 border border-transparent'
                }`}
              >
                <Icon className="w-[18px] h-[18px]" />
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* User / Logout */}
      <div className="border-t border-surface-200 dark:border-gray-700 p-3 space-y-1">
        <Link
          to={`${basePath}/profil`}
          onClick={onClose}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
            isActive(`${basePath}/profil`)
              ? 'bg-primary-50 text-primary-800 font-semibold dark:bg-primary-900/30 dark:text-primary-400 border border-primary-100 dark:border-primary-800/50'
              : 'text-content-muted hover:bg-surface-100 hover:text-content dark:text-gray-400 dark:hover:bg-gray-800 border border-transparent'
          }`}
        >
          {user?.avatar ? (
            <img src={user.avatar} alt="Profile" className="w-8 h-8 rounded-lg object-cover"  onError={(e) => { e.target.onerror = null; e.target.src="/placeholder-image.jpg"; }} />
          ) : (
            <User className="w-[18px] h-[18px]" />
          )}
          {user?.name || 'Profil'}
        </Link>
        <Link
          to="/"
          onClick={onClose}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-content-muted hover:bg-surface-100 hover:text-content dark:text-gray-400 dark:hover:bg-gray-800 transition-all border border-transparent"
        >
          <Home className="w-[18px] h-[18px]" />
          Kembali ke Beranda
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-status-danger hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/20 transition-all border border-transparent"
        >
          <LogOut className="w-[18px] h-[18px]" />
          Keluar
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm lg:hidden" onClick={onClose} />
      )}

      {/* Mobile sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-surface dark:bg-gray-800 transform transition-transform lg:hidden ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:flex lg:w-64 lg:flex-col bg-surface dark:bg-gray-800 border-r border-surface-200 dark:border-gray-700">
        {sidebarContent}
      </div>
    </>
  );
}
