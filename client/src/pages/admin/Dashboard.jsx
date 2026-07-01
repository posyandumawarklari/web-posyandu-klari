import { useDashboardStats } from '../../hooks/useAdminData';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Skeleton from '../../components/ui/Skeleton';
import { Users, FileText, Calendar, Image as ImageIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { formatDate } from '../../utils/format';

export default function Dashboard() {
  const { data, isLoading } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard Overview</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-2xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-96 rounded-2xl" />
          <Skeleton className="h-96 rounded-2xl" />
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
      color: 'bg-blue-500',
    },
    {
      title: 'Kategori Aktif',
      value: stats?.totalCategories || 0,
      icon: TrendingUp,
      trend: '+3',
      trendUp: true,
      color: 'bg-emerald-500',
    },
    {
      title: 'Kegiatan Bulan Ini',
      value: stats?.totalSchedules || 0,
      icon: Calendar,
      trend: '-1',
      trendUp: false,
      color: 'bg-orange-500',
    },
    {
      title: 'Foto Galeri',
      value: stats?.totalGallery || 0,
      icon: ImageIcon,
      trend: '+8',
      trendUp: true,
      color: 'bg-purple-500',
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard Overview</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Ringkasan aktivitas dan data sistem posyandu Anda.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="border-none shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${stat.color} shadow-lg shadow-${stat.color.split('-')[1]}-500/30`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${stat.trendUp ? 'text-emerald-500' : 'text-red-500'}`}>
                  {stat.trendUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  {stat.trend}
                </div>
              </div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.title}</p>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{stat.value}</h3>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Articles */}
        <Card className="shadow-sm border-slate-200 dark:border-slate-700/50">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800">
            <CardTitle className="text-lg">Artikel Terakhir Dibuat</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {recentArticles?.length > 0 ? (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentArticles.map(article => (
                  <div key={article.id} className="p-4 sm:p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white text-sm line-clamp-1">{article.title}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{formatDate(article.createdAt)} • By {article.author?.name || 'Admin'}</p>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      article.status === 'PUBLISHED' 
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}>
                      {article.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 dark:text-slate-400 text-sm">
                Belum ada artikel yang ditulis.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Schedules */}
        <Card className="shadow-sm border-slate-200 dark:border-slate-700/50">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800">
            <CardTitle className="text-lg">Jadwal Mendatang</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {recentSchedules?.length > 0 ? (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentSchedules.map(schedule => (
                  <div key={schedule.id} className="p-4 sm:p-6 flex items-start gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div className="w-12 h-14 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden shrink-0">
                      <div className="bg-red-500 text-white text-[10px] font-bold text-center py-0.5 uppercase tracking-wider">
                        {new Date(schedule.date).toLocaleDateString('id-ID', { month: 'short' })}
                      </div>
                      <div className="bg-white dark:bg-slate-900 flex-1 flex items-center justify-center text-lg font-bold text-slate-900 dark:text-white">
                        {new Date(schedule.date).getDate()}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">{schedule.activityName}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 line-clamp-1">{schedule.location}</p>
                      <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                        <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                          <span className="w-2 h-2 rounded-full bg-emerald-500"></span> {schedule.time}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 dark:text-slate-400 text-sm">
                Tidak ada jadwal kegiatan mendatang.
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
