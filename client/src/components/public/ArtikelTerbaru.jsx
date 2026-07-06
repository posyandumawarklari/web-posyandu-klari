import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Activity } from 'lucide-react';
import { formatDate, getImageUrl } from '../../utils/format';

export default function ArtikelTerbaru({ latestArticles }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  if (!latestArticles || latestArticles.length === 0) return null;

  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

  const onTouchEndEvent = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && activeIndex < latestArticles.length - 1) {
      setActiveIndex((prev) => prev + 1);
    }
    if (isRightSwipe && activeIndex > 0) {
      setActiveIndex((prev) => prev - 1);
    }
  };

  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-surface-50 dark:bg-gray-900 border-b border-surface-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ── Header Section ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 lg:mb-12 gap-5 lg:gap-6">
          <div className="flex-1">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold text-content dark:text-white mb-3 sm:mb-4 tracking-tight">
              Informasi <br className="hidden md:block lg:hidden" /> & Edukasi
            </h2>
            <p className="text-content-muted dark:text-gray-400 text-base sm:text-lg font-medium leading-relaxed max-w-2xl">
              Artikel kesehatan terbaru dari kader dan tenaga medis untuk masyarakat.
            </p>
          </div>
          
          {/* Tombol ini ditampilkan di Mobile dan Desktop, disembunyikan di Tablet (md:hidden lg:inline-flex) */}
          <Link 
            to="/artikel" 
            className="inline-flex md:hidden lg:inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 bg-white dark:bg-gray-800 border border-surface-200 dark:border-gray-700 text-content dark:text-white hover:bg-surface-50 dark:hover:bg-gray-700 font-semibold rounded-full transition-all shadow-sm hover:shadow-md group text-sm shrink-0 w-fit"
          >
            Artikel Lainnya <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        {/* ── Mobile Stacking Carousel ── */}
        <div 
          className="relative h-[65vh] min-h-[400px] max-h-[500px] w-full flex md:hidden items-center justify-center overflow-hidden"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEndEvent}
        >
          {latestArticles.map((article, index) => {
            const isActive = index === activeIndex;
            const isPrev = index === activeIndex - 1;
            const isNext = index === activeIndex + 1;
            
            let transformClass = "scale-75 opacity-0 pointer-events-none z-0";
            if (isActive) {
              transformClass = "scale-100 opacity-100 z-30 translate-x-0 pointer-events-auto shadow-2xl";
            } else if (isPrev) {
              transformClass = "scale-90 opacity-70 z-20 -translate-x-[15%] sm:-translate-x-[25%] pointer-events-none shadow-md";
            } else if (isNext) {
              transformClass = "scale-90 opacity-70 z-20 translate-x-[15%] sm:translate-x-[25%] pointer-events-none shadow-md";
            } else if (index < activeIndex - 1) {
              transformClass = "scale-75 opacity-0 z-10 -translate-x-[40%] sm:-translate-x-[50%] pointer-events-none";
            } else if (index > activeIndex + 1) {
              transformClass = "scale-75 opacity-0 z-10 translate-x-[40%] sm:translate-x-[50%] pointer-events-none";
            }

            return (
              <div 
                key={article.id} 
                className={`absolute transition-all duration-500 ease-out w-[85%] max-w-[340px] h-[90%] max-h-[460px] rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden ${transformClass}`}
              >
                <Link to={`/artikel/${article.slug}`} className="relative block w-full h-full group">
                  <div className="absolute inset-0 bg-surface-200 dark:bg-gray-800">
                    {article.thumbnail ? (
                      <img 
                        src={getImageUrl(article.thumbnail)} 
                        alt={article.title} 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-content-muted">
                        <Activity className="w-10 h-10 sm:w-12 sm:h-12 opacity-30" />
                      </div>
                    )}
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent"></div>

                  <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 bg-white/20 dark:bg-gray-900/30 backdrop-blur-xl border border-white/40 dark:border-gray-600/40 shadow-[0_8px_32px_rgba(0,0,0,0.15)] rounded-2xl sm:rounded-3xl p-4 sm:p-5 pt-5 sm:pt-6 flex flex-col h-[160px] sm:h-[180px]">
                    {article.category && (
                      <div className="absolute -top-3 sm:-top-4 left-4 sm:left-6">
                        <span className="inline-block px-3 py-1 sm:py-1.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border border-white/50 dark:border-gray-600/50 text-[10px] sm:text-xs font-bold text-primary-700 dark:text-primary-400 rounded-full shadow-lg">
                          {article.category.name}
                        </span>
                      </div>
                    )}
                    <h3 className="text-base sm:text-lg font-heading font-bold text-white mb-2 line-clamp-2 drop-shadow-sm">
                      {article.title}
                    </h3>
                    <div className="flex items-center text-[10px] sm:text-xs font-medium text-white mt-auto pt-3 border-t border-white/20 dark:border-gray-500/30">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white/20 flex items-center justify-center text-white mr-2 border border-white/30 backdrop-blur-sm">
                        {article.author?.name?.charAt(0) || 'A'}
                      </div>
                      <span className="flex-1 truncate drop-shadow-sm">{article.author?.name || 'Admin'}</span>
                      <span className="mx-1.5 sm:mx-2 text-white/50">•</span>
                      <span className="text-white/80 whitespace-nowrap drop-shadow-sm">
                        {formatDate(article.publishDate || article.createdAt)}
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

        {/* ── Desktop & Tablet Grid Container ── */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6 lg:gap-8">
          {latestArticles.map((article) => (
            <Link 
              key={article.id} 
              to={`/artikel/${article.slug}`} 
              className="relative block h-[400px] lg:h-[460px] rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 group"
            >
              <div className="absolute inset-0 bg-surface-200 dark:bg-gray-800">
                {article.thumbnail ? (
                  <img 
                    src={getImageUrl(article.thumbnail)} 
                    alt={article.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-content-muted">
                    <Activity className="w-12 h-12 opacity-30" />
                  </div>
                )}
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent"></div>

              <div className="absolute bottom-4 left-4 right-4 bg-white/20 dark:bg-gray-900/30 backdrop-blur-xl border border-white/40 dark:border-gray-600/40 shadow-[0_8px_32px_rgba(0,0,0,0.15)] rounded-3xl p-5 lg:p-6 pt-7 lg:pt-8 flex flex-col transition-transform duration-500 ease-out group-hover:-translate-y-2">
                {article.category && (
                  <div className="absolute -top-4 left-6">
                    <span className="inline-block px-4 py-1.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border border-white/50 dark:border-gray-600/50 text-xs font-bold text-primary-700 dark:text-primary-400 rounded-full shadow-lg">
                      {article.category.name}
                    </span>
                  </div>
                )}
                <h3 className="text-lg lg:text-xl font-heading font-bold text-white mb-2 lg:mb-3 line-clamp-2 drop-shadow-sm group-hover:text-primary-200 transition-colors">
                  {article.title}
                </h3>
                <p className="text-sm text-gray-200 line-clamp-2 mb-4 lg:mb-6 leading-relaxed drop-shadow-sm">
                  {article.excerpt}
                </p>
                <div className="flex items-center text-xs lg:text-sm font-medium text-white mt-auto pt-4 border-t border-white/20 dark:border-gray-500/30">
                  <div className="w-6 h-6 lg:w-7 lg:h-7 rounded-full bg-white/20 flex items-center justify-center text-white mr-3 border border-white/30 backdrop-blur-sm">
                    {article.author?.name?.charAt(0) || 'A'}
                  </div>
                  <span className="flex-1 truncate drop-shadow-sm">{article.author?.name || 'Admin'}</span>
                  <span className="mx-2 text-white/50">•</span>
                  <span className="text-white/80 text-xs whitespace-nowrap drop-shadow-sm">
                    {formatDate(article.publishDate || article.createdAt)}
                  </span>
                </div>
              </div>
            </Link>
          ))}

          {/* ── Kartu "Artikel Lainnya" (Khusus Tampilan Tablet) ── */}
          {/* Elemen ini hanya dirender pada breakpoint md, dan disembunyikan pada lg */}
          <Link 
            to="/artikel"
            className="hidden md:flex lg:hidden flex-col items-center justify-center h-[400px] rounded-[2rem] border-2 border-dashed border-surface-300 dark:border-gray-700 bg-surface-50/50 dark:bg-gray-800/50 hover:bg-surface-100 dark:hover:bg-gray-800 transition-all duration-300 group"
          >
            <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <ArrowRight className="w-8 h-8 text-primary-600 dark:text-primary-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <span className="text-xl font-heading font-bold text-content dark:text-white">
              Lihat Artikel Lainnya
            </span>
            <p className="text-sm text-content-muted dark:text-gray-400 mt-2">
              Eksplorasi lebih banyak informasi
            </p>
          </Link>

        </div>
        
      </div>
    </section>
  );
}