import { useState, useMemo } from 'react';
import { usePublicSchedules } from '../../hooks/usePublicData';
import Skeleton from '../../components/ui/Skeleton';
import { formatDate } from '../../utils/format';
import { 
  Calendar, MapPin, Clock, MoreHorizontal, X, 
  ChevronLeft, ChevronRight 
} from 'lucide-react';

export default function CalendarOnly() {
  const { data: schedules, isLoading } = usePublicSchedules();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  // Logic Kalender Dinamis
  const { daysArray, currentMonthSchedules, monthLabel } = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Label Bulan
    const monthLabel = currentDate.toLocaleString('id-ID', { month: 'long', year: 'numeric' });

    // Filter jadwal khusus untuk bulan dan tahun yang sedang aktif
    const currentMonthSchedules = (schedules || []).filter(schedule => {
      const d = new Date(schedule.date);
      return d.getMonth() === month && d.getFullYear() === year;
    });

    // Menghitung grid kalender
    const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Minggu
    const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; // Ubah agar Senin jadi hari pertama (0)
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Menghitung total slot (dinamis: 35 kotak atau 42 kotak)
    const totalSlots = Math.ceil((startOffset + daysInMonth) / 7) * 7;
    
    const daysArray = Array.from({ length: totalSlots }, (_, i) => {
      const dayNum = i - startOffset + 1;
      if (dayNum > 0 && dayNum <= daysInMonth) {
        return dayNum;
      }
      return null;
    });

    return { daysArray, currentMonthSchedules, monthLabel };
  }, [currentDate, schedules]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    setSelectedSchedule(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    setSelectedSchedule(null);
  };

  return (
    // mt-24 / lg:mt-32 untuk memberi jarak dari navbar
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 mt-24 lg:mt-32 font-sans relative z-10">

      {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold text-content dark:text-white tracking-tight mb-4 md:mb-6">
            Jadwal Posyandu
          </h1>
          <p className="text-base sm:text-lg text-content-muted dark:text-gray-400 font-medium px-2">
            Berikut adalah jadwal pelayanan dan kegiatan posyandu yang kami selenggarakan secara rutin untuk meningkatkan kualitas kesehatan masyarakat.
          </p>
        </div>
      
      {/* Calendar Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <button onClick={handlePrevMonth} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-gray-800 text-slate-400 hover:text-slate-700 dark:hover:text-gray-200 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white capitalize w-48 text-center">
            {monthLabel}
          </h2>
          <button onClick={handleNextMonth} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-gray-800 text-slate-400 hover:text-slate-700 dark:hover:text-gray-200 transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Calendar Grid Container (Tanpa pemaksaan tinggi min-h) */}
      <div className="w-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm overflow-x-auto flex flex-col">
        <div className="min-w-[700px] flex flex-col">
          {/* Calendar Header (Hari) */}
          <div className="grid grid-cols-7 border-b border-gray-100 dark:border-gray-800 bg-slate-50/50 dark:bg-gray-800/50">
            {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map((day) => (
              <div key={day} className="py-3 text-center text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Body (Tanpa pemaksaan grid-rows) */}
          <div className="flex-1 grid grid-cols-7 bg-gray-100 dark:bg-gray-800 gap-[1px]">
            {isLoading ? (
              Array.from({ length: 35 }).map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-900 p-2 min-h-[100px]">
                  <Skeleton className="w-full h-full rounded bg-slate-50" />
                </div>
              ))
            ) : (
              daysArray.map((day, index) => {
                const daySchedules = day ? currentMonthSchedules.filter(s => new Date(s.date).getDate() === day) : [];
                const isToday = day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth() && currentDate.getFullYear() === new Date().getFullYear();

                return (
                  <div 
                    key={index} 
                    className={`bg-white dark:bg-gray-900 p-1 sm:p-2.5 min-h-[80px] md:min-h-[100px] flex flex-col gap-1 transition-colors ${!day ? 'bg-slate-50/30 dark:bg-gray-900/30 text-transparent' : 'text-slate-700 dark:text-gray-300'} hover:bg-slate-50 dark:hover:bg-gray-800/80 group cursor-default`}
                  >
                    {day && (
                      <span className={`text-xs font-semibold w-6 h-6 flex items-center justify-center rounded-full mb-1 ${isToday ? 'bg-primary-500 text-white shadow-md' : 'group-hover:text-primary-600'}`}>
                        {day}
                      </span>
                    )}

                    <div className="flex-1 flex flex-col gap-1 overflow-y-auto hide-scrollbar">
                      {daySchedules.map((schedule, sIdx) => {
                        const colorClass = sIdx % 2 === 0 
                          ? 'bg-red-50 text-red-700 border border-red-100/50 dark:bg-red-900/20 dark:text-red-300 dark:border-red-900/30'
                          : 'bg-indigo-50 text-indigo-700 border border-indigo-100/50 dark:bg-indigo-900/20 dark:text-indigo-300 dark:border-indigo-900/30';
                        
                        const isSelected = selectedSchedule?.id === schedule.id;
                        
                        return (
                          <button 
                            key={schedule.id}
                            onClick={(e) => { e.stopPropagation(); setSelectedSchedule(schedule); }}
                            className={`text-left w-full rounded-md sm:rounded-lg px-1.5 sm:px-2 py-1 sm:py-1.5 transition-all focus:outline-none ${isSelected ? 'ring-2 ring-primary-500 shadow-md scale-105 z-10' : 'hover:scale-[1.02] hover:shadow-sm'} ${colorClass}`}
                          >
                            <div className="flex items-center gap-1 sm:gap-1.5 mb-0.5">
                               <div className={`hidden sm:flex w-2.5 h-2.5 rounded-full items-center justify-center shrink-0 bg-white/60 dark:bg-black/20`}>
                                 <div className={`w-1 h-1 rounded-full ${sIdx % 2 === 0 ? 'bg-red-500' : 'bg-indigo-500'}`} />
                               </div>
                               <p className="text-[9px] sm:text-xs font-bold truncate leading-tight">{schedule.activityName}</p>
                            </div>
                            <p className="text-[8px] sm:text-[9px] font-medium opacity-80 sm:pl-3.5 hidden sm:block">{schedule.startTime}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Responsive Modal / Pop-up Detail Jadwal */}
      {selectedSchedule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
            
            <button 
              onClick={() => setSelectedSchedule(null)} 
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-gray-700 text-slate-400 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-bold text-slate-900 dark:text-white text-lg leading-tight mb-5 pr-8">
              {selectedSchedule.activityName}
            </h3>

            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3 text-slate-600 dark:text-gray-300">
                <Clock className="w-5 h-5 text-slate-400 shrink-0" />
                <div>
                  <p className="font-medium text-slate-800 dark:text-gray-200">{formatDate(selectedSchedule.date)}</p>
                  <p className="text-slate-500 dark:text-gray-400 mt-0.5">{selectedSchedule.startTime} - {selectedSchedule.endTime}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 text-slate-600 dark:text-gray-300">
                <MapPin className="w-5 h-5 text-slate-400 shrink-0" />
                <p className="font-medium leading-relaxed pt-0.5">{selectedSchedule.location}</p>
              </div>

              {selectedSchedule.description && (
                <div className="flex items-start gap-3 text-slate-600 dark:text-gray-300">
                  <MoreHorizontal className="w-5 h-5 text-slate-400 shrink-0" />
                  <p className="font-medium leading-relaxed text-slate-500 pt-0.5">{selectedSchedule.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
            display: none;
        }
        .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}