import { useParams, Link, useNavigate } from 'react-router-dom';
import { usePublicArticle } from '../../hooks/usePublicData';
import Skeleton from '../../components/ui/Skeleton';
import { getImageUrl, formatDate } from '../../utils/format';
import { ArrowLeft, Tag as TagIcon, Share2, FileText } from 'lucide-react';
import DOMPurify from 'dompurify';

export default function ArticleDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { data: article, isLoading } = usePublicArticle(slug);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  if (isLoading) {
    return (
      <div className="bg-slate-50 dark:bg-slate-900 min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <Skeleton className="h-8 w-24 mb-8" />
          <div className="text-center space-y-4 mb-10">
            <Skeleton className="h-6 w-32 mx-auto" />
            <Skeleton className="h-12 w-3/4 mx-auto" />
            <Skeleton className="h-4 w-48 mx-auto" />
          </div>
          <Skeleton className="w-full aspect-[21/9] rounded-3xl mb-12" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="bg-slate-50 dark:bg-slate-900 min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Artikel tidak ditemukan</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">Artikel yang Anda cari mungkin telah dihapus atau URL salah.</p>
          <button onClick={() => navigate('/artikel')} className="px-6 py-2.5 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors">
            Kembali ke Daftar Artikel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Back Button */}
        <button 
          onClick={() => navigate('/artikel')}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali
        </button>

        <article>
          {/* Article Header */}
          <header className="text-center mb-10">
            {article.category && (
              <Link 
                to={`/artikel?category=${article.category.slug}`}
                className="inline-block px-4 py-1.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 text-sm font-semibold rounded-full mb-6"
              >
                {article.category.name}
              </Link>
            )}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6 leading-tight">
              {article.title}
            </h1>
            
            <div className="flex items-center justify-center gap-4 text-sm text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  {article.author?.avatar ? (
                    <img src={getImageUrl(article.author.avatar)} alt={article.author.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                      {article.author?.name?.charAt(0) || 'U'}
                    </div>
                  )}
                </div>
                <span className="font-medium text-slate-900 dark:text-slate-300">{article.author?.name}</span>
              </div>
              <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
              <span>{formatDate(article.publishDate)}</span>
            </div>
          </header>

          {/* Featured Image */}
          {article.thumbnail && (
            <div className="w-full rounded-3xl overflow-hidden mb-12 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200/50 dark:border-slate-800">
              <img 
                src={getImageUrl(article.thumbnail)} 
                alt={article.title} 
                className="w-full max-h-[500px] object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="prose prose-lg dark:prose-invert prose-emerald max-w-none mb-12"
               dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.content) }} 
          />

          {/* Tags & Share */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 py-6 border-t border-b border-slate-200 dark:border-slate-800 mb-16">
            <div className="flex flex-wrap items-center gap-2">
              <TagIcon className="w-5 h-5 text-slate-400 mr-1" />
              {article.tags?.length > 0 ? (
                article.tags.map((tag) => (
                  <Link 
                    key={tag.id}
                    to={`/artikel?tag=${tag.slug}`}
                    className="px-3 py-1.5 bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-emerald-400 text-sm font-medium rounded-lg transition-colors"
                  >
                    #{tag.name}
                  </Link>
                ))
              ) : (
                <span className="text-sm text-slate-500">Tidak ada tag</span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <Share2 className="w-4 h-4" /> Bagikan:
              </span>
              <a href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} target="_blank" rel="noreferrer" className="w-9 h-9 flex items-center justify-center rounded-full bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2] hover:text-white transition-colors">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${encodeURIComponent(article.title)}`} target="_blank" rel="noreferrer" className="w-9 h-9 flex items-center justify-center rounded-full bg-[#1DA1F2]/10 text-[#1DA1F2] hover:bg-[#1DA1F2] hover:text-white transition-colors">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
              </a>
              <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}`} target="_blank" rel="noreferrer" className="w-9 h-9 flex items-center justify-center rounded-full bg-[#0A66C2]/10 text-[#0A66C2] hover:bg-[#0A66C2] hover:text-white transition-colors">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
            </div>
          </div>
        </article>

        {/* Related Articles */}
        {article.relatedArticles?.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Baca Juga</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {article.relatedArticles.map((related) => (
                <Link key={related.id} to={`/artikel/${related.slug}`} className="group flex flex-col bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all">
                  <div className="relative h-40 overflow-hidden bg-slate-200 dark:bg-slate-800">
                    {related.thumbnail ? (
                      <img src={getImageUrl(related.thumbnail)} alt={related.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400"><FileText className="w-8 h-8 opacity-20" /></div>
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    {related.category && (
                      <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2 uppercase tracking-wider">{related.category.name}</span>
                    )}
                    <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
                      {related.title}
                    </h4>
                    <span className="text-xs text-slate-500 dark:text-slate-400 mt-auto">{formatDate(related.publishDate)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
