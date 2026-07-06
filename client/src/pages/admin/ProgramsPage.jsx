import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAdminPrograms } from '../../hooks/useAdminData';
import DataTable from '../../components/ui/DataTable';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import { Plus, Edit2, Trash2, Users, Image as ImageIcon } from 'lucide-react';
import { formatDate, getImageUrl } from '../../utils/format';
import { api } from '../../services/api'; // For direct image upload

const programSchema = z.object({
  title: z.string().min(1, 'Judul program wajib diisi'),
  description: z.string().min(1, 'Deskripsi wajib diisi'),
});

export default function ProgramsPage() {
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Image state
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const {
    data,
    isLoading,
    createProgram,
    updateProgram,
    deleteProgram,
    isCreating,
    isUpdating,
    isDeleting,
  } = useAdminPrograms({ page, limit: 10 });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(programSchema),
  });

  const handleOpenModal = (program = null) => {
    if (program) {
      setEditingId(program.id);
      setValue('title', program.title);
      setValue('description', program.description);
      setImagePreview(program.image ? getImageUrl(program.image) : null);
    } else {
      setEditingId(null);
      reset({ title: '', description: '' });
      setImagePreview(null);
    }
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    reset();
    setEditingId(null);
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
    setIsUploading(true);
    const payload = { ...formData };
    if (imageFile) {
      payload.image = imageFile;
    }

    try {
      if (editingId) {
        updateProgram({ id: editingId, data: payload }, {
          onSuccess: () => handleCloseModal()
        });
      } else {
        createProgram(payload, {
          onSuccess: () => handleCloseModal()
        });
      }
    } catch (error) {
      console.error('Failed to save program:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus program ini?')) {
      deleteProgram(id);
    }
  };

  const columns = [
    { 
      header: 'Program', 
      accessor: (row) => (
        <div className="flex items-center gap-5 max-w-sm py-2">
          <div className="w-20 h-16 rounded-xl bg-surface-100 dark:bg-gray-800 overflow-hidden shrink-0 border border-surface-200 dark:border-gray-700 shadow-sm">
            {row.image ? (
              <img src={getImageUrl(row.image)} alt={row.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-primary-300 dark:text-primary-800/40 bg-primary-50 dark:bg-primary-900/20">
                <ImageIcon className="w-6 h-6" />
              </div>
            )}
          </div>
          <div className="group">
            <div className="font-bold text-content dark:text-white line-clamp-1 group-hover:text-primary-800 dark:group-hover:text-primary-400 transition-colors text-base">{row.title}</div>
            <div className="text-sm font-medium text-content-muted dark:text-gray-400 mt-1 line-clamp-2 leading-snug">{row.description}</div>
          </div>
        </div>
      ) 
    },
    { header: 'Ditambahkan', accessor: (row) => <span className="font-medium">{formatDate(row.createdAt)}</span> },
    {
      header: 'Aksi',
      className: 'w-24 text-right',
      accessor: (row) => (
        <div className="flex items-center justify-end gap-2">
          <button 
            onClick={() => handleOpenModal(row)}
            className="p-2 text-content-muted hover:text-primary-800 hover:bg-primary-50 dark:hover:bg-primary-900/30 dark:hover:text-primary-400 rounded-xl transition-all"
            title="Edit"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button 
            onClick={() => handleDelete(row.id)}
            disabled={isDeleting}
            className="p-2 text-content-muted hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 dark:hover:text-red-400 rounded-xl transition-all disabled:opacity-50"
            title="Hapus"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-content dark:text-white tracking-tight">Program Posyandu</h1>
          <p className="text-base font-medium text-content-muted dark:text-gray-400 mt-2">Kelola daftar layanan dan program yang tersedia.</p>
        </div>
        <Button onClick={() => handleOpenModal()} leftIcon={<Plus className="w-5 h-5" />} className="px-6 py-2.5 rounded-xl shadow-sm hover:shadow-soft-xl transition-all font-bold">
          Tambah Program
        </Button>
      </div>

      {/* Data Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-soft-xl border border-surface-200 dark:border-gray-700 overflow-hidden">
        <DataTable
          columns={columns}
          data={data?.data}
          isLoading={isLoading}
          pagination={{
            currentPage: data?.meta?.page || 1,
            totalPages: data?.meta?.totalPages || 1,
            onPageChange: setPage,
          }}
          emptyState={{
            icon: Users,
            title: 'Tidak ada program',
            description: 'Belum ada program posyandu yang ditambahkan.',
            action: (
              <Button onClick={() => handleOpenModal()} leftIcon={<Plus className="w-4 h-4" />} variant="outline" className="rounded-xl border-surface-300 dark:border-gray-600">
                Buat Program Pertama
              </Button>
            )
          }}
        />
      </div>

      {/* Form Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        title={editingId ? 'Edit Program' : 'Tambah Program Baru'}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-2">
          
          {/* Image Upload Area */}
          <div>
            <label className="block text-sm font-bold text-content dark:text-gray-300 mb-3">Gambar Program</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-surface-200 dark:border-gray-700 border-dashed rounded-xl relative overflow-hidden group hover:border-primary-400 dark:hover:border-primary-600 transition-colors bg-surface-50 dark:bg-gray-900/50">
              {imagePreview ? (
                <div className="relative w-full h-56 rounded-lg overflow-hidden shadow-sm">
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
                      <span>Unggah Gambar</span>
                      <input type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                    </label>
                  </div>
                  <p className="text-xs font-medium text-content-muted dark:text-gray-500">PNG, JPG, WEBP hingga 5MB</p>
                </div>
              )}
            </div>
          </div>

          <Input 
            label="Nama Program" 
            placeholder="Misal: Posyandu Balita" 
            {...register('title')}
            error={errors.title?.message}
            className="text-lg font-bold placeholder-content-muted/50"
          />
          <div>
            <label className="block text-sm font-bold text-content dark:text-gray-300 mb-2">Deskripsi Lengkap</label>
            <textarea
              {...register('description')}
              className="w-full px-5 py-3.5 rounded-xl border border-surface-200 dark:border-gray-700 bg-surface-50 dark:bg-gray-900 text-content dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 hover:border-primary-300 transition-all resize-y min-h-[140px] font-medium placeholder-content-muted/50"
              placeholder="Jelaskan secara detail mengenai program ini..."
            />
            {errors.description && <p className="mt-2 text-xs font-semibold text-red-500">{errors.description.message}</p>}
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-surface-100 dark:border-gray-700">
            <Button type="button" variant="ghost" onClick={handleCloseModal} className="rounded-xl">Batal</Button>
            <Button type="submit" isLoading={isCreating || isUpdating || isUploading} className="rounded-xl px-6">
              {editingId ? 'Simpan Perubahan' : 'Tambahkan Program'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
