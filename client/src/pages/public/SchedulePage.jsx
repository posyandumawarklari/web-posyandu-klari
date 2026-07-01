import { usePublicSchedules } from '../../hooks/usePublicData';
import Skeleton from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';
import { formatDate } from '../../utils/format';
import { Calendar, MapPin, Clock } from 'lucide-react';

export default function SchedulePage() {
  const { data: schedules, isLoading } = usePublicSchedules();

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-6 rotate-3">
            <Calendar className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            Jadwal Kegiatan
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Daftar jadwal kegiatan posyandu terdekat. Catat waktu dan lokasinya agar Anda tidak terlewat.
          </p>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700">
                <Skeleton className="h-8 w-3/4 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-1/2 mb-6" />
                <div className="space-y-3">
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-5 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : !schedules || schedules.length === 0 ? (
          <EmptyState 
            icon={Calendar} 
            title="Belum ada jadwal" 
            description="Tidak ada jadwal kegiatan posyandu dalam waktu dekat." 
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schedules.map((schedule) => (
              <div 
                key={schedule.id} 
                className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 relative overflow-hidden group hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-md transition-all"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 dark:bg-emerald-900/10 rounded-bl-[100px] -z-0 transition-colors group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/20" />
                
                <div className="relative z-10">
                  <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-400 text-xs font-semibold rounded-full mb-4">
                    {formatDate(schedule.date)}
                  </span>
                  
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    {schedule.activityName}
                  </h3>
                  
                  {schedule.description && (
                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 line-clamp-2">
                      {schedule.description}
                    </p>
                  )}
                  
                  <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-700/50">
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-emerald-500 shrink-0" />
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider mb-0.5">Waktu</p>
                        <p className="text-sm text-slate-900 dark:text-slate-300 font-medium">{schedule.startTime} - {schedule.endTime}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-emerald-500 shrink-0" />
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider mb-0.5">Lokasi</p>
                        <p className="text-sm text-slate-900 dark:text-slate-300 font-medium">{schedule.location}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
