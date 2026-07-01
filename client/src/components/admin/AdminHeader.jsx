import { Menu, Moon, Sun, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function AdminHeader({ onMenuClick }) {
  const { user } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30">
      {/* Left */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
      >
        <Menu className="w-5 h-5" />
      </button>

      <div className="hidden lg:block" />

      {/* Right */}
      <div className="flex items-center gap-2">
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
          title={darkMode ? 'Mode Terang' : 'Mode Gelap'}
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <div className="flex items-center gap-3 pl-3 border-l border-slate-200 dark:border-slate-700">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xs font-bold overflow-hidden">
            {user?.avatar ? (
              <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              user?.name?.charAt(0)?.toUpperCase() || 'U'
            )}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-slate-900 dark:text-white">{user?.name}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {user?.role === 'ADMIN' ? 'Administrator' : 'Kader'}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
