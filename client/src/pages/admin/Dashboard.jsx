import { useDashboardStats } from '../../hooks/useAdminData';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Skeleton from '../../components/ui/Skeleton';
import { Users, FileText, Calendar, Image as ImageIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { formatDate } from '../../utils/format';

export default function Dashboard() {
  const { data, isLoading } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-heading font-bold text-content dark:text-white">Dashboard Overview</h1>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-40 rounded-2xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Skeleton className="h-[400px] rounded-2xl" />
          <Skeleton className="h-[400px] rounded-2xl" />
        </div>
      </div>
    );
  }

  const { stats, recentArticles, recentSchedules } = data || {};

    const statCards = [
    {
      title: 'Total Artikel',
      value: stats?.totalArticles || 0,
      icon: FileText,
      trend: '+12%', // Static for visual purposes, backend can be enhanced later
      trendUp: true,
      color: 'bg-primary-800',
    },
    {
      title: 'Kategori Aktif',
      value: stats?.totalCategories || 0,
      icon: TrendingUp,
      trend: '+3',
      trendUp: true,
      color: 'bg-emerald-600',
    },
    {
      title: 'Kegiatan Bulan Ini',
      value: stats?.totalSchedules || 0,
      icon: Calendar,
      trend: '-1',
      trendUp: false,
      color: 'bg-amber-500',
    },
    {
      title: 'Foto Galeri',
      value: stats?.totalGallery || 0,
      icon: ImageIcon,
      trend: '+8',
      trendUp: true,
      color: 'bg-indigo-600',
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-content dark:text-white tracking-tight">Dashboard Overview</h1>
          <p className="text-base text-content-muted dark:text-gray-400 mt-2 font-medium">Ringkasan aktivitas dan data sistem posyandu Anda.</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="border-none shadow-soft-xl hover:shadow-soft-2xl transition-all duration-300 rounded-2xl bg-white dark:bg-gray-800 overflow-hidden relative group">
            <div className={`absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-10 transition-transform duration-500 group-hover:scale-110 ${stat.color}`}></div>
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-sm ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className={`flex items-center gap-1.5 text-sm font-bold px-3 py-1.5 rounded-full ${stat.trendUp ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400'}`}>
                  {stat.trendUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  {stat.trend}
                </div>
              </div>
              <p className="text-sm font-semibold text-content-muted dark:text-gray-400 mb-1 uppercase tracking-wide">{stat.title}</p>
              <h3 className="text-4xl font-heading font-bold text-content dark:text-white">{stat.value}</h3>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Articles */}
        <Card className="border-none shadow-soft-xl rounded-2xl bg-white dark:bg-gray-800 overflow-hidden">
          <CardHeader className="border-b border-surface-100 dark:border-gray-700 bg-surface-50/50 dark:bg-gray-800/50 py-5">
            <CardTitle className="text-xl font-heading font-bold text-content dark:text-white">Artikel Terakhir Dibuat</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {recentArticles?.length > 0 ? (
              <div className="divide-y divide-surface-100 dark:divide-gray-700">
                {recentArticles.map(article => (
                  <div key={article.id} className="p-5 flex items-center justify-between hover:bg-surface-50 dark:hover:bg-gray-700/50 transition-colors group">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-gray-700 text-primary-800 dark:text-primary-400 flex items-center justify-center shrink-0 shadow-sm border border-primary-100 dark:border-gray-600 group-hover:bg-primary-800 group-hover:text-white transition-colors">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-content dark:text-white text-base line-clamp-1 group-hover:text-primary-800 dark:group-hover:text-primary-400 transition-colors">{article.title}</h4>
                        <p className="text-sm font-medium text-content-muted dark:text-gray-400 mt-1">{formatDate(article.createdAt)} • By <span className="text-content dark:text-gray-300">{article.author?.name || 'Admin'}</span></p>
                      </div>
                    </div>
                    <span className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider ${
                      article.status === 'PUBLISHED' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/50'
                        : 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800/50'
                    }`}>
                      {article.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-10 text-center">
                <div className="w-16 h-16 bg-surface-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-content-muted dark:text-gray-500" />
                </div>
                <p className="text-base font-medium text-content-muted dark:text-gray-400">Belum ada artikel yang ditulis.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Schedules */}
        <Card className="border-none shadow-soft-xl rounded-2xl bg-white dark:bg-gray-800 overflow-hidden">
          <CardHeader className="border-b border-surface-100 dark:border-gray-700 bg-surface-50/50 dark:bg-gray-800/50 py-5">
            <CardTitle className="text-xl font-heading font-bold text-content dark:text-white">Jadwal Mendatang</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {recentSchedules?.length > 0 ? (
              <div className="divide-y divide-surface-100 dark:divide-gray-700">
                {recentSchedules.map(schedule => (
                  <div key={schedule.id} className="p-5 flex items-start gap-5 hover:bg-surface-50 dark:hover:bg-gray-700/50 transition-colors group">
                    <div className="w-14 h-16 rounded-xl border border-surface-200 dark:border-gray-700 flex flex-col overflow-hidden shrink-0 shadow-sm group-hover:border-primary-300 transition-colors">
                      <div className="bg-primary-800 text-white text-[10px] font-bold text-center py-1 uppercase tracking-widest">
                        {new Date(schedule.date).toLocaleDateString('id-ID', { month: 'short' })}
                      </div>
                      <div className="bg-white dark:bg-gray-800 flex-1 flex items-center justify-center text-xl font-heading font-bold text-content dark:text-white">
                        {new Date(schedule.date).getDate()}
                      </div>
                    </div>
                    <div className="flex-1 pt-1">
                      <h4 className="font-bold text-content dark:text-white text-base mb-1.5 group-hover:text-primary-800 dark:group-hover:text-primary-400 transition-colors">{schedule.activityName}</h4>
                      <p className="text-sm font-medium text-content-muted dark:text-gray-400 mb-3 line-clamp-1">{schedule.location}</p>
                      <div className="flex items-center gap-2 text-xs font-bold text-content dark:text-gray-300">
                        <span className="flex items-center gap-2 bg-surface-100 dark:bg-gray-700 px-3 py-1.5 rounded-lg border border-surface-200 dark:border-gray-600">
                          <span className="w-2 h-2 rounded-full bg-primary-600"></span> {schedule.time}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-10 text-center">
                <div className="w-16 h-16 bg-surface-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-content-muted dark:text-gray-500" />
                </div>
                <p className="text-base font-medium text-content-muted dark:text-gray-400">Tidak ada jadwal kegiatan mendatang.</p>
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
