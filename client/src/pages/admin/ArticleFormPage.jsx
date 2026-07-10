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
import { ArrowLeft, Save, Image as ImageIcon, FileText, Settings, Tag, Calendar, CheckSquare } from 'lucide-react';
import { getImageUrl } from '../../utils/format';
import { useAuth } from '../../context/AuthContext';

const articleSchema = z.object({
  title: z.string().min(1, 'Judul wajib diisi'),
  content: z.string().min(10, 'Konten artikel terlalu pendek'),
  excerpt: z.string().optional(),
  categoryId: z.string().min(1, 'Kategori wajib dipilih'),
  tags: z.array(z.string()).optional(),
  status: z.enum(['DRAFT', 'PUBLISHED']),
  publishDate: z.string().optional().or(z.literal('')),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
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
    formState: { errors },
  } = useForm({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      status: 'DRAFT',
      tags: [],
    }
  });

  useEffect(() => {
    if (isEditMode) {
      const fetchArticle = async () => {
        try {
          const res = await api.get(`/articles/slug/${slug}`);
          const data = res.data.data;
          setArticle(data);
          
          setValue('title', data.title);
          setValue('content', data.content);
          setValue('excerpt', data.excerpt || '');
          setValue('categoryId', data.categoryId);
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
  }, [isEditMode, slug, setValue, navigate]);

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

  // Quill Modules for Rich Text Editor
  const modules = {
    toolbar: [
      [{ 'header': [2, 3, 4, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'clean']
    ],
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700 pb-12">
      
      {/* Header */}
      <div className="flex items-center gap-5 mb-8">
        <Link 
          to={`${basePath}/artikel`}
          className="p-2.5 bg-white dark:bg-gray-800 rounded-xl hover:bg-surface-50 dark:hover:bg-gray-700 text-content-muted hover:text-primary-800 dark:hover:text-primary-400 transition-all shadow-sm border border-surface-200 dark:border-gray-700"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-heading font-bold text-content dark:text-white tracking-tight">
            {isEditMode ? 'Edit Artikel' : 'Tulis Artikel Baru'}
          </h1>
          <p className="text-sm font-medium text-content-muted dark:text-gray-400 mt-1">Isi detail artikel untuk mempublikasikan konten baru.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-none shadow-soft-xl rounded-2xl bg-white dark:bg-gray-800 overflow-hidden">
            <CardHeader className="border-b border-surface-100 dark:border-gray-700 bg-surface-50/50 dark:bg-gray-800/50 py-5">
              <CardTitle className="text-xl font-heading font-bold text-content dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary-800 dark:text-primary-400" />
                Konten Utama
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              
              <Input 
                label="Judul Artikel" 
                placeholder="Masukkan judul artikel" 
                {...register('title')}
                error={errors.title?.message}
                className="text-lg font-bold placeholder-content-muted/50"
              />

              <div>
                <label className="block text-sm font-bold text-content dark:text-gray-300 mb-2">Isi Artikel</label>
                <div className={`rounded-xl border ${errors.content ? 'border-red-300 shadow-sm' : 'border-surface-200 dark:border-gray-700 shadow-sm hover:border-primary-300 transition-colors'} overflow-hidden bg-white dark:bg-gray-900 quill-container`}>
                  <Controller
                    name="content"
                    control={control}
                    render={({ field }) => (
                      <ReactQuill 
                        theme="snow" 
                        value={field.value} 
                        onChange={field.onChange} 
                        modules={modules}
                        className="h-[450px] mb-12 dark:text-white font-medium"
                      />
                    )}
                  />
                </div>
                {errors.content && <p className="mt-2 text-xs font-semibold text-red-500">{errors.content.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-content dark:text-gray-300 mb-2">Ringkasan (Opsional)</label>
                <textarea
                  {...register('excerpt')}
                  className="w-full px-5 py-3.5 rounded-xl border border-surface-200 dark:border-gray-700 bg-surface-50 dark:bg-gray-900 text-content dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 hover:border-primary-300 transition-all resize-y min-h-[120px] font-medium placeholder-content-muted/50"
                  placeholder="Ringkasan singkat artikel yang akan muncul di daftar artikel..."
                />
              </div>

            </CardContent>
          </Card>

          <Card className="border-none shadow-soft-xl rounded-2xl bg-white dark:bg-gray-800 overflow-hidden">
            <CardHeader className="border-b border-surface-100 dark:border-gray-700 bg-surface-50/50 dark:bg-gray-800/50 py-5">
              <CardTitle className="text-xl font-heading font-bold text-content dark:text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary-800 dark:text-primary-400" />
                Pengaturan SEO
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <Input 
                label="Judul SEO" 
                placeholder="Judul untuk mesin pencari..." 
                {...register('seoTitle')}
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
          </Card>
        </div>

        {/* Sidebar Options */}
        <div className="space-y-8">
          
          {/* Publish Options */}
          <Card className="border-none shadow-soft-xl rounded-2xl bg-white dark:bg-gray-800 overflow-hidden">
            <CardHeader className="border-b border-surface-100 dark:border-gray-700 bg-surface-50/50 dark:bg-gray-800/50 py-4">
              <CardTitle className="text-base font-bold text-content dark:text-white flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-primary-800 dark:text-primary-400" />
                Aksi Publikasi
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <Select label="Status Publikasi" {...register('status')} error={errors.status?.message} className="font-bold">
                <option value="DRAFT">Simpan sebagai Draft</option>
                <option value="PUBLISHED">Publikasikan Sekarang</option>
              </Select>

              <Input 
                type="date"
                label={<span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-content-muted" />Tanggal Publikasi</span>}
                {...register('publishDate')}
                error={errors.publishDate?.message}
                helperText="Kosongkan jika ingin segera dipublikasi"
              />
              
              <Button type="submit" className="w-full px-6 py-4 rounded-xl text-base font-bold shadow-sm hover:shadow-soft-xl transition-all" leftIcon={<Save className="w-5 h-5" />} isLoading={isCreating || isUpdating || isUploading}>
                {isEditMode ? 'Simpan Perubahan' : 'Simpan Artikel'}
              </Button>
            </CardContent>
          </Card>

          {/* Thumbnail */}
          <Card className="border-none shadow-soft-xl rounded-2xl bg-white dark:bg-gray-800 overflow-hidden">
            <CardHeader className="border-b border-surface-100 dark:border-gray-700 bg-surface-50/50 dark:bg-gray-800/50 py-4">
              <CardTitle className="text-base font-bold text-content dark:text-white flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-primary-800 dark:text-primary-400" />
                Thumbnail
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex justify-center p-6 border-2 border-surface-200 dark:border-gray-700 border-dashed rounded-xl relative overflow-hidden group hover:border-primary-400 dark:hover:border-primary-600 transition-colors bg-surface-50 dark:bg-gray-900/50">
                {imagePreview ? (
                  <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-sm">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <label className="cursor-pointer bg-white text-content px-5 py-2.5 rounded-xl font-bold text-sm shadow-xl hover:bg-surface-50 transition-colors">
                        Ganti Gambar
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                      </label>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 text-center py-6">
                    <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto shadow-sm border border-surface-100 dark:border-gray-700">
                      <ImageIcon className="h-8 w-8 text-primary-800/40 dark:text-primary-400/40" />
                    </div>
                    <div className="flex text-sm font-bold text-content dark:text-gray-300 justify-center">
                      <label className="relative cursor-pointer bg-transparent rounded-md text-primary-800 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 transition-colors focus-within:outline-none">
                        <span>Pilih File Gambar</span>
                        <input type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                      </label>
                    </div>
                    <p className="text-xs font-medium text-content-muted dark:text-gray-500">PNG, JPG, WEBP (Max 2MB)</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Category & Tags */}
          <Card className="border-none shadow-soft-xl rounded-2xl bg-white dark:bg-gray-800 overflow-hidden">
            <CardHeader className="border-b border-surface-100 dark:border-gray-700 bg-surface-50/50 dark:bg-gray-800/50 py-4">
              <CardTitle className="text-base font-bold text-content dark:text-white flex items-center gap-2">
                <Tag className="w-4 h-4 text-primary-800 dark:text-primary-400" />
                Kategori & Tag
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <Select label="Kategori Artikel" {...register('categoryId')} error={errors.categoryId?.message} className="font-bold">
                <option value="">Pilih Kategori...</option>
                {categoriesData?.data?.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </Select>

              <div>
                <label className="block text-sm font-bold text-content dark:text-gray-300 mb-3">Tag (Opsional)</label>
                <div className="flex flex-wrap gap-2.5">
                  {tagsData?.data?.map(tag => (
                    <label key={tag.id} className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-surface-200 dark:border-gray-700 cursor-pointer hover:bg-primary-50 hover:border-primary-200 dark:hover:bg-primary-900/20 dark:hover:border-primary-800/50 transition-colors group">
                      <input 
                        type="checkbox" 
                        value={tag.id} 
                        {...register('tags')}
                        className="rounded text-primary-600 focus:ring-primary-500 border-surface-300 dark:border-gray-600 dark:bg-gray-900"
                      />
                      <span className="text-sm font-bold text-content-muted dark:text-gray-400 group-hover:text-primary-800 dark:group-hover:text-primary-400 transition-colors">{tag.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </form>
    </div>
  );
}
