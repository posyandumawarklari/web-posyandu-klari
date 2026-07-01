import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAdminSettingsComposite as useAdminSettings } from '../../hooks/useAdminData';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Skeleton from '../../components/ui/Skeleton';
import { Save, Globe, MapPin, Phone, MessageCircle, Mail } from 'lucide-react';

export default function SettingsPage() {
  const { data: settings, isLoading, updateSettings, isUpdating } = useAdminSettings();

  const { register, handleSubmit, reset } = useForm();

  // Load existing settings into form
  useEffect(() => {
    if (settings) {
      reset({
        site_name: settings.site_name || '',
        site_description: settings.site_description || '',
        address: settings.address || '',
        phone: settings.phone || '',
        whatsapp: settings.whatsapp || '',
        email: settings.email || '',
      });
    }
  }, [settings, reset]);

  const onSubmit = (formData) => {
    const settingsArray = Object.entries(formData).map(([key, value]) => ({ key, value }));
    updateSettings({ data: { settings: settingsArray } });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Card>
          <CardContent className="p-6 space-y-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Pengaturan Sistem</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Konfigurasi informasi umum posyandu yang akan ditampilkan di halaman publik.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        {/* Identitas Website */}
        <Card className="shadow-sm border-slate-200 dark:border-slate-700/50">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Globe className="w-5 h-5 text-emerald-500" /> Identitas Website
            </CardTitle>
            <CardDescription>Nama dan deskripsi utama website posyandu.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-5">
            <Input 
              label="Nama Website / Nama Posyandu" 
              placeholder="Misal: Posyandu Melati 1" 
              {...register('site_name')}
            />
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Deskripsi Singkat</label>
              <textarea
                {...register('site_description')}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-y min-h-[100px]"
                placeholder="Deskripsi singkat mengenai layanan posyandu Anda..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Informasi Kontak */}
        <Card className="shadow-sm border-slate-200 dark:border-slate-700/50">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Phone className="w-5 h-5 text-emerald-500" /> Kontak & Alamat
            </CardTitle>
            <CardDescription>Informasi kontak yang dapat dihubungi oleh masyarakat.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-400" /> Alamat Lengkap
              </label>
              <textarea
                {...register('address')}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-y min-h-[80px]"
                placeholder="Misal: Jl. Raya No. 1, RT 01 RW 02, Desa Maju..."
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input 
                label={<span className="flex items-center gap-2"><Phone className="w-4 h-4 text-slate-400" /> Telepon</span>}
                placeholder="Misal: 021-1234567" 
                {...register('phone')}
              />
              <Input 
                label={<span className="flex items-center gap-2"><MessageCircle className="w-4 h-4 text-slate-400" /> WhatsApp (Hanya Angka)</span>}
                placeholder="Misal: 6281234567890" 
                {...register('whatsapp')}
              />
            </div>

            <Input 
              type="email"
              label={<span className="flex items-center gap-2"><Mail className="w-4 h-4 text-slate-400" /> Alamat Email</span>}
              placeholder="Misal: info@posyandumelati.com" 
              {...register('email')}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end pt-4">
          <Button type="submit" size="lg" leftIcon={<Save className="w-5 h-5" />} isLoading={isUpdating}>
            Simpan Pengaturan
          </Button>
        </div>

      </form>
    </div>
  );
}
