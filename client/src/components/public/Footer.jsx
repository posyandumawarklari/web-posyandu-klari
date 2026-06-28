import { Heart, Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSettings } from '../../hooks/usePublicData';

export default function Footer() {
  const { data: settings } = useSettings();

  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">
                {settings?.site_name || 'Posyandu'}
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              {settings?.site_description || 'Melayani masyarakat dengan sepenuh hati untuk kesehatan ibu dan anak.'}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Menu
            </h4>
            <ul className="space-y-2.5">
              {[
                { to: '/', label: 'Beranda' },
                { to: '/artikel', label: 'Artikel' },
                { to: '/program', label: 'Program' },
                { to: '/jadwal', label: 'Jadwal' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm text-slate-400 hover:text-emerald-400 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Kontak
            </h4>
            <ul className="space-y-3">
              {settings?.address && (
                <li className="flex items-start gap-3 text-sm text-slate-400">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-emerald-500" />
                  <span>{settings.address}</span>
                </li>
              )}
              {settings?.phone && (
                <li className="flex items-center gap-3 text-sm text-slate-400">
                  <Phone className="w-4 h-4 flex-shrink-0 text-emerald-500" />
                  <span>{settings.phone}</span>
                </li>
              )}
              {settings?.email && (
                <li className="flex items-center gap-3 text-sm text-slate-400">
                  <Mail className="w-4 h-4 flex-shrink-0 text-emerald-500" />
                  <span>{settings.email}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-slate-800 text-center">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} {settings?.site_name || 'Posyandu'}. Hak cipta dilindungi.
          </p>
        </div>
      </div>
    </footer>
  );
}
