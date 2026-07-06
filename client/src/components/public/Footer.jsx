import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSettings } from '../../hooks/usePublicData';

export default function Footer() {
  const { data: settings } = useSettings();
  const siteName = settings?.site_name || 'Posyandu';
  const currentYear = new Date().getFullYear();

  const logoSrc = settings?.logo || '/logo.png';

  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-surface-50/60 to-primary-50/60 dark:from-gray-900/60 dark:to-gray-800/60 backdrop-blur-xl border-t border-white/40 dark:border-gray-800/50">
      
      {/* ── Konten Utama ── */}
      {/* Penyesuaian padding vertikal (pt) agar tidak terlalu renggang di perangkat seluler */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 md:pt-16 lg:pt-20 pb-6 md:pb-8 z-10">
        
        {/* Implementasi CSS Grid: 1 kolom (Mobile), 2 kolom (Tablet), 3 kolom (Desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12 items-start">
          
          {/* ── Kolom Kiri: Sosial Media & Kontak ── */}
          <div className="flex flex-col gap-6 lg:gap-8">
            {/* Ikon Sosial */}
            <div className="flex items-center gap-4 text-content dark:text-gray-300">
              {settings?.social_instagram && (
                <a 
                  href={settings.social_instagram} 
                  target="_blank" rel="noopener noreferrer"
                  className="p-2 rounded-full border border-surface-200/50 dark:border-gray-700 bg-white/30 dark:bg-gray-800/30 hover:bg-white/60 dark:hover:bg-gray-700 transition-colors shadow-sm" 
                  aria-label="Instagram"
                >
                  <svg className="w-5 h-5 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
              )}
              {settings?.social_facebook && (
                <a 
                  href={settings.social_facebook} 
                  target="_blank" rel="noopener noreferrer"
                  className="p-2 rounded-full border border-surface-200/50 dark:border-gray-700 bg-white/30 dark:bg-gray-800/30 hover:bg-white/60 dark:hover:bg-gray-700 transition-colors shadow-sm" 
                  aria-label="Facebook"
                >
                  <svg className="w-5 h-5 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
              )}
              {settings?.social_youtube && (
                <a 
                  href={settings.social_youtube} 
                  target="_blank" rel="noopener noreferrer"
                  className="p-2 rounded-full border border-surface-200/50 dark:border-gray-700 bg-white/30 dark:bg-gray-800/30 hover:bg-white/60 dark:hover:bg-gray-700 transition-colors shadow-sm" 
                  aria-label="YouTube"
                >
                  <svg className="w-5 h-5 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path>
                    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                  </svg>
                </a>
              )}
            </div>
            
            {/* Info Kontak */}
            <div className="space-y-3 lg:space-y-4">
              <a href={`mailto:${settings?.email || 'halo@posyandu.id'}`} className="block text-base lg:text-lg font-medium text-content dark:text-white hover:text-primary-800 dark:hover:text-primary-400 transition-colors break-words">
                {settings?.email || 'halo@posyandu.id'}
              </a>
              <p className="text-sm text-content-muted dark:text-gray-400 max-w-xs leading-relaxed whitespace-pre-line">
                {settings?.address || 'Kecamatan Karanggede,\nKabupaten Boyolali,\nProvinsi Jawa Tengah, Indonesia'}
              </p>
              {settings?.phone && (
                <p className="text-sm font-medium text-content-muted dark:text-gray-400 pt-1 lg:pt-2">
                  {settings.phone}
                </p>
              )}
            </div>
          </div>

          {/* ── Kolom Tengah: Elemen Dekoratif (Glassmorphism Node) ── */}
          {/* Disembunyikan pada Mobile dan Tablet agar tidak mempersempit tata letak, eksklusif untuk Desktop (lg) */}
          <div className="hidden lg:flex flex-col items-center justify-center relative py-8">
            <div className="absolute w-[120%] h-px border-t border-dashed border-primary-200 dark:border-gray-700 z-0"></div>
            
            
          </div>

          {/* ── Kolom Kanan: Tautan Menu ── */}
          {/* Menggunakan md:items-end agar teks rata kanan pada tablet, dan rata kiri pada perangkat seluler */}
          <div className="flex flex-col items-start md:items-end gap-3 lg:gap-4">
            {[
              { to: '/', label: 'Beranda' },
              { to: '/artikel', label: 'Artikel' },
              { to: '/program', label: 'Program' },
              { to: '/jadwal', label: 'Jadwal' },
              { to: '/galeri', label: 'Galeri' },
              { to: '/tentang-kami', label: 'Tentang Kami' },
              { to: '/kontak', label: 'Kontak' },
            ].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="text-sm md:text-base font-medium text-content hover:text-primary-800 dark:text-gray-300 dark:hover:text-primary-400 transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>

        </div>

        {/* ── Baris Bawah: Hak Cipta & Kebijakan ── */}
        <div className="mt-12 md:mt-16 lg:mt-20 pt-6 border-t border-surface-200/50 dark:border-gray-700/50 flex flex-col md:flex-row justify-between items-center text-xs text-content-muted dark:text-gray-500 gap-4 text-center md:text-left">
          <span>© {currentYear} {siteName}. Hak Cipta Dilindungi.</span>
        </div>
      </div>

      {/* ── Tipografi Latar Belakang (Watermark Besar) ── */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden pointer-events-none flex justify-center translate-y-[35%] lg:translate-y-[30%] opacity-70 lg:opacity-100">
        <h1 className="text-[20vw] md:text-[15vw] font-black tracking-tighter leading-none text-primary-800/5 dark:text-white/5 uppercase select-none whitespace-nowrap">
          {siteName}
        </h1>
      </div>
      
    </footer>
  );
}