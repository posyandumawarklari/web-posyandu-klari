import { useParams, Link, useNavigate } from 'react-router-dom';
import { usePublicArticle } from '../../hooks/usePublicData';
import Skeleton from '../../components/ui/Skeleton';
import { getImageUrl, formatDate } from '../../utils/format';
import { ArrowLeft, Share2, FileText, MoreHorizontal, BadgeCheck, ChevronRight } from 'lucide-react';
import DOMPurify from 'dompurify';

export default function ArticleDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { data: article, isLoading } = usePublicArticle(slug);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  // ── LOADING STATE ──
  if (isLoading) {
    return (
      <div className="bg-surface-50 dark:bg-gray-900 min-h-screen pb-16">
        <Skeleton className="w-full h-[400px] md:h-[500px] rounded-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative -mt-12 md:-mt-24 z-20">
          <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-6 sm:p-10 shadow-soft border border-surface-100 dark:border-gray-700">
            <div className="flex justify-between items-center mb-8">
              <div className="flex gap-3"><Skeleton className="w-12 h-12 rounded-full" /><Skeleton className="w-32 h-5 mt-3 rounded" /></div>
              <Skeleton className="w-10 h-10 rounded-full" />
            </div>
            <Skeleton className="h-10 w-full mb-3 rounded" />
            <Skeleton className="h-10 w-3/4 mb-8 rounded" />
            <Skeleton className="h-4 w-32 mb-8 rounded" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-5/6 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── ERROR / NOT FOUND STATE ──
  if (!article) {
    return (
      <div className="bg-surface-50 dark:bg-gray-900 min-h-screen flex items-center justify-center p-4 pt-24">
        <div className="text-center bg-white dark:bg-gray-800 p-10 rounded-[2rem] shadow-soft max-w-md w-full border border-surface-200 dark:border-gray-700">
          <h2 className="text-2xl font-heading font-bold text-content dark:text-white mb-3">Artikel tidak ditemukan</h2>
          <p className="text-content-muted dark:text-gray-400 mb-8 font-medium">Artikel yang Anda cari mungkin telah dihapus atau URL salah.</p>
          <button onClick={() => navigate('/artikel')} className="px-8 py-3.5 bg-primary-800 text-white font-medium rounded-xl hover:bg-primary-900 transition-all shadow-sm hover:shadow-soft w-full">
            Kembali ke Daftar Artikel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-50 dark:bg-gray-900 min-h-screen pb-16 relative">
      
      {/* ── 1. Hero Image / Background Area ── */}
      <div className="relative w-full h-[400px] md:h-[500px] bg-surface-200 dark:bg-gray-800">
        {article.thumbnail ? (
          <img 
            src={getImageUrl(article.thumbnail)} 
            alt={article.title} 
            className="w-full h-full object-cover"
           onError={(e) => { e.target.onerror = null; e.target.src="/placeholder-image.jpg"; }} />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FileText className="w-20 h-20 text-surface-400 dark:text-gray-600 opacity-30" />
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/10"></div>

        <div className="absolute top-0 inset-x-0 pt-24 md:pt-28 px-4 sm:px-6 md:px-10 flex justify-between items-center z-10 max-w-7xl mx-auto">
          <button 
            onClick={() => navigate('/artikel')}
            className="w-11 h-11 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 flex items-center justify-center text-white transition-all shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <span className="text-white font-semibold tracking-wide drop-shadow-md text-sm md:text-base">
            {article.category?.name || 'Artikel Edukasi'}
          </span>
          
          <button className="w-11 h-11 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 flex items-center justify-center text-white transition-all shadow-sm">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* ── 2. Main Content Card ── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative -mt-16 md:-mt-24 z-20">
        {/* Tambahkan overflow-hidden disini agar tidak ada apapun yang keluar dari kotak putih */}
        <div className="bg-white/85 dark:bg-gray-900/85 backdrop-blur-xl border border-white/50 dark:border-gray-700/50 rounded-[2.5rem] lg:rounded-[3rem] p-6 sm:p-10 lg:p-12 shadow-2xl overflow-hidden">
          
          {/* Author Info & Share Row */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden border-2 border-white dark:border-gray-700 shadow-sm bg-primary-50 dark:bg-gray-800">
                {article.author?.avatar ? (
                  <img src={getImageUrl(article.author.avatar)} alt={article.author.name} className="w-full h-full object-cover"  onError={(e) => { e.target.onerror = null; e.target.src="/placeholder-image.jpg"; }} />
                ) : (
                  <div className="w-full h-full text-primary-800 flex items-center justify-center font-bold text-lg">
                    {article.author?.name?.charAt(0) || 'U'}
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-bold text-content dark:text-white flex items-center gap-1 text-base md:text-lg">
                  {article.author?.name || 'Tim Redaksi'}
                  <BadgeCheck className="w-4 h-4 text-blue-500" />
                </h3>
                <span className="text-xs md:text-sm font-medium text-content-muted dark:text-gray-400">
                  {formatDate(article.publishDate)}
                </span>
              </div>
            </div>
            
            <button className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-surface-200 dark:border-gray-600 flex items-center justify-center text-content hover:bg-surface-100 dark:text-white dark:hover:bg-gray-700 transition-colors shadow-sm shrink-0">
              <Share2 className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>

          {/* Judul Artikel */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-extrabold text-content dark:text-white tracking-tight mb-8 leading-[1.2]">
            {article.title}
          </h1>

          {/* Info Row (Kategori) */}
          <div className="flex items-center gap-3 py-4 border-t border-b border-surface-200/50 dark:border-gray-700/50 mb-10 text-sm font-semibold text-content dark:text-gray-200">
            <span className="px-4 py-1.5 bg-primary-50 text-primary-800 dark:bg-primary-900/30 dark:text-primary-400 rounded-full border border-primary-100 dark:border-primary-800/50">
              {article.category?.name || 'Edukasi Kesehatan'}
            </span>
          </div>

          {/* Isi Konten Artikel (Area yang Diperbaiki) */}
          <div 
            className="
              prose
              prose-lg
              md:prose-xl
              max-w-none
              w-full
              overflow-x-hidden
              mb-16

              whitespace-normal
              break-normal

              dark:prose-invert

              prose-p:text-gray-700
              dark:prose-p:text-gray-200
              prose-p:mb-6
              prose-p:leading-8

              prose-headings:text-gray-900
              dark:prose-headings:text-white
              prose-headings:mt-10
              prose-headings:mb-5
              prose-headings:font-heading 
              prose-headings:font-bold

              prose-strong:text-gray-900
              dark:prose-strong:text-white

              prose-blockquote:text-gray-700
              dark:prose-blockquote:text-gray-300
              prose-blockquote:my-8

              prose-code:text-pink-600
              dark:prose-code:text-pink-400

              prose-ul:list-disc
              prose-ol:list-decimal
              prose-ul:pl-6
              prose-ol:pl-6
              prose-ul:my-6
              prose-ol:my-6
              prose-li:my-2
              prose-li:marker:text-primary-600
              dark:prose-li:marker:text-primary-400

              prose-img:my-8
              prose-img:rounded-2xl

              prose-a:text-primary-800
              dark:prose-a:text-primary-400
              prose-a:no-underline
              hover:prose-a:underline
            "
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.content) }} 
          />

          {/* ── 3. Footer Artikel (Tags & Social Share) ── */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-6 border-t border-surface-200/50 dark:border-gray-700/50 mt-10">
            <div className="flex flex-wrap gap-2">
              {article.tags?.length > 0 ? (
                article.tags.map((tag) => (
                  <Link 
                    key={tag.id}
                    to={`/artikel?tag=${tag.slug}`}
                    className="px-4 py-2 bg-surface-100/50 text-content-muted hover:bg-primary-50 hover:text-primary-800 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-primary-400 text-xs font-semibold rounded-lg transition-all"
                  >
                    #{tag.name}
                  </Link>
                ))
              ) : null}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-content-muted dark:text-gray-400">Bagikan:</span>
              <div className="flex gap-2">
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} target="_blank" rel="noreferrer" className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2] hover:text-white transition-all shadow-sm">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${encodeURIComponent(article.title)}`} target="_blank" rel="noreferrer" className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1DA1F2]/10 text-[#1DA1F2] hover:bg-[#1DA1F2] hover:text-white transition-all shadow-sm">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                </a>
              </div>
            </div>
            
          </div>
        </div>
      </div>

      {/* ── 4. Related Articles (Bentuk List Tombol) ── */}
      {article.relatedArticles?.length > 0 && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-12 md:mt-16 relative z-20">
          <h3 className="text-xl md:text-2xl font-heading font-bold text-content dark:text-white mb-6 pl-2">
            Baca Juga
          </h3>
          
          <div className="flex flex-col gap-3 md:gap-4">
            {article.relatedArticles.map((related) => (
              <Link 
                key={related.id} 
                to={`/artikel/${related.slug}`} 
                className="group flex items-center justify-between p-4 md:p-5 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl border border-surface-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-primary-400 dark:hover:border-primary-600 hover:bg-white dark:hover:bg-gray-800 transition-all duration-300"
              >
                {/* Bagian Kiri: Teks */}
                <div className="flex flex-col pr-4">
                  {related.category && (
                    <span className="text-xs uppercase font-bold text-primary-700 dark:text-primary-400 mb-1 tracking-wider">
                      {related.category.name}
                    </span>
                  )}
                  <h4 className="text-base md:text-lg font-bold text-content dark:text-white group-hover:text-primary-800 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                    {related.title}
                  </h4>
                </div>

                {/* Bagian Kanan: Icon Panah */}
                <div className="w-10 h-10 shrink-0 rounded-full bg-surface-100 dark:bg-gray-700 flex items-center justify-center text-content-muted group-hover:bg-primary-100 group-hover:text-primary-800 dark:group-hover:bg-primary-900/40 dark:group-hover:text-primary-400 transition-colors">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}