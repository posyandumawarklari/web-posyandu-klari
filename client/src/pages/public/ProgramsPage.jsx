import { useState, useEffect } from 'react';
import { usePublicPrograms } from '../../hooks/usePublicData';
import Skeleton from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';
import { getImageUrl } from '../../utils/format';
import { Users, Plus, X } from 'lucide-react';

export default function ProgramsPage() {
  const { data: programs, isLoading } = usePublicPrograms();
  const [activeId, setActiveId] = useState(null);

  // Set active program pertama secara otomatis ketika data selesai di-load
  useEffect(() => {
    if (programs && programs.length > 0 && !activeId) {
      setActiveId(programs[0].id);
    }
  }, [programs, activeId]);

  const activeProgram = programs?.find((p) => p.id === activeId) || programs?.[0];

  return (
    // pt-28 md:pt-36 memastikan jarak aman dari navbar agar tidak tertutup
    <div className="bg-surface-50 dark:bg-gray-900 min-h-screen pt-28 pb-16 md:pt-36 md:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold text-content dark:text-white tracking-tight mb-4 md:mb-6">
            Program Posyandu
          </h1>
          <p className="text-base sm:text-lg text-content-muted dark:text-gray-400 font-medium px-2">
            Berbagai layanan dan kegiatan yang kami selenggarakan secara rutin untuk meningkatkan kualitas kesehatan masyarakat.
          </p>
        </div>

        {/* Content */}
        {isLoading ? (
          // Skeleton Layout
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
            {/* Pada mobile: Skeleton Gambar di atas (order-1), Skeleton Teks di bawah (order-2) */}
            <div className="order-1 lg:order-2 lg:col-span-7">
              <Skeleton className="w-full h-[350px] md:h-[450px] lg:h-[550px] rounded-[2rem] lg:rounded-[3rem]" />
            </div>
            <div className="order-2 lg:order-1 lg:col-span-5 space-y-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="border-b border-surface-200 dark:border-gray-700 pb-4">
                  <div className="flex justify-between items-center mb-3">
                    <Skeleton className="h-6 w-1/2 rounded" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                  </div>
                  {i === 1 && (
                    <div className="space-y-2 mt-4">
                      <Skeleton className="h-4 w-full rounded" />
                      <Skeleton className="h-4 w-5/6 rounded" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : !programs || programs.length === 0 ? (
          <EmptyState 
            icon={Users} 
            title="Belum ada program" 
            description="Informasi program posyandu akan segera ditambahkan." 
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 relative items-start">
            
            {/* ── BAGIAN KANAN DI PC (GAMBAR) TAPI PINDAH KE ATAS DI MOBILE ── */}
            {/* Menggunakan order-1 di mobile, dan lg:order-2 di layar besar */}
            <div className="order-1 lg:order-2 lg:col-span-7 lg:sticky lg:top-28 w-full z-10">
              {activeProgram && (
                // Glassmorphism Card (Tinggi disesuaikan untuk HP agar tidak terlalu makan tempat)
                <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-2xl border border-white/60 dark:border-gray-700/50 shadow-soft-xl rounded-[2rem] lg:rounded-[3rem] p-6 sm:p-8 lg:p-12 flex flex-col transition-all duration-500 min-h-[350px] sm:min-h-[400px] lg:min-h-[550px]">
                  
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-extrabold text-content dark:text-white mb-6 lg:mb-8 tracking-tight leading-tight">
                    {activeProgram.title}
                  </h2>

                  {/* Image Container */}
                  <div className="flex-1 w-full bg-surface-100/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-[1.5rem] lg:rounded-3xl border border-surface-200/50 dark:border-gray-700/50 overflow-hidden flex items-center justify-center relative shadow-inner">
                    {activeProgram.image ? (
                      <img 
                        key={activeProgram.image} 
                        src={getImageUrl(activeProgram.image)} 
                        alt={activeProgram.title} 
                        className="w-full h-full object-cover animate-fade-in"
                      />
                    ) : (
                      <Users className="w-16 h-16 sm:w-24 sm:h-24 text-surface-300 dark:text-gray-600 animate-pulse" />
                    )}
                  </div>
                  
                </div>
              )}
            </div>

            {/* ── BAGIAN KIRI DI PC (AKORDION TEKS) TAPI PINDAH KE BAWAH DI MOBILE ── */}
            {/* Menggunakan order-2 di mobile, dan lg:order-1 di layar besar */}
            <div className="order-2 lg:order-1 lg:col-span-5 flex flex-col w-full z-0 mt-2 lg:mt-0">
              {programs.map((program) => {
                const isActive = activeId === program.id;
                
                return (
                  <div 
                    key={program.id} 
                    className="border-b border-surface-200 dark:border-gray-700/50 last:border-0"
                  >
                    <button
                      onClick={() => setActiveId(isActive ? null : program.id)}
                      className="w-full flex items-center justify-between py-4 md:py-5 lg:py-6 text-left group transition-all"
                    >
                      <h3 className={`text-lg sm:text-xl md:text-2xl font-bold font-heading transition-colors pr-4
                        ${isActive 
                          ? 'text-primary-700 dark:text-primary-400' 
                          : 'text-content dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-300'
                        }`}
                      >
                        {program.title}
                      </h3>
                      
                      {/* Icon Button */}
                      <div className={`w-8 h-8 shrink-0 rounded-full border flex items-center justify-center transition-all duration-300
                        ${isActive 
                          ? 'border-surface-200 dark:border-gray-600 text-content-muted dark:text-gray-400 bg-surface-50 dark:bg-gray-800' 
                          : 'border-surface-200 dark:border-gray-600 text-content dark:text-gray-300 group-hover:border-primary-300 group-hover:text-primary-600'
                        }`}
                      >
                        {isActive ? (
                          <X className="w-4 h-4 md:w-5 md:h-5" />
                        ) : (
                          <Plus className="w-4 h-4 md:w-5 md:h-5" />
                        )}
                      </div>
                    </button>

                    {/* Deskripsi Muncul Saat Aktif */}
                    <div 
                      className={`overflow-hidden transition-all duration-500 ease-in-out
                        ${isActive ? 'max-h-[500px] opacity-100 pb-5 lg:pb-6' : 'max-h-0 opacity-0 pb-0'}
                      `}
                    >
                      <p className="text-content-muted dark:text-gray-400 leading-relaxed text-sm sm:text-base md:text-lg">
                        {program.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}