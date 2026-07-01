import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAdminGallery } from '../../hooks/useAdminData';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import Pagination from '../../components/ui/Pagination';
import EmptyState from '../../components/ui/EmptyState';
import Skeleton from '../../components/ui/Skeleton';
import { Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import { getImageUrl, formatDate } from '../../utils/format';
import { api } from '../../services/api';

const gallerySchema = z.object({
  title: z.string().min(1, 'Judul foto wajib diisi'),
});

export default function GalleryPage() {
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Image state
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const {
    data,
    isLoading,
    createGallery,
    deleteGallery,
    isCreating,
    isDeleting,
  } = useAdminGallery({ page, limit: 12 });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(gallerySchema),
  });

  const handleOpenModal = () => {
    reset({ title: '' });
    setImageFile(null);
    setImagePreview(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    reset();
    setImageFile(null);
    setImagePreview(null);
  };

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
    if (!imageFile) {
      alert('Silakan pilih gambar terlebih dahulu');
      return;
    }

    setIsUploading(true);
    try {
      createGallery(
        { title: formData.title, image: imageFile }, 
        { onSuccess: () => handleCloseModal() }
      );
    } catch (error) {
      console.error('Failed to upload image:', error);
      alert('Gagal mengunggah gambar. Silakan coba lagi.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus foto ini dari galeri?')) {
      deleteGallery(id);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Galeri Foto</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Dokumentasikan kegiatan posyandu dalam bentuk foto.</p>
        </div>
        <Button onClick={handleOpenModal} leftIcon={<Plus className="w-4 h-4" />}>
          Unggah Foto
        </Button>
      </div>

      {/* Grid Content */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="aspect-square rounded-2xl" />)}
          </div>
        ) : !data?.data || data.data.length === 0 ? (
          <div className="py-12">
            <EmptyState 
              icon={ImageIcon} 
              title="Galeri Kosong" 
              description="Belum ada foto yang diunggah ke galeri." 
              action={
                <Button onClick={handleOpenModal} leftIcon={<Plus className="w-4 h-4" />} variant="outline">
                  Unggah Foto Pertama
                </Button>
              }
            />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {data.data.map((img) => (
                <div key={img.id} className="group relative aspect-square rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                  <img 
                    src={getImageUrl(img.imageUrl)} 
                    alt={img.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3">
                    <div className="flex justify-end">
                      <button 
                        onClick={() => handleDelete(img.id)}
                        disabled={isDeleting}
                        className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-lg transition-colors disabled:opacity-50"
                        title="Hapus foto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm line-clamp-2 leading-tight">{img.title}</p>
                      <p className="text-slate-300 text-[10px] mt-1">{formatDate(img.createdAt)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {data.meta.totalPages > 1 && (
              <div className="mt-8 flex justify-center border-t border-slate-100 dark:border-slate-800 pt-6">
                <Pagination 
                  currentPage={data.meta.page}
                  totalPages={data.meta.totalPages}
                  onPageChange={setPage}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Upload Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        title="Unggah Foto Galeri"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          
          {/* Image Upload Area */}
          <div>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 dark:border-slate-700 border-dashed rounded-xl relative overflow-hidden group">
              {imagePreview ? (
                <div className="relative w-full aspect-square max-h-64">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                    <label className="cursor-pointer bg-white text-slate-900 px-4 py-2 rounded-lg font-medium text-sm shadow-xl">
                      Ganti Gambar
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                    </label>
                  </div>
                </div>
              ) : (
                <div className="space-y-1 text-center py-8">
                  <ImageIcon className="mx-auto h-12 w-12 text-slate-400" />
                  <div className="flex text-sm text-slate-600 dark:text-slate-400 justify-center mt-4">
                    <label className="relative cursor-pointer bg-transparent rounded-md font-medium text-emerald-600 hover:text-emerald-500 focus-within:outline-none">
                      <span>Pilih file gambar</span>
                      <input type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                    </label>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">PNG, JPG, WEBP hingga 5MB</p>
                </div>
              )}
            </div>
            {!imageFile && <p className="mt-2 text-xs text-red-500">Gambar wajib diunggah.</p>}
          </div>

          <Input 
            label="Judul Foto / Deskripsi Singkat" 
            placeholder="Misal: Kegiatan Imunisasi Balita RW 05" 
            {...register('title')}
            error={errors.title?.message}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="ghost" onClick={handleCloseModal}>Batal</Button>
            <Button type="submit" isLoading={isCreating || isUploading}>
              Unggah
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
