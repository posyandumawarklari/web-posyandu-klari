import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { usePublicArticles, usePublicCategories, usePublicTags } from '../../hooks/usePublicData';
import Skeleton from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';
import Pagination from '../../components/ui/Pagination';
import { getImageUrl, formatDate } from '../../utils/format';
import { Search, FileText, ArrowUpRight, MoreHorizontal, BadgeCheck, Bell } from 'lucide-react';
import { useDebounce } from 'use-debounce';

export default function ArticlesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const initialSearch = searchParams.get('search') || '';
  const categoryFilter = searchParams.get('category') || '';
  const tagFilter = searchParams.get('tag') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [debouncedSearch] = useDebounce(searchTerm, 500);

  // Sync state to URL when filters change
  const updateParams = (updates) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });
    setSearchParams(newParams);
  };

  const { data: articlesData, isLoading: articlesLoading } = usePublicArticles({
    page,
    limit: 6,
    search: debouncedSearch,
    category: categoryFilter,
    tag: tagFilter,
  });

  const { data: categories } = usePublicCategories();
  const { data: tags } = usePublicTags();

  // Format tanggal hari ini untuk header (Mirip "May, 10 2025" di gambar)
  const today = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="relative min-h-screen bg-surface-50 dark:bg-gray-900 overflow-hidden pt-24 pb-16">
      
      {/* ── Background Blobs untuk Menghidupkan Glassmorphism ── */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[500px] bg-primary-200/40 dark:bg-primary-900/20 blur-[100px] rounded-full mix-blend-multiply dark:mix-blend-overlay pointer-events-none -z-10"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-300/20 dark:bg-primary-800/20 blur-[80px] rounded-full pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ── Header Section (Mirip Screen 1 Kiri Atas) ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8 mt-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-content dark:text-white tracking-tight">
            Indeks Artikel
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Search Input dengan Glassmorphism */}
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-content-muted" />
              <input
                type="text"
                placeholder="Cari artikel..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  updateParams({ search: e.target.value, page: 1 });
                }}
                className="w-full pl-10 pr-4 py-3 bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border border-white/60 dark:border-gray-600/50 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-shadow shadow-sm placeholder:text-slate-400 dark:placeholder:text-gray-500 text-content dark:text-white"
              />
            </div>
            
            {/* Tombol Search (Pengganti Bell) */}
            <button className="w-11 h-11 shrink-0 bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border border-white/60 dark:border-gray-600/50 rounded-full flex items-center justify-center shadow-sm hover:bg-white/60 transition-colors">
              <Search className="w-5 h-5 text-content dark:text-white" />
            </button>
          </div>
        </div>

        {/* ── Kategori Horizontal (Mirip Screen 1 "All News", "Sports", dll) ── */}
        <div className="mb-4">
          <div className="flex overflow-x-auto gap-3 pb-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <button
              onClick={() => updateParams({ category: '', page: 1 })}
              className={`snap-start shrink-0 px-6 py-2.5 rounded-full text-sm font-semibold transition-all shadow-sm border ${
                !categoryFilter 
                  ? 'bg-content dark:bg-white text-white dark:text-gray-900 border-transparent' 
                  : 'bg-white/50 dark:bg-gray-800/50 backdrop-blur-md border-white/60 dark:border-gray-600/50 text-content-muted dark:text-gray-300 hover:bg-white/80'
              }`}
            >
              Semua Topik
            </button>
            {categories?.map((cat) => (
              <button
                key={cat.id}
                onClick={() => updateParams({ category: cat.slug, page: 1 })}
                className={`snap-start shrink-0 px-6 py-2.5 rounded-full text-sm font-semibold transition-all shadow-sm border ${
                  categoryFilter === cat.slug
                    ? 'bg-content dark:bg-white text-white dark:text-gray-900 border-transparent' 
                    : 'bg-white/50 dark:bg-gray-800/50 backdrop-blur-md border-white/60 dark:border-gray-600/50 text-content-muted dark:text-gray-300 hover:bg-white/80'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* ── Tag Populer Horizontal (Ukuran Lebih Kecil) ── */}
        {tags && tags.length > 0 && (
          <div className="mb-10">
            <div className="flex overflow-x-auto gap-2 pb-2 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {tags.map((t) => (
                <button
                  key={t.id}
                  onClick={() => updateParams({ tag: tagFilter === t.slug ? '' : t.slug, page: 1 })}
                  className={`snap-start shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-all border ${
                    tagFilter === t.slug
                      ? 'bg-primary-100 text-primary-800 dark:bg-primary-900/40 dark:text-primary-300 border-primary-200 dark:border-primary-800/50'
                      : 'bg-transparent text-content-muted dark:text-gray-400 border-surface-200 dark:border-gray-700 hover:bg-white/50 dark:hover:bg-gray-800/50'
                  }`}
                >
                  #{t.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Main Grid (Mirip Layout Tengah Gambar) ── */}
        {articlesLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border border-white/60 dark:border-gray-700/50 rounded-[2rem] p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div>
                    <Skeleton className="h-4 w-24 mb-2 rounded" />
                    <Skeleton className="h-3 w-16 rounded" />
                  </div>
                </div>
                <Skeleton className="h-6 w-3/4 mb-3 rounded" />
                <Skeleton className="h-6 w-1/2 mb-5 rounded" />
                <Skeleton className="h-48 w-full rounded-[1.5rem]" />
              </div>
            ))}
          </div>
        ) : !articlesData?.data || articlesData.data.length === 0 ? (
          <EmptyState 
            icon={FileText} 
            title="Artikel tidak ditemukan" 
            description="Cobalah gunakan kata kunci lain atau hapus filter yang sedang aktif." 
          />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {articlesData.data.map((article) => (
                <Link 
                  key={article.id} 
                  to={`/artikel/${article.slug}`} 
                  // Struktur Kartu Glassmorphism (Mengikuti susunan gambar referensi)
                  className="group flex flex-col bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl rounded-[2rem] p-4 sm:p-5 border border-white/60 dark:border-gray-600/40 shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-xl hover:-translate-y-1 hover:bg-white/60 dark:hover:bg-gray-800/60 transition-all duration-300 relative"
                >
                  {/* Bagian Atas: Author & Waktu */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-surface-200 dark:bg-gray-700 overflow-hidden border-2 border-white dark:border-gray-800 shadow-sm">
                        {article.author?.avatar ? (
                          <img src={getImageUrl(article.author.avatar)} alt={article.author.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full text-primary-800 dark:text-primary-300 flex items-center justify-center text-sm font-bold bg-primary-100 dark:bg-primary-900/50">
                            {article.author?.name?.charAt(0) || 'U'}
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-content dark:text-white flex items-center gap-1">
                          {article.author?.name || 'Admin'}
                          <BadgeCheck className="w-4 h-4 text-blue-500" />
                        </h4>
                        <p className="text-xs font-medium text-content-muted dark:text-gray-400">
                          {formatDate(article.publishDate)}
                        </p>
                      </div>
                    </div>
                    {/* Ikon 3 titik (Menu) */}
                    <button className="w-8 h-8 rounded-full flex items-center justify-center text-content-muted hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Bagian Tengah: Judul Artikel & Excerpt */}
                  <h3 className="text-xl md:text-2xl font-heading font-bold text-content dark:text-white mb-2 line-clamp-2 leading-tight group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors">
                    {article.title}
                  </h3>
                  
                  {/* Tambahan Excerpt di sini */}
                  <p className="text-sm text-content-muted dark:text-gray-500 line-clamp-2 mb-4 leading-relaxed">
                    {article.excerpt}
                  </p>

                  {/* Bagian Bawah: Gambar Utama (Full melengkung) */}
                  <div className="relative w-full aspect-[4/3] sm:aspect-video md:aspect-[4/3] rounded-[1.5rem] overflow-hidden bg-surface-200 dark:bg-gray-700 mt-auto shadow-sm">
                    {article.thumbnail ? (
                      <img src={getImageUrl(article.thumbnail)} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-content-muted">
                        <FileText className="w-12 h-12 opacity-20" />
                      </div>
                    )}
                    
                    {/* Kategori Badge Melayang di Dalam Gambar */}
                    {article.category && (
                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-1.5 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-white/50 dark:border-gray-600/50 text-[10px] font-bold text-content dark:text-white rounded-full shadow-sm uppercase tracking-wider">
                          {article.category.name}
                        </span>
                      </div>
                    )}

                    {/* Tombol Share / View */}
                    <div className="absolute bottom-3 right-3 w-9 h-9 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-white/50 dark:border-gray-600/50 rounded-full flex items-center justify-center shadow-sm text-content dark:text-white group-hover:bg-primary-500 group-hover:text-white group-hover:border-primary-500 transition-all">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>

                </Link>
              ))}
            </div>

            {/* Pagination */}
            {articlesData.meta.totalPages > 1 && (
              <div className="mt-16 flex justify-center relative z-10">
                <Pagination 
                  currentPage={articlesData.meta.page}
                  totalPages={articlesData.meta.totalPages}
                  onPageChange={(p) => updateParams({ page: p })}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}