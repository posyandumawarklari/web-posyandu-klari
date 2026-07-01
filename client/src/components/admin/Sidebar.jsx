import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, FileText, FolderOpen, Tag, Heart,
  Image, CalendarDays, Users, Settings, User, LogOut,
  X, Stethoscope,
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
      <div className="h-16 flex items-center justify-between px-5 border-b border-slate-200 dark:border-slate-700">
        <Link to={basePath} className="flex items-center gap-2" onClick={onClose}>
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
            <Heart className="w-4 h-4 text-white" />
          </div>
          <span className="text-base font-bold text-slate-900 dark:text-white">Posyandu</span>
        </Link>
        <button onClick={onClose} className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
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
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive(to, end)
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
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
      <div className="border-t border-slate-200 dark:border-slate-700 p-3 space-y-1">
        <Link
          to={`${basePath}/profil`}
          onClick={onClose}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
            isActive(`${basePath}/profil`)
              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
              : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
          }`}
        >
          {user?.avatar ? (
            <img src={user.avatar} alt="Profile" className="w-[18px] h-[18px] rounded-full object-cover" />
          ) : (
            <User className="w-[18px] h-[18px]" />
          )}
          {user?.name || 'Profil'}
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
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
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={onClose} />
      )}

      {/* Mobile sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-800 transform transition-transform lg:hidden ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:flex lg:w-64 lg:flex-col bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700">
        {sidebarContent}
      </div>
    </>
  );
}
