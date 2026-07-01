import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import Button from '../../components/ui/Button';

export default function NotFoundPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 dark:bg-slate-900 px-4">
      <div className="text-center max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full"></div>
            <h1 className="text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-emerald-500 to-teal-700 drop-shadow-sm relative">
              404
            </h1>
          </div>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3">
          Halaman Tidak Ditemukan
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
          Maaf, halaman yang Anda cari mungkin telah dihapus, namanya diubah, atau tidak tersedia untuk sementara waktu.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Button onClick={() => window.history.back()} variant="outline" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Kembali
          </Button>
          <Link to="/">
            <Button leftIcon={<Home className="w-4 h-4" />}>
              Ke Beranda
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
