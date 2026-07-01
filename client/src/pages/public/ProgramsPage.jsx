import { usePublicPrograms } from '../../hooks/usePublicData';
import Skeleton from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';
import { getImageUrl } from '../../utils/format';
import { Users } from 'lucide-react';

export default function ProgramsPage() {
  const { data: programs, isLoading } = usePublicPrograms();

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            Program Posyandu
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Berbagai layanan dan kegiatan yang kami selenggarakan secara rutin untuk meningkatkan kualitas kesehatan masyarakat.
          </p>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col md:flex-row gap-6 bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700">
                <Skeleton className="w-full md:w-48 h-48 rounded-2xl shrink-0" />
                <div className="space-y-3 flex-1 py-2">
                  <Skeleton className="h-7 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : !programs || programs.length === 0 ? (
          <EmptyState 
            icon={Users} 
            title="Belum ada program" 
            description="Informasi program posyandu akan segera ditambahkan." 
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {programs.map((program) => (
              <div key={program.id} className="flex flex-col md:flex-row gap-6 bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
                {program.image ? (
                  <img 
                    src={getImageUrl(program.image)} 
                    alt={program.title} 
                    className="w-full md:w-48 h-48 object-cover rounded-2xl shrink-0"
                  />
                ) : (
                  <div className="w-full md:w-48 h-48 bg-slate-100 dark:bg-slate-700 rounded-2xl shrink-0 flex items-center justify-center">
                    <Users className="w-10 h-10 text-slate-300 dark:text-slate-500" />
                  </div>
                )}
                <div className="flex-1 flex flex-col justify-center">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                    {program.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm whitespace-pre-wrap">
                    {program.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
