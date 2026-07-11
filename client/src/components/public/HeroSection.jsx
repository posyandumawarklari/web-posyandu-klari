import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Info, MapPin } from 'lucide-react';
import { formatDate, getImageUrl } from '../../utils/format';
import posyandubg from '../../assets/posyandu.jpg';

export default function HeroSection({ settings, schedules }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Auto-play berputar tiap 4 detik
  useEffect(() => {
    if (!schedules || schedules.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % schedules.length);
    }, 4000); 
    return () => clearInterval(interval);
  }, [schedules]);

  // Fungsi buat geser kartu
  const handleNext = () => {
    if (schedules && schedules.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % schedules.length);
    }
  };
  
  const handlePrev = () => {
    if (schedules && schedules.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + schedules.length) % schedules.length);
    }
  };

  // Deteksi Swipe untuk layar sentuh (HP)
  const handleTouchStart = (e) => setTouchStart(e.targetTouches[0].clientX);
  const handleTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > 50) handleNext(); // Swipe ke kiri (Next)
    if (distance < -50) handlePrev(); // Swipe ke kanan (Prev)
    setTouchStart(null);
    setTouchEnd(null);
  };

  // Variabel untuk Glassmorphism HANYA untuk Widget Kanan
  const widgetGlassClass = "bg-white/30 dark:bg-gray-800/40 backdrop-blur-xl border border-white/50 dark:border-gray-600/50 shadow-[0_8px_32px_rgba(0,0,0,0.1)] rounded-3xl";

  return (
    <section className="relative min-h-screen flex items-end pb-16 pt-32 overflow-hidden">
      {/* 1. Background Image dengan Bottom Blur Effect */}
      <div className="absolute inset-0 z-0 bg-surface-900">
        <img 
          src={settings?.hero_image ? getImageUrl(settings.hero_image) : posyandubg}
          alt="Kegiatan Posyandu"
          className="w-full h-full object-cover object-top"
         onError={(e) => { e.target.onerror = null; e.target.src="/placeholder-image.jpg"; }} />
        <div 
          className="absolute inset-0 bg-surface-50/80 dark:bg-gray-900/80 backdrop-blur-md"
          style={{ 
            maskImage: 'radial-gradient(circle at 50% 10%, transparent 30%, black 80%)', 
            WebkitMaskImage: 'radial-gradient(circle at 50% 10%, transparent 30%, black 80%)' 
          }}
        ></div>
      </div>

      {/* 2. Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 flex flex-col md:flex-row items-center md:items-end justify-between gap-8 md:gap-12">
        
        {/* ── Text Content Kiri (Tanpa Glassmorphism Box) ── */}
        <div className="flex-1 text-center md:text-left relative z-20 w-full max-w-2xl mb-2 mt-16 md:mt-0">
          <p className="max-w-xl mx-auto md:mx-0 text-base md:text-lg text-white dark:text-gray-300 mb-3 leading-relaxed font-medium drop-shadow-sm">
            {settings?.hero_subtitle || 'Kami hadir untuk memberikan pelayanan kesehatan terbaik bagi ibu hamil, bayi, dan balita di lingkungan Anda. Aman, terpercaya, dan berbasis komunitas.'}
          </p>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold text-white dark:text-white tracking-tight mb-8 leading-[1.2] md:leading-[1.15] drop-shadow-sm" dangerouslySetInnerHTML={{ __html: settings?.hero_title || 'Portal Informasi Layanan Kesehatan <br /> <span class="text-primary-600 dark:text-primary-400">Posyandu Mawar Desa Klari</span>' }} />
        </div>

        {/* ── Widget Dinamis Jadwal Posyandu (Kanan Bawah) ── */}
        <div className="w-full md:w-[380px] relative z-20 mt-12 md:mt-8">
          
          {/* Top Pill (Header Melayang) */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11/12 sm:w-[85%] max-w-[300px] bg-white/70 dark:bg-gray-800/80 backdrop-blur-xl border border-white/80 dark:border-gray-500/50 shadow-lg rounded-full p-1.5 pr-2 flex items-center justify-between z-40">
            <div className="flex items-center gap-3 pl-3">
              <Calendar className="w-4 h-4 text-slate-800 dark:text-gray-100 shrink-0" />
              <span className="text-sm font-bold text-slate-800 dark:text-white truncate">Jadwal Terdekat</span>
            </div>
            <Link 
              to="/jadwal" 
              className="w-8 h-8 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center shadow-sm hover:scale-105 hover:bg-slate-100 dark:hover:bg-gray-600 transition-all shrink-0"
            >
              <ArrowRight className="w-4 h-4 text-slate-800 dark:text-white" />
            </Link>
          </div>

          {/* Area Widget */}
          <div 
            className={`w-full pt-9 pb-6 px-4 sm:px-6 overflow-hidden flex flex-col ${widgetGlassClass}`}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {schedules && schedules.length > 0 ? (
              <>
                {/* ── Horizontal Stack Container ── */}
                <div className="relative w-full flex flex-col"> 
                  {schedules.map((schedule, index) => {
                    let relativeIndex = index - currentIndex;
                    if (relativeIndex < 0) relativeIndex += schedules.length;

                    // Render max 3 tumpukan
                    if (relativeIndex > 2) return null;

                    const isTop = relativeIndex === 0;
                    const isMiddle = relativeIndex === 1;
                    const isBottom = relativeIndex === 2;

                    return (
                      <div
                        key={schedule.id || index}
                        onClick={isTop ? undefined : handleNext}
                        // Animasi Translate X untuk tumpukan menyamping
                        className={`w-[calc(100%-1.25rem)] sm:w-[calc(100%-2rem)] bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-2xl p-3.5 sm:p-4 border border-white/80 dark:border-gray-700/60 transition-all duration-500 ease-out origin-left flex flex-col justify-center
                          ${isTop ? 'relative z-30 translate-x-0 scale-100 opacity-100 cursor-default shadow-md' : 'absolute inset-y-0 left-0 cursor-pointer hover:translate-x-1'}
                          ${isMiddle ? 'z-20 translate-x-2.5 sm:translate-x-4 scale-95 opacity-80' : ''}
                          ${isBottom ? 'z-10 translate-x-5 sm:translate-x-8 scale-90 opacity-40' : ''}
                        `}
                      >
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 mb-2.5 leading-snug">
                          {schedule.activityName}
                        </h4>
                        <div className="text-xs text-slate-700 dark:text-gray-300 flex flex-wrap justify-between items-center gap-2 mb-2.5">
                          <span className="font-medium flex items-center gap-1.5 whitespace-nowrap">
                            <Calendar className="w-3.5 h-3.5 shrink-0 text-primary-500 dark:text-primary-400"/> 
                            {formatDate(schedule.date)}
                          </span>
                          <span className="bg-slate-100 dark:bg-gray-700 text-slate-800 dark:text-gray-200 px-2 py-1 rounded-md font-semibold shadow-sm border border-white dark:border-gray-600/40 shrink-0">
                            {schedule.startTime}
                          </span>
                        </div>
                        <div className="w-full text-xs text-slate-600 dark:text-gray-400 border-t border-slate-200/80 dark:border-gray-700/50 pt-2.5 mt-auto flex items-start gap-1.5">
                          <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-primary-500 dark:text-primary-400" /> 
                          <span className="line-clamp-1 break-words">{schedule.location}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Indikator Dot Pagination */}
                <div className="flex justify-center gap-1.5 mt-5">
                  {schedules.map((_, dotIndex) => (
                    <button 
                      key={dotIndex}
                      onClick={() => setCurrentIndex(dotIndex)}
                      className={`h-1.5 rounded-full shadow-sm transition-all duration-300 ease-out ${
                        dotIndex === currentIndex 
                          ? 'w-5 bg-slate-800 dark:bg-gray-200' 
                          : 'w-1.5 bg-white/80 dark:bg-gray-500 hover:bg-slate-400'
                      }`}
                      aria-label={`Go to slide ${dotIndex + 1}`}
                    ></button>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-8 flex items-center justify-center min-h-[120px]">
                <p className="text-sm text-slate-700 dark:text-gray-300 font-medium">Belum ada jadwal tersedia.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}