import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAdminSettingsComposite as useAdminSettings } from '../../hooks/useAdminData';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Skeleton from '../../components/ui/Skeleton';
import { Save, Globe, MapPin, Phone, MessageCircle, Mail, Layout, Image as ImageIcon } from 'lucide-react';

export default function SettingsPage() {
  const { data: settings, isLoading, updateSettings, isUpdating } = useAdminSettings();

  const { register, handleSubmit, reset } = useForm();

  const [heroImageFile, setHeroImageFile] = useState(null);
  const [heroImagePreview, setHeroImagePreview] = useState(null);

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
        hero_title: settings.hero_title || '',
        hero_subtitle: settings.hero_subtitle || '',
        social_instagram: settings.social_instagram || '',
        social_facebook: settings.social_facebook || '',
        social_youtube: settings.social_youtube || '',
      });
      if (settings.hero_image) {
        setHeroImagePreview(settings.hero_image);
      }
    }
  }, [settings, reset]);

  const handleHeroImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setHeroImageFile(file);
      setHeroImagePreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = (formData) => {
    const settingsArray = Object.entries(formData).map(([key, value]) => ({ key, value }));
    const files = {};
    if (heroImageFile) {
      files.hero_image = heroImageFile;
    }
    updateSettings({ data: { settings: settingsArray }, files });
  };

  if (isLoading) {
    return (
      <div className="space-y-8 max-w-4xl mx-auto">
        <div>
          <Skeleton className="h-10 w-64 mb-2 rounded-xl" />
          <Skeleton className="h-4 w-96 rounded" />
        </div>
        <Card className="rounded-2xl shadow-soft-xl border-none">
          <CardContent className="p-8 space-y-8">
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-32 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700 max-w-4xl mx-auto">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-heading font-bold text-content dark:text-white tracking-tight">Pengaturan Sistem</h1>
        <p className="text-base font-medium text-content-muted dark:text-gray-400 mt-2">Konfigurasi informasi umum posyandu yang akan ditampilkan di halaman publik.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        
        {/* Identitas Website */}
        <Card className="border-none shadow-soft-xl rounded-2xl bg-white dark:bg-gray-800 overflow-hidden">
          <CardHeader className="border-b border-surface-100 dark:border-gray-700 bg-surface-50/50 dark:bg-gray-800/50 py-6">
            <CardTitle className="text-xl font-heading font-bold text-content dark:text-white flex items-center gap-3">
              <div className="p-2 bg-primary-50 dark:bg-gray-700 rounded-lg shrink-0">
                <Globe className="w-5 h-5 text-primary-800 dark:text-primary-400" />
              </div>
              Identitas Website
            </CardTitle>
            <CardDescription className="text-sm font-medium text-content-muted dark:text-gray-400 mt-1 pl-12">
              Nama dan deskripsi utama website posyandu.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <Input 
              label="Nama Website / Nama Posyandu" 
              placeholder="Misal: Posyandu Mawar 1" 
              {...register('site_name')}
            />
            <div>
              <label className="block text-sm font-bold text-content dark:text-gray-300 mb-2">Deskripsi Singkat</label>
              <textarea
                {...register('site_description')}
                className="w-full px-5 py-3.5 rounded-xl border border-surface-200 dark:border-gray-700 bg-surface-50 dark:bg-gray-900 text-content dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 hover:border-primary-300 transition-all resize-y min-h-[120px] font-medium placeholder-content-muted/50"
                placeholder="Deskripsi singkat mengenai layanan posyandu Anda..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Hero Section */}
        <Card className="border-none shadow-soft-xl rounded-2xl bg-white dark:bg-gray-800 overflow-hidden">
          <CardHeader className="border-b border-surface-100 dark:border-gray-700 bg-surface-50/50 dark:bg-gray-800/50 py-6">
            <CardTitle className="text-xl font-heading font-bold text-content dark:text-white flex items-center gap-3">
              <div className="p-2 bg-primary-50 dark:bg-gray-700 rounded-lg shrink-0">
                <Layout className="w-5 h-5 text-primary-800 dark:text-primary-400" />
              </div>
              Pengaturan Hero Section
            </CardTitle>
            <CardDescription className="text-sm font-medium text-content-muted dark:text-gray-400 mt-1 pl-12">
              Teks dan gambar background pada bagian atas halaman Beranda.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <Input 
              label="Judul Hero (Hero Title)" 
              placeholder="Misal: Portal Informasi Layanan Kesehatan" 
              {...register('hero_title')}
            />
            <div>
              <label className="block text-sm font-bold text-content dark:text-gray-300 mb-2">Subjudul (Hero Subtitle)</label>
              <textarea
                {...register('hero_subtitle')}
                className="w-full px-5 py-3.5 rounded-xl border border-surface-200 dark:border-gray-700 bg-surface-50 dark:bg-gray-900 text-content dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 hover:border-primary-300 transition-all resize-y min-h-[80px] font-medium placeholder-content-muted/50"
                placeholder="Misal: Posyandu Mawar Desa Klari"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-content dark:text-gray-300 mb-2 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-primary-800 dark:text-primary-400" /> Gambar Background
              </label>
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                {heroImagePreview ? (
                  <div className="relative w-full sm:w-64 h-40 rounded-xl overflow-hidden shadow-sm border border-surface-200 dark:border-gray-700">
                    <img src={heroImagePreview} alt="Hero Preview" className="w-full h-full object-cover"  onError={(e) => { e.target.onerror = null; e.target.src="/placeholder-image.jpg"; }} />
                  </div>
                ) : (
                  <div className="w-full sm:w-64 h-40 rounded-xl border-2 border-dashed border-surface-300 dark:border-gray-600 flex flex-col items-center justify-center bg-surface-50 dark:bg-gray-800/50 text-content-muted">
                    <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                    <span className="text-sm font-medium">Belum ada gambar</span>
                  </div>
                )}
                <div className="flex-1 space-y-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleHeroImageChange}
                    className="block w-full text-sm text-content-muted dark:text-gray-400
                      file:mr-4 file:py-2.5 file:px-4
                      file:rounded-xl file:border-0
                      file:text-sm file:font-semibold
                      file:bg-primary-50 file:text-primary-800
                      hover:file:bg-primary-100 dark:file:bg-primary-900/30 dark:file:text-primary-400 transition-all cursor-pointer"
                  />
                  <p className="text-xs text-content-muted/80 dark:text-gray-500">
                    Format: JPG, PNG, WebP. Maksimal 2MB. Rekomendasi ukuran: 1920x1080px.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informasi Kontak */}
        <Card className="border-none shadow-soft-xl rounded-2xl bg-white dark:bg-gray-800 overflow-hidden">
          <CardHeader className="border-b border-surface-100 dark:border-gray-700 bg-surface-50/50 dark:bg-gray-800/50 py-6">
            <CardTitle className="text-xl font-heading font-bold text-content dark:text-white flex items-center gap-3">
              <div className="p-2 bg-primary-50 dark:bg-gray-700 rounded-lg shrink-0">
                <Phone className="w-5 h-5 text-primary-800 dark:text-primary-400" />
              </div>
              Kontak & Alamat
            </CardTitle>
            <CardDescription className="text-sm font-medium text-content-muted dark:text-gray-400 mt-1 pl-12">
              Informasi kontak yang dapat dihubungi oleh masyarakat.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div>
              <label className="block text-sm font-bold text-content dark:text-gray-300 mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary-800 dark:text-primary-400" /> Alamat Lengkap
              </label>
              <textarea
                {...register('address')}
                className="w-full px-5 py-3.5 rounded-xl border border-surface-200 dark:border-gray-700 bg-surface-50 dark:bg-gray-900 text-content dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 hover:border-primary-300 transition-all resize-y min-h-[100px] font-medium placeholder-content-muted/50"
                placeholder="Misal: Jl. Raya No. 1, RT 01 RW 02, Desa Maju..."
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input 
                label={<span className="flex items-center gap-2"><Phone className="w-4 h-4 text-primary-800 dark:text-primary-400" /> Telepon</span>}
                placeholder="Misal: 021-1234567" 
                {...register('phone')}
              />
              <Input 
                label={<span className="flex items-center gap-2"><MessageCircle className="w-4 h-4 text-primary-800 dark:text-primary-400" /> WhatsApp (Hanya Angka)</span>}
                placeholder="Misal: 6281234567890" 
                {...register('whatsapp')}
              />
            </div>

            <Input 
              type="email"
              label={<span className="flex items-center gap-2"><Mail className="w-4 h-4 text-primary-800 dark:text-primary-400" /> Alamat Email</span>}
              placeholder="Misal: info@posyandumawar.com" 
              {...register('email')}
            />
          </CardContent>
        </Card>

        {/* Sosial Media */}
        <Card className="border-none shadow-soft-xl rounded-2xl bg-white dark:bg-gray-800 overflow-hidden">
          <CardHeader className="border-b border-surface-100 dark:border-gray-700 bg-surface-50/50 dark:bg-gray-800/50 py-6">
            <CardTitle className="text-xl font-heading font-bold text-content dark:text-white flex items-center gap-3">
              <div className="p-2 bg-primary-50 dark:bg-gray-700 rounded-lg shrink-0">
                <Globe className="w-5 h-5 text-primary-800 dark:text-primary-400" />
              </div>
              Sosial Media
            </CardTitle>
            <CardDescription className="text-sm font-medium text-content-muted dark:text-gray-400 mt-1 pl-12">
              Tautan media sosial yang akan ditampilkan pada Footer. Biarkan kosong jika tidak ada.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <Input 
              label={<span className="flex items-center gap-2"><Globe className="w-4 h-4 text-primary-800 dark:text-primary-400" /> URL Instagram</span>}
              placeholder="Misal: https://instagram.com/posyandumawar" 
              {...register('social_instagram')}
            />
            <Input 
              label={<span className="flex items-center gap-2"><Globe className="w-4 h-4 text-primary-800 dark:text-primary-400" /> URL Facebook</span>}
              placeholder="Misal: https://facebook.com/posyandumawar" 
              {...register('social_facebook')}
            />
            <Input 
              label={<span className="flex items-center gap-2"><Globe className="w-4 h-4 text-primary-800 dark:text-primary-400" /> URL YouTube</span>}
              placeholder="Misal: https://youtube.com/c/posyandumawar" 
              {...register('social_youtube')}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end pt-4">
          <Button type="submit" size="lg" className="px-8 py-3.5 rounded-xl shadow-sm hover:shadow-soft-xl transition-all" leftIcon={<Save className="w-5 h-5" />} isLoading={isUpdating}>
            Simpan Pengaturan
          </Button>
        </div>

      </form>
    </div>
  );
}
