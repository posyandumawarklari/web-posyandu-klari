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
    <div className="space-y-8 animate-in fade-in duration-700 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-content dark:text-white tracking-tight">Galeri Foto</h1>
          <p className="text-base font-medium text-content-muted dark:text-gray-400 mt-2">Dokumentasikan kegiatan posyandu dalam bentuk foto.</p>
        </div>
        <Button onClick={handleOpenModal} leftIcon={<Plus className="w-5 h-5" />} className="px-6 py-2.5 rounded-xl shadow-sm hover:shadow-soft-xl transition-all font-bold">
          Unggah Foto
        </Button>
      </div>

      {/* Grid Content */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-soft-xl border border-surface-200 dark:border-gray-700 p-8">
        
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="aspect-square rounded-2xl" />)}
          </div>
        ) : !data?.data || data.data.length === 0 ? (
          <div className="py-16">
            <EmptyState 
              icon={ImageIcon} 
              title="Galeri Kosong" 
              description="Belum ada foto yang diunggah ke galeri." 
              action={
                <Button onClick={handleOpenModal} leftIcon={<Plus className="w-4 h-4" />} variant="outline" className="rounded-xl border-surface-300 dark:border-gray-600">
                  Unggah Foto Pertama
                </Button>
              }
            />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {data.data.map((img) => (
                <div key={img.id} className="group relative aspect-square rounded-2xl overflow-hidden bg-surface-50 dark:bg-gray-900 border border-surface-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-500">
                  <img 
                    src={getImageUrl(img.imageUrl)} 
                    alt={img.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                   onError={(e) => { e.target.onerror = null; e.target.src="/placeholder-image.jpg"; }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
                    <div className="flex justify-end translate-y-[-10px] group-hover:translate-y-0 transition-transform duration-300">
                      <button 
                        onClick={() => handleDelete(img.id)}
                        disabled={isDeleting}
                        className="p-2.5 bg-red-500/90 hover:bg-red-600 text-white rounded-xl shadow-lg transition-colors disabled:opacity-50 backdrop-blur-sm"
                        title="Hapus foto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="translate-y-[10px] group-hover:translate-y-0 transition-transform duration-300">
                      <p className="text-white font-bold text-sm line-clamp-2 leading-tight drop-shadow-md">{img.title}</p>
                      <p className="text-gray-300 font-medium text-xs mt-1.5 drop-shadow-md">{formatDate(img.createdAt)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {data.meta.totalPages > 1 && (
              <div className="mt-10 flex justify-center border-t border-surface-100 dark:border-gray-700 pt-8">
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-2">
          
          {/* Image Upload Area */}
          <div>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-surface-200 dark:border-gray-700 border-dashed rounded-xl relative overflow-hidden group hover:border-primary-400 dark:hover:border-primary-600 transition-colors bg-surface-50 dark:bg-gray-900/50">
              {imagePreview ? (
                <div className="relative w-full aspect-square max-h-64 rounded-lg overflow-hidden shadow-sm">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"  onError={(e) => { e.target.onerror = null; e.target.src="/placeholder-image.jpg"; }} />
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <label className="cursor-pointer bg-white text-content px-5 py-2.5 rounded-xl font-bold text-sm shadow-xl hover:bg-surface-50 transition-colors">
                      Ganti Gambar
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                    </label>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 text-center py-8">
                  <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto shadow-sm border border-surface-100 dark:border-gray-700">
                    <ImageIcon className="h-8 w-8 text-primary-800/40 dark:text-primary-400/40" />
                  </div>
                  <div className="flex text-sm font-bold text-content dark:text-gray-300 justify-center">
                    <label className="relative cursor-pointer bg-transparent rounded-md text-primary-800 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 transition-colors focus-within:outline-none">
                      <span>Pilih File Gambar</span>
                      <input type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                    </label>
                  </div>
                  <p className="text-xs font-medium text-content-muted dark:text-gray-500">PNG, JPG, WEBP hingga 5MB</p>
                </div>
              )}
            </div>
            {!imageFile && <p className="mt-2 text-xs font-semibold text-red-500">Gambar wajib diunggah.</p>}
          </div>

          <Input 
            label="Judul Foto / Deskripsi Singkat" 
            placeholder="Misal: Kegiatan Imunisasi Balita RW 05" 
            {...register('title')}
            error={errors.title?.message}
          />

          <div className="flex justify-end gap-3 pt-6 border-t border-surface-100 dark:border-gray-700">
            <Button type="button" variant="ghost" onClick={handleCloseModal} className="rounded-xl">Batal</Button>
            <Button type="submit" isLoading={isCreating || isUploading} className="rounded-xl px-6">
              Unggah Foto
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
