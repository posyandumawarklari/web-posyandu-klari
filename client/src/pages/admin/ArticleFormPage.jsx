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
import { Card, CardContent } from '../../components/ui/Card';
import { ArrowLeft, Save, Image as ImageIcon } from 'lucide-react';
import { getImageUrl } from '../../utils/format';

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
          navigate('/admin/artikel');
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
        tags: formData.tags.map(t => t.value),
        thumbnail: imageFile || article?.thumbnail || null
      };

      if (formData.publishDate) {
        payload.publishDate = new Date(formData.publishDate).toISOString();
      } else {
        payload.publishDate = null;
      }

      if (isEditMode) {
        updateArticle({ id: article.id, data: payload }, {
          onSuccess: () => navigate('/admin/artikel')
        });
      } else {
        createArticle(payload, {
          onSuccess: () => navigate('/admin/artikel')
        });
      }
    } catch (error) {
      console.error('Failed to save article:', error);
    } finally {
      setIsUploading(false);
    }
  };

  if (isFetchingArticle) {
    return <div className="p-8 text-center text-slate-500">Memuat artikel...</div>;
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
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500 pb-12">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link 
          to="/admin/artikel"
          className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {isEditMode ? 'Edit Artikel' : 'Tulis Artikel Baru'}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-sm">
            <CardContent className="p-6 space-y-6">
              
              <Input 
                label="Judul Artikel" 
                placeholder="Masukkan judul artikel" 
                {...register('title')}
                error={errors.title?.message}
                className="text-lg font-medium"
              />

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Isi Artikel</label>
                <div className={`rounded-xl border ${errors.content ? 'border-red-300' : 'border-slate-300 dark:border-slate-700'} overflow-hidden bg-white dark:bg-slate-900`}>
                  <Controller
                    name="content"
                    control={control}
                    render={({ field }) => (
                      <ReactQuill 
                        theme="snow" 
                        value={field.value} 
                        onChange={field.onChange} 
                        modules={modules}
                        className="h-[400px] mb-12 dark:text-white"
                      />
                    )}
                  />
                </div>
                {errors.content && <p className="mt-1 text-xs text-red-500">{errors.content.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Ringkasan (Opsional)</label>
                <textarea
                  {...register('excerpt')}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-y min-h-[100px]"
                  placeholder="Ringkasan singkat artikel yang akan muncul di daftar artikel..."
                />
              </div>

              <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Pengaturan SEO</h3>
                <div className="space-y-4">
                  <Input 
                    label="Judul SEO" 
                    placeholder="Judul untuk mesin pencari..." 
                    {...register('seoTitle')}
                  />
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Meta Deskripsi</label>
                    <textarea
                      {...register('seoDescription')}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-y min-h-[80px]"
                      placeholder="Meta deskripsi untuk SEO..."
                    />
                  </div>
                </div>
              </div>

            </CardContent>
          </Card>
        </div>

        {/* Sidebar Options */}
        <div className="space-y-6">
          
          {/* Publish Options */}
          <Card className="border-none shadow-sm">
            <CardContent className="p-6 space-y-5">
              <Select label="Status Publikasi" {...register('status')} error={errors.status?.message}>
                <option value="DRAFT">Simpan sebagai Draft</option>
                <option value="PUBLISHED">Publikasikan Sekarang</option>
              </Select>

              <Input 
                type="date"
                label="Tanggal Publikasi" 
                {...register('publishDate')}
                error={errors.publishDate?.message}
                helperText="Bisa dijadwalkan di masa depan"
              />
              
              <Button type="submit" className="w-full" leftIcon={<Save className="w-4 h-4" />} isLoading={isCreating || isUpdating || isUploading}>
                {isEditMode ? 'Simpan Perubahan' : 'Simpan Artikel'}
              </Button>
            </CardContent>
          </Card>

          {/* Thumbnail */}
          <Card className="border-none shadow-sm">
            <CardContent className="p-6">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Thumbnail Artikel</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 dark:border-slate-700 border-dashed rounded-xl relative overflow-hidden group">
                {imagePreview ? (
                  <div className="relative w-full aspect-video">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                      <label className="cursor-pointer bg-white text-slate-900 px-4 py-2 rounded-lg font-medium text-sm shadow-xl">
                        Ganti Thumbnail
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                      </label>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1 text-center py-4">
                    <ImageIcon className="mx-auto h-10 w-10 text-slate-400" />
                    <div className="flex text-sm text-slate-600 dark:text-slate-400 justify-center mt-2">
                      <label className="relative cursor-pointer bg-transparent rounded-md font-medium text-emerald-600 hover:text-emerald-500 focus-within:outline-none">
                        <span>Pilih gambar</span>
                        <input type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                      </label>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">PNG, JPG, WEBP</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Category & Tags */}
          <Card className="border-none shadow-sm">
            <CardContent className="p-6 space-y-5">
              <Select label="Kategori" {...register('categoryId')} error={errors.categoryId?.message}>
                <option value="">Pilih Kategori...</option>
                {categoriesData?.data?.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </Select>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Tags (Opsional)</label>
                <div className="flex flex-wrap gap-2">
                  {tagsData?.data?.map(tag => (
                    <label key={tag.id} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                      <input 
                        type="checkbox" 
                        value={tag.id} 
                        {...register('tags')}
                        className="rounded text-emerald-500 focus:ring-emerald-500"
                      />
                      <span className="text-sm text-slate-600 dark:text-slate-300">{tag.name}</span>
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
