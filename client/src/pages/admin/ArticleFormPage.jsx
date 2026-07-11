import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useAdminArticles, useAdminCategories, useAdminTags } from '../../hooks/useAdminData';
import { api } from '../../services/api';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { ArrowLeft, Save, Image as ImageIcon, FileText, Settings, Tag, Calendar, CheckSquare, ChevronDown, ChevronUp } from 'lucide-react';
import { getImageUrl } from '../../utils/format';
import { useAuth } from '../../context/AuthContext';

const baseSchema = z.object({
  title: z.string().min(1, 'Judul wajib diisi'),
  content: z.string().optional().nullable(),
  excerpt: z.string().optional(),
  categoryId: z.string().optional().nullable(),
  tags: z.array(z.string()).optional(),
  status: z.enum(['DRAFT', 'PUBLISHED']),
  publishDate: z.string().optional().or(z.literal('')),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

const articleSchema = baseSchema.superRefine((data, ctx) => {
  if (data.status === 'PUBLISHED') {
    if (!data.content || data.content.length < 10) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Konten minimal 10 karakter untuk publikasi',
        path: ['content'],
      });
    }
    if (!data.categoryId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Kategori wajib dipilih untuk publikasi',
        path: ['categoryId'],
      });
    }
  }
});

export default function ArticleFormPage() {
  const { user, isAdmin } = useAuth();
  const basePath = isAdmin ? '/admin' : '/dashboard';
  const { slug } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!slug;

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [seoOpen, setSeoOpen] = useState(false);

  // Fetch article if editing
  const [article, setArticle] = useState(null);
  const [isFetchingArticle, setIsFetchingArticle] = useState(isEditMode);

  // Fetch dropdown data
  const { data: categoriesData } = useAdminCategories({ limit: 100 });
  const { data: tagsData } = useAdminTags({ limit: 100 });
  
  const { createArticle, updateArticle, isCreating, isUpdating } = useAdminArticles();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      status: 'DRAFT',
      tags: [],
    }
  });

  const selectedStatus = watch('status');

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  useEffect(() => {
    if (isEditMode) {
      const fetchArticle = async () => {
        try {
          const res = await api.get(`/articles/slug/${slug}`);
          const data = res.data.data;
          setArticle(data);
          
          setValue('title', data.title);
          setValue('content', data.content || '');
          setValue('excerpt', data.excerpt || '');
          setValue('categoryId', data.categoryId || '');
          setValue('status', data.status);
          setValue('tags', data.tags?.map(t => t.id) || []);
          setValue('publishDate', data.publishDate ? data.publishDate.split('T')[0] : '');
          setValue('seoTitle', data.seoTitle || '');
          setValue('seoDescription', data.seoDescription || '');
          
          if (data.thumbnail) {
            setImagePreview(getImageUrl(data.thumbnail));
          }
        } catch (error) {
          console.error('Failed to fetch article:', error);
          alert('Gagal mengambil data artikel');
          navigate(`${basePath}/artikel`);
        } finally {
          setIsFetchingArticle(false);
        }
      };
      fetchArticle();
    }
  }, [isEditMode, slug, setValue, navigate, basePath]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (formData) => {
    setIsUploading(true);

    try {
      const payload = { 
        title: formData.title,
        content: formData.content,
        excerpt: formData.excerpt,
        categoryId: formData.categoryId,
        tags: formData.tags || [],
        status: formData.status,
        thumbnail: imageFile || article?.thumbnail || null
      };

      if (formData.publishDate) {
        payload.publishDate = new Date(formData.publishDate).toISOString();
      } else {
        payload.publishDate = null;
      }

      if (isEditMode) {
        updateArticle({ id: article.id, data: payload }, {
          onSuccess: () => navigate(`${basePath}/artikel`)
        });
      } else {
        createArticle(payload, {
          onSuccess: () => navigate(`${basePath}/artikel`)
        });
      }
    } catch (error) {
      console.error('Failed to save article:', error);
    } finally {
      setIsUploading(false);
    }
  };

  if (isFetchingArticle) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-800 rounded-full animate-spin"></div>
        <p className="mt-4 text-base font-medium text-content-muted">Memuat data artikel...</p>
      </div>
    );
  }

  const modules = {
    toolbar: [
      [{ 'header': [2, 3, 4, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'clean']
    ],
  };

  return (
    <div className="max-w-7xl mx-auto pb-6 animate-in fade-in duration-700">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:gap-8 relative">
        
        {/* Header (Always at the top) */}
        <div className="order-1 lg:col-span-12 flex items-center gap-4 lg:gap-5 mb-2 lg:mb-0">
          <Link 
            to={`${basePath}/artikel`}
            className="p-2 lg:p-2.5 bg-white dark:bg-gray-800 rounded-xl hover:bg-surface-50 dark:hover:bg-gray-700 text-content-muted hover:text-primary-800 dark:hover:text-primary-400 transition-all shadow-sm border border-surface-200 dark:border-gray-700 flex-shrink-0 flex items-center justify-center min-h-[44px] min-w-[44px]"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl lg:text-3xl font-heading font-bold text-content dark:text-white tracking-tight">
              {isEditMode ? 'Edit Artikel' : 'Tulis Artikel Baru'}
            </h1>
            <p className="text-xs lg:text-sm font-medium text-content-muted dark:text-gray-400 mt-1">Isi detail artikel untuk publikasi masyarakat.</p>
          </div>
        </div>

        {/* --- MAIN CONTENT (LEFT COLUMN ON DESKTOP) --- */}
        <div className="contents lg:block lg:col-span-8 space-y-6 lg:space-y-8">
          
          {/* Article Title */}
          <Card className="order-3 lg:order-none border-none shadow-soft-xl rounded-2xl bg-white dark:bg-gray-800 overflow-hidden">
            <CardHeader className="border-b border-surface-100 dark:border-gray-700 bg-surface-50/50 dark:bg-gray-800/50 py-4 lg:py-5">
              <CardTitle className="text-lg lg:text-xl font-heading font-bold text-content dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary-800 dark:text-primary-400" />
                Informasi Utama
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 lg:p-8 space-y-6">
              <Input 
                label={<span className="font-bold">Judul Artikel <span className="text-red-500">*</span></span>}
                placeholder="Masukkan judul artikel" 
                {...register('title')}
                error={errors.title?.message}
                className="text-base lg:text-lg font-bold placeholder-content-muted/50 min-h-[44px]"
              />
              <div>
                <label className="block text-sm font-bold text-content dark:text-gray-300 mb-2">Ringkasan Singkat (Opsional)</label>
                <textarea
                  {...register('excerpt')}
                  className="w-full px-5 py-3.5 rounded-xl border border-surface-200 dark:border-gray-700 bg-surface-50 dark:bg-gray-900 text-content dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 hover:border-primary-300 transition-all resize-y min-h-[100px] font-medium placeholder-content-muted/50"
                  placeholder="Ringkasan yang akan muncul di daftar artikel..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Article Content Editor */}
          <Card className="order-6 lg:order-none border-none shadow-soft-xl rounded-2xl bg-white dark:bg-gray-800 overflow-hidden">
             <CardHeader className="border-b border-surface-100 dark:border-gray-700 bg-surface-50/50 dark:bg-gray-800/50 py-4 lg:py-5">
              <CardTitle className="text-lg lg:text-xl font-heading font-bold text-content dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary-800 dark:text-primary-400" />
                Isi Konten {selectedStatus === 'PUBLISHED' && <span className="text-red-500">*</span>}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 lg:p-8">
              <div className={`rounded-xl border ${errors.content ? 'border-red-300 shadow-sm' : 'border-surface-200 dark:border-gray-700 shadow-sm hover:border-primary-300 transition-colors'} overflow-hidden bg-white dark:bg-gray-900 quill-container`}>
                <Controller
                  name="content"
                  control={control}
                  render={({ field }) => (
                    <ReactQuill 
                      theme="snow" 
                      value={field.value || ''} 
                      onChange={field.onChange} 
                      modules={modules}
                      className="min-h-[350px] lg:min-h-[450px] mb-12 dark:text-white font-medium"
                    />
                  )}
                />
              </div>
              {errors.content && <p className="mt-2 text-sm font-semibold text-red-500">{errors.content.message}</p>}
            </CardContent>
          </Card>

          {/* SEO Accordion */}
          <Card className="order-7 lg:order-none border-none shadow-soft-xl rounded-2xl bg-white dark:bg-gray-800 overflow-hidden">
            <button 
              type="button" 
              onClick={() => setSeoOpen(!seoOpen)} 
              className="w-full flex items-center justify-between p-5 lg:p-6 bg-surface-50/50 dark:bg-gray-800/50 hover:bg-surface-100 dark:hover:bg-gray-700/80 transition-colors min-h-[56px]"
            >
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary-800 dark:text-primary-400" />
                <span className="text-base lg:text-lg font-heading font-bold text-content dark:text-white">Pengaturan Lanjutan (SEO)</span>
              </div>
              {seoOpen ? <ChevronUp className="w-5 h-5 text-content-muted" /> : <ChevronDown className="w-5 h-5 text-content-muted" />}
            </button>
            {seoOpen && (
              <div className="border-t border-surface-100 dark:border-gray-700">
                <CardContent className="p-5 lg:p-8 space-y-6">
                  <Input 
                    label="Judul SEO" 
                    placeholder="Judul untuk mesin pencari..." 
                    {...register('seoTitle')}
                    className="min-h-[44px]"
                  />
                  <div>
                    <label className="block text-sm font-bold text-content dark:text-gray-300 mb-2">Meta Deskripsi</label>
                    <textarea
                      {...register('seoDescription')}
                      className="w-full px-5 py-3.5 rounded-xl border border-surface-200 dark:border-gray-700 bg-surface-50 dark:bg-gray-900 text-content dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 hover:border-primary-300 transition-all resize-y min-h-[100px] font-medium placeholder-content-muted/50"
                      placeholder="Meta deskripsi untuk SEO..."
                    />
                  </div>
                </CardContent>
              </div>
            )}
          </Card>
          
        </div>

        {/* --- SIDEBAR (RIGHT COLUMN ON DESKTOP) --- */}
        <div className="contents lg:block lg:col-span-4 space-y-6 lg:space-y-8">
          
          {/* Thumbnail Upload (Order 2 on Mobile) */}
          <Card className="order-2 lg:order-none border-none shadow-soft-xl rounded-2xl bg-white dark:bg-gray-800 overflow-hidden">
            <CardHeader className="border-b border-surface-100 dark:border-gray-700 bg-surface-50/50 dark:bg-gray-800/50 py-4">
              <CardTitle className="text-base font-bold text-content dark:text-white flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-primary-800 dark:text-primary-400" />
                Thumbnail Artikel
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 lg:p-6">
              <div className="flex justify-center p-4 lg:p-6 border-2 border-surface-200 dark:border-gray-700 border-dashed rounded-xl relative overflow-hidden group hover:border-primary-400 dark:hover:border-primary-600 transition-colors bg-surface-50 dark:bg-gray-900/50">
                {imagePreview ? (
                  <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-sm">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"  onError={(e) => { e.target.onerror = null; e.target.src="/placeholder-image.jpg"; }} />
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <label className="cursor-pointer bg-white text-content px-5 py-2.5 rounded-xl font-bold text-sm shadow-xl hover:bg-surface-50 transition-colors min-h-[44px] flex items-center">
                        Ganti Gambar
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                      </label>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 text-center py-4 lg:py-6">
                    <div className="w-14 h-14 lg:w-16 lg:h-16 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto shadow-sm border border-surface-100 dark:border-gray-700">
                      <ImageIcon className="h-6 w-6 lg:h-8 lg:w-8 text-primary-800/40 dark:text-primary-400/40" />
                    </div>
                    <div className="flex text-sm font-bold text-content dark:text-gray-300 justify-center">
                      <label className="relative cursor-pointer bg-transparent rounded-md text-primary-800 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 transition-colors focus-within:outline-none min-h-[44px] flex items-center">
                        <span>Pilih File Gambar</span>
                        <input type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                      </label>
                    </div>
                    <p className="text-xs font-medium text-content-muted dark:text-gray-500">PNG, JPG, WEBP (Max 5MB)</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Category & Tags (Order 4 on Mobile) */}
          <Card className="order-4 lg:order-none border-none shadow-soft-xl rounded-2xl bg-white dark:bg-gray-800 overflow-hidden">
            <CardHeader className="border-b border-surface-100 dark:border-gray-700 bg-surface-50/50 dark:bg-gray-800/50 py-4">
              <CardTitle className="text-base font-bold text-content dark:text-white flex items-center gap-2">
                <Tag className="w-4 h-4 text-primary-800 dark:text-primary-400" />
                Kategori & Tag
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 lg:p-6 space-y-5 lg:space-y-6">
              <div>
                <Select label={<span className="font-bold">Kategori {selectedStatus === 'PUBLISHED' && <span className="text-red-500">*</span>}</span>} {...register('categoryId')} error={errors.categoryId?.message} className="font-bold min-h-[44px]">
                  <option value="">Pilih Kategori...</option>
                  {categoriesData?.data?.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="block text-sm font-bold text-content dark:text-gray-300 mb-3">Tag (Opsional)</label>
                <div className="flex flex-wrap gap-2.5">
                  {tagsData?.data?.map(tag => (
                    <label key={tag.id} className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-surface-200 dark:border-gray-700 cursor-pointer hover:bg-primary-50 hover:border-primary-200 dark:hover:bg-primary-900/20 dark:hover:border-primary-800/50 transition-colors group min-h-[44px]">
                      <input 
                        type="checkbox" 
                        value={tag.id} 
                        {...register('tags')}
                        className="rounded text-primary-600 focus:ring-primary-500 border-surface-300 dark:border-gray-600 dark:bg-gray-900 w-5 h-5"
                      />
                      <span className="text-sm font-bold text-content-muted dark:text-gray-400 group-hover:text-primary-800 dark:group-hover:text-primary-400 transition-colors">{tag.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Publish Status (Order 5 on Mobile) */}
          <Card className="order-5 lg:order-none border-none shadow-soft-xl rounded-2xl bg-white dark:bg-gray-800 overflow-hidden">
            <CardHeader className="border-b border-surface-100 dark:border-gray-700 bg-surface-50/50 dark:bg-gray-800/50 py-4">
              <CardTitle className="text-base font-bold text-content dark:text-white flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-primary-800 dark:text-primary-400" />
                Status Publikasi
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 lg:p-6 space-y-6">
              
              <div className="space-y-3">
                <div className="grid grid-cols-1 gap-3">
                  <label className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all min-h-[44px] ${selectedStatus === 'DRAFT' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-surface-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-gray-500'}`}>
                    <input type="radio" value="DRAFT" {...register('status')} className="mt-0.5 w-5 h-5 text-primary-600 focus:ring-primary-500 flex-shrink-0" />
                    <div>
                      <span className="block font-bold text-content dark:text-white">Simpan sebagai Draft</span>
                      <span className="block text-xs font-medium text-content-muted dark:text-gray-400 mt-1">Artikel belum bisa dilihat publik</span>
                    </div>
                  </label>
                  <label className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all min-h-[44px] ${selectedStatus === 'PUBLISHED' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-surface-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-700'}`}>
                    <input type="radio" value="PUBLISHED" {...register('status')} className="mt-0.5 w-5 h-5 text-emerald-600 focus:ring-emerald-500 flex-shrink-0" />
                    <div>
                      <span className="block font-bold text-content dark:text-white">Publikasikan Sekarang</span>
                      <span className="block text-xs font-medium text-content-muted dark:text-gray-400 mt-1">Artikel akan langsung tayang</span>
                    </div>
                  </label>
                </div>
              </div>

              {selectedStatus === 'PUBLISHED' && (
                <Input 
                  type="date"
                  label={<span className="flex items-center gap-2 font-bold"><Calendar className="w-4 h-4 text-content-muted" />Tanggal Rilis (Opsional)</span>}
                  {...register('publishDate')}
                  error={errors.publishDate?.message}
                  helperText="Kosongkan jika ingin segera dipublikasi"
                  className="min-h-[44px]"
                />
              )}
              
              {/* Desktop Submit Button */}
              <div className="hidden lg:block pt-2">
                <Button type="submit" className="w-full px-6 py-4 rounded-xl text-base font-bold shadow-sm hover:shadow-soft-xl transition-all min-h-[44px]" leftIcon={<Save className="w-5 h-5" />} isLoading={isCreating || isUpdating || isUploading}>
                  {selectedStatus === 'PUBLISHED' ? 'Publikasikan Artikel' : 'Simpan Draft'}
                </Button>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Mobile Sticky Action Bar (Order 8, visible only on Mobile) */}
        <div className="order-8 lg:hidden sticky bottom-0 left-0 right-0 p-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-surface-200 dark:border-gray-700 flex flex-row items-center justify-between gap-3 z-50 rounded-t-2xl shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]">
          <Button type="button" variant="outline" onClick={() => navigate(`${basePath}/artikel`)} className="px-5 py-3 rounded-xl font-bold min-h-[44px] flex-1">
            Batal
          </Button>
          <Button type="submit" className="px-6 py-3 rounded-xl font-bold shadow-sm min-h-[44px] flex-1" leftIcon={<Save className="w-4 h-4" />} isLoading={isCreating || isUpdating || isUploading}>
            {selectedStatus === 'PUBLISHED' ? 'Publikasikan' : 'Simpan Draft'}
          </Button>
        </div>

      </form>
    </div>
  );
}
