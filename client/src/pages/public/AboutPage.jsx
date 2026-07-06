import { Heart, Target, Users, Activity } from 'lucide-react';
import { useSettings } from '../../hooks/usePublicData';
import PosyanduNetwork from '../../components/public/PosyanduNetwork';

export default function AboutPage() {
  const { data: settings } = useSettings();
  
  const siteName = settings?.site_name || 'Posyandu';
  const siteDesc = settings?.site_description || 'Layanan kesehatan dasar untuk ibu, anak, dan masyarakat.';

  return (
    <div className="animate-in fade-in duration-500 bg-surface dark:bg-gray-900 min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Header & Glass Container Utama */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Kolom Teks (Layout Berdasarkan Gambar) */}
          <div className="text-content dark:text-white space-y-10">
            
            <h1 className="text-5xl md:text-7xl font-heading font-extrabold tracking-tight leading-tight">
              Profil {siteName}
            </h1>
            
            <div className="relative pl-12">
              <span className="absolute left-0 top-0 text-primary-200 dark:text-primary-800/60 text-9xl font-serif leading-none -mt-8 -ml-4">“</span>
              <p className="text-content-muted dark:text-gray-300 text-2xl leading-relaxed font-medium italic relative z-10">
                {siteDesc}
              </p>
            </div>
          </div>

          {/* Area Kartu Kanan (Tetap Kosong untuk Kesesuaian Gambar) */}
          <div className="hidden lg:block"></div>
        </div>

        {/* ── Visi & Misi Section (Tata Letak Baru) ── */}
        <div className="relative">
          {/* Header Visi Misi */}
          <div className="text-center mb-12 space-y-4">
            <div className="inline-flex items-center justify-center gap-3 text-primary-800 dark:text-primary-400 font-bold tracking-widest text-xs uppercase">
              <span className="w-2 h-2 border-t-2 border-l-2 border-primary-500 rounded-tl-sm"></span>
              Tujuan Utama
              <span className="w-2 h-2 border-b-2 border-r-2 border-primary-500 rounded-br-sm"></span>
            </div>
            <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-content dark:text-white">
              Visi & Misi Kami
            </h2>
            <p className="text-content-muted dark:text-gray-400 font-medium">
              Landasan {siteName} dalam memberikan pelayanan masyarakat.
            </p>
          </div>

          {/* Kontainer Glassmorphism Utama */}
          <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-2xl border border-white/50 dark:border-gray-700/50 shadow-xl rounded-[2.5rem] p-6 md:p-8 lg:p-10">
            <div className="grid md:grid-cols-2 gap-6 md:gap-8">
              
              {/* Kolom Kiri: Visi */}
              <div className="flex flex-col">
                <div className="flex justify-center items-center gap-3 mb-6 text-content-muted dark:text-gray-400 font-semibold text-lg">
                  <span>Visi Kami:</span>
                </div>
                
                <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border border-white/60 dark:border-gray-700/50 rounded-[1.5rem] p-8 flex-1 shadow-sm flex items-center justify-center">
                  <p className="text-content-muted dark:text-gray-300 text-lg leading-relaxed text-center font-medium">
                    "Mewujudkan masyarakat yang sehat, mandiri, dan peduli terhadap kesehatan ibu dan anak melalui pelayanan kesehatan dasar yang komprehensif, bermutu, dan mudah dijangkau oleh seluruh lapisan masyarakat."
                  </p>
                </div>
              </div>

              {/* Kolom Kanan: Misi */}
              <div className="flex flex-col">
                <div className="flex justify-center items-center gap-3 mb-6 text-content-muted dark:text-gray-400 font-semibold text-lg">
                  <span>Misi Kami:</span>
                </div>
                
                <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border border-white/60 dark:border-gray-700/50 rounded-[1.5rem] p-8 flex-1 shadow-sm">
                  <ul className="flex flex-col h-full justify-center space-y-0">
                    <li className="flex items-center gap-5 py-4 border-b border-surface-200/60 dark:border-gray-700/50 last:border-0 first:pt-0 last:pb-0">
                      <Users className="w-5 h-5 text-primary-800 dark:text-primary-400 shrink-0" />
                      <span className="text-content-muted dark:text-gray-300 font-medium">Menyelenggarakan pemeliharaan kesehatan bagi ibu hamil dan anak.</span>
                    </li>
                    <li className="flex items-center gap-5 py-4 border-b border-surface-200/60 dark:border-gray-700/50 last:border-0">
                      <Activity className="w-5 h-5 text-primary-800 dark:text-primary-400 shrink-0" />
                      <span className="text-content-muted dark:text-gray-300 font-medium">Meningkatkan kesadaran masyarakat tentang pentingnya gizi.</span>
                    </li>
                    <li className="flex items-center gap-5 py-4 border-b border-surface-200/60 dark:border-gray-700/50 last:border-0">
                      <Heart className="w-5 h-5 text-primary-800 dark:text-primary-400 shrink-0" />
                      <span className="text-content-muted dark:text-gray-300 font-medium">Memfasilitasi pemantauan tumbuh kembang anak secara berkala.</span>
                    </li>
                    <li className="flex items-center gap-5 py-4 border-b border-surface-200/60 dark:border-gray-700/50 last:border-0">
                      <Target className="w-5 h-5 text-primary-800 dark:text-primary-400 shrink-0" />
                      <span className="text-content-muted dark:text-gray-300 font-medium">Memberdayakan kader kesehatan secara berkesinambungan.</span>
                    </li>
                  </ul>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ── Nilai-Nilai Utama Section (Tata Letak Seragam) ── */}
        <div className="pt-8 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-content dark:text-white mb-4">
            Membangun Kesehatan, Mengukir Masa Depan
          </h2>
          <p className="text-content-muted dark:text-gray-400 font-medium max-w-2xl mx-auto mb-16">
            {siteName} mendefinisikan ulang pelayanan kesehatan dasar dengan dedikasi luar biasa.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch text-left">
            {[
              { icon: Heart, title: 'Peduli', desc: 'Melayani dengan sepenuh hati dan empati untuk setiap keluarga yang datang.' },
              { icon: Users, title: 'Inklusif', desc: 'Terbuka untuk semua lapisan masyarakat tanpa membeda-bedakan status sosial, memberikan akses kesehatan yang setara untuk ibu dan anak.' },
              { icon: Activity, title: 'Proaktif', desc: 'Mencegah lebih baik daripada mengobati melalui program edukasi yang dilaksanakan secara berkelanjutan.' },
              { icon: Target, title: 'Profesional', desc: 'Kader kami merupakan individu terlatih yang secara konsisten berinovasi demi mewujudkan standar pelayanan terbaik.' },
            ].map((item, idx) => (
              <div 
                key={idx} 
                className="relative h-full flex flex-col group cursor-pointer transition-all duration-500 ease-out hover:-translate-y-3 hover:shadow-2xl rounded-[2rem]"
              >
                <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border border-white/50 dark:border-gray-700/50 rounded-[2rem] p-8 flex-grow shadow-sm transition-all duration-500 flex flex-col group-hover:bg-white/70 dark:group-hover:bg-gray-800/70 group-hover:border-white/80">
                  
                  {/* Header Card: Angka & Ikon */}
                  <div className="flex justify-between items-start mb-6">
                    <span className="text-2xl font-bold text-primary-800 dark:text-primary-400 transition-transform duration-300 group-hover:scale-110 group-hover:translate-x-1">
                      0{idx + 1}
                    </span>
                    <div className="p-3 bg-white/50 dark:bg-gray-700/50 rounded-xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12 shadow-sm">
                      <item.icon className="w-6 h-6 text-primary-700 dark:text-primary-400" />
                    </div>
                  </div>
                  
                  {/* Konten Card */}
                  <h4 className="text-lg font-heading font-bold text-content dark:text-white mb-3 transition-colors duration-300 group-hover:text-primary-900 dark:group-hover:text-primary-300">
                    {item.title}
                  </h4>
                  <p className="text-sm text-content-muted dark:text-gray-300 leading-relaxed">
                    {item.desc}
                  </p>
                  
                </div>
              </div>
            ))}
          </div>
        </div>

        <PosyanduNetwork />

      </div>
    </div>
  );
}