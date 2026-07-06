import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Image as ImageIcon } from 'lucide-react';
import { getImageUrl } from '../../utils/format';

export default function GaleriPreview({ galleryPreview }) {
  if (!galleryPreview || galleryPreview.length === 0) return null;

  // Fungsi utilitas untuk mendistribusikan pola rentang (span) pada grid.
  // Pola ini berulang setiap 5 iterasi untuk menciptakan variasi visual kolase yang dinamis.
  const getGridPattern = (index) => {
    const patternPosition = index % 5;
    switch (patternPosition) {
      case 0:
        return 'col-span-2 row-span-2'; // Fokus utama: Lebar dan tinggi ganda
      case 1:
        return 'col-span-1 row-span-2'; // Potret vertikal
      case 2:
        return 'col-span-1 row-span-1'; // Standar/Persegi
      case 3:
        return 'col-span-2 md:col-span-1 row-span-1'; // Variasi lebar di mobile, standar di desktop
      case 4:
        return 'col-span-1 md:col-span-2 row-span-1'; // Standar di mobile, lebar di desktop
      default:
        return 'col-span-1 row-span-1';
    }
  };

  return (
    <section className="py-16 md:py-24 bg-surface-50 dark:bg-gray-900 border-b border-surface-200 dark:border-gray-800 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ── Header Section ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-12 gap-6">
          <div className="flex-1">
            <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-content dark:text-white mb-3 md:mb-4 tracking-tight">
              Dokumentasi <br className="hidden md:block lg:hidden" /> Kegiatan
            </h2>
            <p className="text-content-muted dark:text-gray-400 text-base md:text-lg font-medium leading-relaxed max-w-2xl">
              Potret aktivitas, layanan, dan momen kebersamaan Posyandu kami bersama masyarakat.
            </p>
          </div>
          
          <Link 
            to="/galeri" 
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 md:px-6 md:py-3 bg-white dark:bg-gray-800 border border-surface-200 dark:border-gray-700 text-content dark:text-white hover:bg-surface-50 dark:hover:bg-gray-700 font-semibold rounded-full transition-all shadow-sm hover:shadow-md group text-sm shrink-0 w-fit"
          >
            Lihat Arsip Galeri <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* ── Grid Collage Layout ── */}
        <div className="w-full relative">
          {/* grid-flow-row-dense: Kunci utama agar grid secara otomatis mengisi celah kosong.
            auto-rows: Menetapkan tinggi dasar setiap baris secara responsif.
          */}
          <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[160px] md:auto-rows-[240px] gap-3 md:gap-5 grid-flow-row-dense">
            
            {galleryPreview.map((img, index) => (
              <div 
                key={img.id} 
                className={`relative rounded-2xl md:rounded-[2rem] overflow-hidden bg-surface-200 dark:bg-gray-800 shadow-sm hover:shadow-xl transition-all duration-500 group border border-surface-200/50 dark:border-gray-700/50 ${getGridPattern(index)}`}
              >
                {/* Gambar Full Background */}
                {img.imageUrl ? (
                  <img 
                    src={getImageUrl(img.imageUrl)} 
                    alt={img.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ease-in-out" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-10 h-10 md:w-16 md:h-16 text-surface-400 dark:text-gray-600 opacity-50" />
                  </div>
                )}

                {/* Gradien Overlay */}
                <div className="absolute inset-x-0 bottom-0 h-4/5 md:h-3/5 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* ── Glassmorphism Caption Box ── */}
                <div className="absolute bottom-3 left-3 right-3 md:bottom-5 md:left-5 md:right-5 bg-white/20 dark:bg-gray-900/30 backdrop-blur-xl border border-white/30 dark:border-gray-500/30 shadow-[0_8px_32px_rgba(0,0,0,0.15)] rounded-xl md:rounded-[1.5rem] p-3 md:p-5 translate-y-2 group-hover:translate-y-0 transition-transform duration-500 ease-out flex flex-col justify-end">
                  
                  <h3 className="text-white font-bold text-sm md:text-lg line-clamp-2 drop-shadow-md mb-1.5 md:mb-2 leading-tight">
                    {img.title}
                  </h3>
                  
                  <div className="flex items-center gap-1.5 md:gap-2">
                    <span className="w-6 md:w-8 h-1 rounded-full bg-primary-400 dark:bg-primary-500"></span>
                    <span className="text-white/80 text-[10px] md:text-xs font-medium drop-shadow-sm truncate">
                      Dokumentasi
                    </span>
                  </div>

                </div>
              </div>
            ))}
            
          </div>
        </div>
        
      </div>
    </section>
  );
}