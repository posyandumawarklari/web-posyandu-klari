import { useState, useEffect } from 'react';
import { MapPin, Activity, Map, Navigation, Loader2 } from 'lucide-react';
import peta from '../../assets/peta-klari.png';
import { usePublicPosyanduPosts } from '../../hooks/usePublicData';

export default function PosyanduNetwork() {
  const { data: posyanduData, isLoading } = usePublicPosyanduPosts();
  const [activeId, setActiveId] = useState(null);

  // Set first posyandu active when data is loaded
  useEffect(() => {
    if (posyanduData && posyanduData.length > 0 && !activeId) {
      setActiveId(posyanduData[0].id);
    }
  }, [posyanduData, activeId]);

  const activePosyandu = posyanduData?.find(p => p.id === activeId);

  return (
    <section 
      className="relative py-16 md:py-24 px-4 md:px-8 bg-cover bg-center bg-no-repeat bg-fixed overflow-hidden"
      style={{ backgroundImage: `url(${peta})` }}
    >
      {/* Overlay Transparan */}
      <div className="absolute inset-0 bg-white/70 dark:bg-gray-900/80 backdrop-blur-sm"></div>

      <div className="relative z-10 max-w-6xl mx-auto space-y-12">
        
        {/* ── Header Section ── */}
        <div className="text-center space-y-3 md:space-y-4">
          <div className="inline-flex items-center justify-center gap-3 text-primary-800 dark:text-primary-400 font-bold tracking-widest text-[10px] md:text-xs uppercase">
              <span className="w-2 h-2 border-t-2 border-l-2 border-primary-500 rounded-tl-sm"></span>
              Persebaran Area
              <span className="w-2 h-2 border-b-2 border-r-2 border-primary-500 rounded-br-sm"></span>
          </div>
          <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-gray-900 dark:text-white drop-shadow-sm px-2">
            Sistem Jejaring Posyandu
          </h2>
          <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 font-medium max-w-2xl mx-auto drop-shadow-sm px-4">
            Pilih titik Posyandu pada jaringan di bawah untuk melihat detail informasi pelayanan, lokasi, dan kader yang bertugas.
          </p>
        </div>

        {/* ── Main Container (Glassmorphism) ── */}
        <div className="bg-white/30 dark:bg-gray-900/40 backdrop-blur-2xl border border-white/50 dark:border-gray-700/40 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] rounded-[2rem] md:rounded-[3rem] p-6 sm:p-8 md:p-12">
          
          {/* Flex Layout: Stack di HP, Bersebelahan di Laptop */}
          <div className="flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-16">
            
            {/* KIRI/ATAS: Orbit Navigasi */}
            <div className="relative w-full max-w-[280px] sm:max-w-[360px] lg:max-w-[420px] aspect-square flex items-center justify-center shrink-0">
              
              {/* Garis Orbit */}
              <div className="absolute inset-[10%] sm:inset-[8%] border-[1.5px] border-dashed border-primary-800/30 dark:border-white/30 rounded-full animate-[spin_100s_linear_infinite]"></div>
              <div className="absolute inset-[0%] border-[1px] border-primary-800/10 dark:border-white/10 rounded-full"></div>
              
              {/* Central Node (Hanya Ikon, Tanpa Teks) */}
              <div className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border border-primary-200 dark:border-gray-600 rounded-full flex items-center justify-center shadow-lg">
                <div className="absolute inset-0 rounded-full animate-ping bg-primary-400/20"></div>
                <Navigation className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600 dark:text-primary-400" />
              </div>

              {/* Orbiting Nodes (Titik Posyandu) */}
              {!isLoading && posyanduData?.map((pos, index) => {
                const total = posyanduData.length;
                const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
                const radiusPercent = 45; // Jarak dari tengah
                
                const top = `calc(50% + ${Math.sin(angle) * radiusPercent}%)`;
                const left = `calc(50% + ${Math.cos(angle) * radiusPercent}%)`;
                
                const isActive = activeId === pos.id;

                return (
                  <button
                    key={pos.id}
                    onClick={() => setActiveId(pos.id)}
                    className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1.5 group z-30 transition-all duration-300 outline-none"
                    style={{ top, left }}
                    aria-label={`Pilih Posyandu ${pos.name}`}
                  >
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full flex items-center justify-center border-[2px] backdrop-blur-xl shadow-[0_4px_12px_0_rgba(31,38,135,0.15)] transition-all duration-300 relative
                      ${isActive 
                        ? 'bg-primary-600 border-white text-white dark:bg-primary-500 scale-110' 
                        : 'bg-white/80 border-white/70 text-primary-900 hover:bg-white dark:bg-gray-800/90 dark:border-gray-500 dark:text-primary-300 group-hover:scale-105'
                      }
                    `}>
                      <span className="font-heading font-extrabold text-sm sm:text-base lg:text-lg drop-shadow-sm">
                        {index + 1}
                      </span>
                      {isActive && (
                        <span className="absolute inset-0 rounded-full animate-ping border border-primary-500/60"></span>
                      )}
                    </div>
                    
                    <span className={`text-[9px] sm:text-[11px] font-bold px-2.5 py-1 rounded-full backdrop-blur-md shadow-sm border transition-colors whitespace-nowrap
                      ${isActive 
                        ? 'bg-primary-800 text-white border-primary-500' 
                        : 'bg-white/80 text-gray-800 border-white/70 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 group-hover:bg-white group-hover:text-primary-900'
                      }
                    `}>
                      {pos.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* KANAN/BAWAH: Info Card Detail */}
            {isLoading ? (
              <div className="w-full max-w-md bg-white/70 dark:bg-gray-800/70 backdrop-blur-2xl border border-white/80 dark:border-gray-600 shadow-xl rounded-[2rem] p-6 md:p-8 relative flex items-center justify-center min-h-[300px]">
                <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
              </div>
            ) : activePosyandu ? (
              <div 
                key={activeId} 
                className="w-full max-w-md bg-white/70 dark:bg-gray-800/70 backdrop-blur-2xl border border-white/80 dark:border-gray-600 shadow-xl rounded-[2rem] p-6 md:p-8 relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500"
              >
              {/* Badge Area */}
              <div className="absolute top-0 right-0 bg-primary-100 dark:bg-primary-900/50 text-primary-800 dark:text-primary-300 text-[10px] font-bold px-4 py-1.5 rounded-bl-[1.5rem] rounded-tr-[2rem] border-b border-l border-white/50 dark:border-gray-600 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5" /> Pos Aktif
              </div>

              {/* Header Info */}
              <div className="mb-6 pt-2">
                <h3 className="text-2xl md:text-3xl font-heading font-extrabold text-gray-900 dark:text-white mb-2">
                  Posyandu {activePosyandu.name}
                </h3>
                <div className="flex items-center gap-2 text-sm font-bold text-primary-700 dark:text-primary-400">
                  <MapPin className="w-4 h-4" /> {activePosyandu.area}
                </div>
              </div>

              {/* Lokasi Card Kecil */}
              <div className="mb-6 bg-white/50 dark:bg-gray-900/50 p-4 rounded-2xl border border-white/60 dark:border-gray-700 shadow-sm flex items-start gap-3">
                <div className="p-2 bg-primary-100 dark:bg-gray-800 rounded-lg text-primary-600 dark:text-primary-400 shrink-0">
                  <Map className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 mb-0.5">Lokasi Kegiatan</div>
                  <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">{activePosyandu.location}</div>
                </div>
              </div>

              {/* List Kader */}
              <div>
                <div className="text-[11px] uppercase font-bold tracking-widest text-gray-600 dark:text-gray-400 mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">
                  Kader Bertugas
                </div>
                <div className="flex flex-wrap gap-2">
                  {activePosyandu.cadres.map((kader, idx) => (
                    <span 
                      key={idx} 
                      className="text-xs font-semibold text-gray-700 dark:text-gray-200 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white dark:border-gray-600 shadow-sm transition hover:-translate-y-0.5"
                    >
                      {kader}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            ) : (
              <div className="w-full max-w-md bg-white/70 dark:bg-gray-800/70 backdrop-blur-2xl border border-white/80 dark:border-gray-600 shadow-xl rounded-[2rem] p-6 md:p-8 relative flex items-center justify-center min-h-[300px]">
                <p className="text-gray-500 dark:text-gray-400 font-medium">Data Posyandu belum tersedia.</p>
              </div>
            )}

          </div>
        </div>

      </div>
    </section>
  );
}