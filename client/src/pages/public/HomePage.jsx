import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Activity, Users, MapPin, Mail, Phone } from 'lucide-react';
import { useHomePage } from '../../hooks/usePublicData';
import Skeleton from '../../components/ui/Skeleton';
import { formatDate, getImageUrl } from '../../utils/format';

export default function HomePage() {
  const { data, isLoading } = useHomePage();

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-12 pb-24">
        <Skeleton className="h-[500px] w-full" />
        <div className="max-w-7xl mx-auto px-4 space-y-8">
          <Skeleton className="h-10 w-64 mx-auto" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </div>
        </div>
      </div>
    );
  }

  const { settings, programs, schedules, latestArticles, galleryPreview } = data || {};

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors">
      
      {/* ─── Hero Section ───────────────────────────── */}
      <section className="relative overflow-hidden bg-white dark:bg-slate-800 pt-16 pb-24 border-b border-slate-200 dark:border-slate-700">
        <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/dvlzx2zng/image/upload/v1717252001/posyandu-bg_hq7fzm.webp')] bg-cover bg-center opacity-5 dark:opacity-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-400 text-sm font-medium mb-6 shadow-sm border border-emerald-200 dark:border-emerald-800/50">
            <Activity className="w-4 h-4" /> Selamat Datang di {settings?.site_name || 'Posyandu Kami'}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6 leading-tight">
            Bersama Menjaga <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Kesehatan Ibu dan Anak</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed">
            {settings?.site_description || 'Kami hadir untuk memberikan pelayanan kesehatan terbaik bagi ibu hamil, bayi, dan balita di lingkungan Anda.'}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/jadwal"
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 transition-all text-center flex items-center justify-center gap-2"
            >
              <Calendar className="w-5 h-5" /> Lihat Jadwal
            </Link>
            <Link
              to="/program"
              className="w-full sm:w-auto px-8 py-3.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 transition-all text-center flex items-center justify-center gap-2"
            >
              <Users className="w-5 h-5" /> Pelajari Program
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Jadwal Terdekat ────────────────────────── */}
      {schedules && schedules.length > 0 && (
        <section className="py-16 bg-emerald-600 dark:bg-slate-800 border-y border-emerald-700 dark:border-slate-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Jadwal Posyandu Terdekat</h2>
                <p className="text-emerald-100 dark:text-slate-400">Catat tanggalnya dan jangan sampai terlewat.</p>
              </div>
              <Link to="/jadwal" className="inline-flex items-center gap-2 text-emerald-100 hover:text-white transition-colors font-medium">
                Lihat semua jadwal <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {schedules.map((schedule) => (
                <div key={schedule.id} className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-lg border-2 border-transparent hover:border-emerald-400 transition-all group">
                  <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 line-clamp-1">{schedule.activityName}</h3>
                  <div className="space-y-2 mt-3">
                    <p className="text-sm flex items-center gap-2 text-slate-600 dark:text-slate-400 font-medium">
                      <Calendar className="w-4 h-4 text-emerald-500" /> {formatDate(schedule.date)}
                    </p>
                    <p className="text-sm flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <span className="w-4 h-4 flex items-center justify-center text-emerald-500 text-xs">🕒</span> {schedule.startTime} - {schedule.endTime}
                    </p>
                    <p className="text-sm flex items-start gap-2 text-slate-600 dark:text-slate-400">
                      <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> 
                      <span className="line-clamp-2">{schedule.location}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Program Unggulan ───────────────────────── */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Program Kami</h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Berbagai layanan kesehatan yang kami sediakan untuk memastikan tumbuh kembang anak yang optimal.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs?.slice(0, 3).map((program) => (
            <div key={program.id} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              {program.image && (
                <img 
                  src={getImageUrl(program.image)} 
                  alt={program.title} 
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{program.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-3 leading-relaxed mb-4">
                  {program.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-10 text-center">
          <Link to="/program" className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-xl transition-colors">
            Lihat Semua Program
          </Link>
        </div>
      </section>

      {/* ─── Artikel Terbaru ────────────────────────── */}
      <section className="py-20 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Informasi & Edukasi</h2>
              <p className="text-slate-600 dark:text-slate-400">Baca artikel terbaru seputar kesehatan dari kader posyandu.</p>
            </div>
            <Link to="/artikel" className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors font-medium">
              Lihat semua artikel <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {latestArticles?.map((article) => (
              <Link key={article.id} to={`/artikel/${article.slug}`} className="group flex flex-col bg-slate-50 dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all">
                <div className="relative h-52 overflow-hidden bg-slate-200 dark:bg-slate-800">
                  {article.thumbnail ? (
                    <img src={getImageUrl(article.thumbnail)} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">Tanpa Gambar</div>
                  )}
                  {article.category && (
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-xs font-semibold text-emerald-700 dark:text-emerald-400 rounded-lg shadow-sm">
                        {article.category.name}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-3 mb-4 flex-1">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-200 dark:border-slate-800">
                    <span className="text-xs text-slate-500 dark:text-slate-400">{formatDate(article.publishDate)}</span>
                    <span className="text-emerald-600 dark:text-emerald-400 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                      Baca <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* ─── Galeri Preview ─────────────────────────── */}
      {galleryPreview && galleryPreview.length > 0 && (
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Galeri Kegiatan</h2>
            <p className="text-slate-600 dark:text-slate-400">Dokumentasi kegiatan posyandu kami.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {galleryPreview.slice(0, 4).map((img) => (
              <div key={img.id} className="aspect-square rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-800 relative group">
                <img src={getImageUrl(img.imageUrl)} alt={img.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <p className="text-white font-medium text-sm line-clamp-2">{img.title}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link to="/galeri" className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-xl transition-colors">
              Lihat Selengkapnya
            </Link>
          </div>
        </section>
      )}

    </div>
  );
}
