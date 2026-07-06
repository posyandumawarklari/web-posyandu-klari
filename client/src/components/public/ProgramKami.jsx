import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Plus, X, Users } from 'lucide-react';
import { getImageUrl } from '../../utils/format';

export default function ProgramKami({ programs }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!programs || programs.length === 0) {
    return null; 
  }

  const activeProgram = programs[activeIndex];

  return (
    <section className="py-16 lg:py-24 bg-surface-50 dark:bg-gray-900 border-b border-surface-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
        
        {/* ── Kiri: Accordion List ── */}
        <div className="lg:col-span-5 flex flex-col">
          
          {/* Bagian Header: Judul, Tombol (Khusus Mobile), dan Deskripsi */}
          <div className="mb-8 lg:mb-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-content dark:text-white tracking-tight">
                Program <br className="hidden lg:block" /> Layanan
              </h2>
              
              {/* Tombol Khusus Mobile: Ditampilkan di layar kecil, disembunyikan di layar besar (lg:hidden) */}
              <Link 
                to="/program" 
                className="inline-flex lg:hidden w-fit items-center justify-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-800 border border-surface-200 dark:border-gray-700 text-content dark:text-white hover:bg-surface-50 dark:hover:bg-gray-700 font-medium rounded-full transition-all shadow-sm group text-sm"
              >
                Lihat Seluruh Program <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            <p className="text-content-muted dark:text-gray-400 text-lg leading-relaxed font-medium">
              Berbagai layanan kesehatan komprehensif yang kami sediakan untuk memastikan kesehatan dan kesejahteraan masyarakat.
            </p>
          </div>

          {/* List Program Accordion */}
          <div className="flex flex-col border-t border-surface-200 dark:border-gray-800">
            {programs.slice(0, 4).map((program, index) => {
              const isActive = activeIndex === index;
              
              return (
                <div 
                  key={program.id} 
                  className="border-b border-surface-200 dark:border-gray-800 py-4 lg:py-5 cursor-pointer group"
                  onClick={() => setActiveIndex(index)}
                >
                  <div className="flex justify-between items-center">
                    <h3 className={`text-xl lg:text-2xl font-heading font-bold transition-colors ${isActive ? 'text-primary-600 dark:text-primary-400' : 'text-content dark:text-white group-hover:text-primary-500'}`}>
                      {program.title}
                    </h3>
                    <button className="w-8 h-8 flex-shrink-0 ml-4 rounded-full border border-surface-300 dark:border-gray-600 flex items-center justify-center bg-white dark:bg-gray-800 text-content dark:text-gray-300 transition-all group-hover:border-primary-400">
                      {isActive ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Deskripsi Muncul Saat Aktif */}
                  <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isActive ? 'max-h-64 mt-4 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <p className="text-content-muted dark:text-gray-400 text-sm lg:text-base leading-relaxed mb-2 lg:mb-4">
                      {program.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Kanan: Featured Glassmorphism Card ── */}
        {/* Penambahan 'hidden lg:flex' agar elemen ini tidak dirender pada perangkat seluler */}
        <div className="hidden lg:flex lg:col-span-7 flex-col h-full min-h-[500px]">
          
          {/* Header Kanan (Tombol Khusus Desktop) */}
          <div className="flex items-center justify-end mb-6">
            <Link 
              to="/program" 
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-800 border border-surface-200 dark:border-gray-700 text-content dark:text-white hover:bg-surface-50 dark:hover:bg-gray-700 font-medium rounded-full transition-all shadow-sm group text-sm"
            >
              Lihat Seluruh Program <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Kartu Utama (Glassmorphism) */}
          <div className="flex-1 bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border border-white/60 dark:border-gray-600/50 shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-[2rem] overflow-hidden flex flex-col group relative">
            
            {/* Konten Teks Kartu */}
            <div className="p-8 md:p-10 flex-shrink-0 relative z-10">
              <div className="flex gap-2 mb-6">
                <span className="px-4 py-1.5 bg-white/80 dark:bg-gray-700/80 backdrop-blur-md rounded-full text-xs font-bold border border-surface-100 dark:border-gray-600 shadow-sm text-content dark:text-white">
                  Posyandu
                </span>
              </div>
              
              <h4 className="text-4xl md:text-5xl font-heading font-extrabold text-content dark:text-white mb-6 leading-tight">
                {activeProgram?.title}
              </h4>
            </div>

            {/* Area Gambar */}
            <div className="flex-1 bg-surface-100/50 dark:bg-gray-700/50 relative overflow-hidden min-h-[250px]">
              {activeProgram?.image ? (
                <img 
                  src={getImageUrl(activeProgram.image)} 
                  alt={activeProgram.title} 
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700" 
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Users className="w-20 h-20 text-surface-300/50 dark:text-gray-500/50" />
                </div>
              )}
              <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white/20 dark:from-gray-900/20 to-transparent"></div>
            </div>

          </div>
        </div>
        
      </div>
    </section>
  );
}