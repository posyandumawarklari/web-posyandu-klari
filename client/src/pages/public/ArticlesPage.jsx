import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { usePublicArticles, usePublicCategories, usePublicTags } from '../../hooks/usePublicData';
import Skeleton from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';
import Pagination from '../../components/ui/Pagination';
import Input from '../../components/ui/Input';
import { getImageUrl, formatDate } from '../../utils/format';
import { Search, FileText, ArrowRight, Tag, Folder } from 'lucide-react';
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

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            Artikel & Edukasi
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Dapatkan informasi terbaru dan tips kesehatan seputar ibu hamil, bayi, dan balita langsung dari pakarnya.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Main Content (Articles Grid) */}
          <div className="w-full lg:w-2/3 xl:w-3/4 order-2 lg:order-1">
            
            {/* Search Mobile (Visible only on small screens) */}
            <div className="lg:hidden mb-6">
              <Input
                placeholder="Cari artikel..."
                leftIcon={<Search className="w-4 h-4" />}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  updateParams({ search: e.target.value, page: 1 });
                }}
              />
            </div>

            {/* Loading State */}
            {articlesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700">
                    <Skeleton className="h-48 w-full rounded-none" />
                    <div className="p-6">
                      <Skeleton className="h-4 w-1/4 mb-4" />
                      <Skeleton className="h-6 w-full mb-2" />
                      <Skeleton className="h-6 w-3/4 mb-4" />
                      <Skeleton className="h-4 w-full mb-1" />
                      <Skeleton className="h-4 w-full mb-1" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {articlesData.data.map((article) => (
                    <Link key={article.id} to={`/artikel/${article.slug}`} className="group flex flex-col bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all">
                      <div className="relative h-56 overflow-hidden bg-slate-200 dark:bg-slate-800">
                        {article.thumbnail ? (
                          <img src={getImageUrl(article.thumbnail)} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400"><FileText className="w-10 h-10 opacity-20" /></div>
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
                        <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-3 mb-6 flex-1 leading-relaxed">
                          {article.excerpt}
                        </p>
                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 dark:border-slate-700/50">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                              {article.author?.avatar ? (
                                <img src={getImageUrl(article.author.avatar)} alt={article.author.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px] font-bold">
                                  {article.author?.name?.charAt(0) || 'U'}
                                </div>
                              )}
                            </div>
                            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{formatDate(article.publishDate)}</span>
                          </div>
                          <span className="text-emerald-600 dark:text-emerald-400 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                            Baca <ArrowRight className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {articlesData.meta.totalPages > 1 && (
                  <div className="mt-12 flex justify-center">
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

          {/* Sidebar (Filters) */}
          <div className="w-full lg:w-1/3 xl:w-1/4 order-1 lg:order-2 space-y-8">
            
            {/* Search (Desktop) */}
            <div className="hidden lg:block bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Search className="w-4 h-4 text-emerald-500" /> Pencarian
              </h3>
              <Input
                placeholder="Cari artikel..."
                leftIcon={<Search className="w-4 h-4" />}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  updateParams({ search: e.target.value, page: 1 });
                }}
              />
            </div>

            {/* Categories */}
            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <Folder className="w-4 h-4 text-emerald-500" /> Kategori
                </h3>
                {categoryFilter && (
                  <button 
                    onClick={() => updateParams({ category: '', page: 1 })}
                    className="text-xs text-slate-400 hover:text-red-500 transition-colors"
                  >
                    Reset
                  </button>
                )}
              </div>
              <ul className="space-y-2">
                {categories?.map((cat) => (
                  <li key={cat.id}>
                    <button
                      onClick={() => updateParams({ category: cat.slug, page: 1 })}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        categoryFilter === cat.slug
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 font-medium'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tags */}
            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <Tag className="w-4 h-4 text-emerald-500" /> Tag Populer
                </h3>
                {tagFilter && (
                  <button 
                    onClick={() => updateParams({ tag: '', page: 1 })}
                    className="text-xs text-slate-400 hover:text-red-500 transition-colors"
                  >
                    Reset
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {tags?.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => updateParams({ tag: t.slug, page: 1 })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      tagFilter === t.slug
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
                    }`}
                  >
                    #{t.name}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
