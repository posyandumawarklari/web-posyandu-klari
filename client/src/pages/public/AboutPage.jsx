import { Heart, Target, Users, Activity } from 'lucide-react';
import { useSettings } from '../../hooks/usePublicData';

export default function AboutPage() {
  const { data: settings } = useSettings();
  
  const siteName = settings?.site_name || 'Posyandu';
  const siteDesc = settings?.site_description || 'Layanan kesehatan dasar untuk ibu, anak, dan masyarakat.';

  return (
    <div className="animate-in fade-in duration-500">
      
      {/* Header Section */}
      <section className="bg-emerald-600 dark:bg-emerald-900 py-16 md:py-24 px-4 text-center">
        <div className="max-w-3xl mx-auto text-white">
          <h1 className="text-3xl md:text-5xl font-bold mb-6">Profil {siteName}</h1>
          <p className="text-emerald-100 text-lg leading-relaxed">
            {siteDesc}
          </p>
        </div>
      </section>

      {/* Visi Misi Section */}
      <section className="py-16 md:py-24 px-4 bg-white dark:bg-slate-950">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Visi & Misi Kami</h2>
            <div className="w-20 h-1 bg-emerald-500 mx-auto mt-4 rounded-full"></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-emerald-50 dark:bg-emerald-900/20 p-8 rounded-3xl border border-emerald-100 dark:border-emerald-900/50">
              <div className="w-14 h-14 bg-emerald-500 text-white flex items-center justify-center rounded-2xl mb-6 shadow-lg shadow-emerald-500/30">
                <Target className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Visi</h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Mewujudkan masyarakat yang sehat, mandiri, dan peduli terhadap kesehatan ibu dan anak melalui pelayanan kesehatan dasar yang komprehensif, bermutu, dan mudah dijangkau oleh seluruh lapisan masyarakat.
              </p>
            </div>
            
            <div className="bg-teal-50 dark:bg-teal-900/20 p-8 rounded-3xl border border-teal-100 dark:border-teal-900/50">
              <div className="w-14 h-14 bg-teal-500 text-white flex items-center justify-center rounded-2xl mb-6 shadow-lg shadow-teal-500/30">
                <Heart className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Misi</h3>
              <ul className="space-y-3 text-slate-600 dark:text-slate-300 leading-relaxed list-disc list-inside">
                <li>Menyelenggarakan pemeliharaan kesehatan dasar bagi ibu hamil, ibu menyusui, bayi, dan balita.</li>
                <li>Meningkatkan kesadaran masyarakat tentang pentingnya gizi dan imunisasi.</li>
                <li>Memfasilitasi pemantauan tumbuh kembang anak secara berkala.</li>
                <li>Memberdayakan kader kesehatan secara berkesinambungan.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Nilai Utama */}
      <section className="py-16 md:py-24 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Nilai-Nilai Utama</h2>
            <div className="w-20 h-1 bg-emerald-500 mx-auto mt-4 rounded-full"></div>
          </div>
          
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Heart, title: 'Peduli', desc: 'Melayani dengan sepenuh hati dan empati.' },
              { icon: Users, title: 'Inklusif', desc: 'Terbuka untuk semua lapisan masyarakat tanpa membeda-bedakan.' },
              { icon: Activity, title: 'Proaktif', desc: 'Mencegah lebih baik daripada mengobati melalui edukasi berkelanjutan.' },
              { icon: Target, title: 'Profesional', desc: 'Kader yang terlatih dan selalu berinovasi demi pelayanan terbaik.' },
            ].map((item, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm text-center border border-slate-100 dark:border-slate-700">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center rounded-xl mb-4">
                  <item.icon className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-2">{item.title}</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
