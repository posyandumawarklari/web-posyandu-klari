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
        <div className="flex items-center gap-4 max-w-sm">
          <div className="w-16 h-12 rounded-lg bg-slate-200 dark:bg-slate-700 overflow-hidden shrink-0">
            {row.image ? (
              <img src={getImageUrl(row.image)} alt={row.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400">
                <ImageIcon className="w-5 h-5" />
              </div>
            )}
          </div>
          <div>
            <div className="font-bold text-slate-900 dark:text-white line-clamp-1">{row.title}</div>
            <div className="text-xs text-slate-500 mt-0.5 line-clamp-2">{row.description}</div>
          </div>
        </div>
      ) 
    },
    { header: 'Ditambahkan', accessor: (row) => formatDate(row.createdAt) },
    {
      header: 'Aksi',
      className: 'w-24 text-right',
      accessor: (row) => (
        <div className="flex items-center justify-end gap-2">
          <button 
            onClick={() => handleOpenModal(row)}
            className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-lg transition-colors"
            title="Edit"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button 
            onClick={() => handleDelete(row.id)}
            disabled={isDeleting}
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors disabled:opacity-50"
            title="Hapus"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Program Posyandu</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Kelola daftar layanan dan program yang tersedia.</p>
        </div>
        <Button onClick={() => handleOpenModal()} leftIcon={<Plus className="w-4 h-4" />}>
          Tambah Program
        </Button>
      </div>

      {/* Data Table */}
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
            <Button onClick={() => handleOpenModal()} leftIcon={<Plus className="w-4 h-4" />} variant="outline">
              Buat Program Pertama
            </Button>
          )
        }}
      />

      {/* Form Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        title={editingId ? 'Edit Program' : 'Tambah Program Baru'}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          
          {/* Image Upload Area */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Gambar Program</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 dark:border-slate-700 border-dashed rounded-xl relative overflow-hidden group">
              {imagePreview ? (
                <div className="relative w-full h-48">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                    <label className="cursor-pointer bg-white text-slate-900 px-4 py-2 rounded-lg font-medium text-sm">
                      Ganti Gambar
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                    </label>
                  </div>
                </div>
              ) : (
                <div className="space-y-1 text-center">
                  <ImageIcon className="mx-auto h-12 w-12 text-slate-400" />
                  <div className="flex text-sm text-slate-600 dark:text-slate-400 justify-center">
                    <label className="relative cursor-pointer bg-transparent rounded-md font-medium text-emerald-600 hover:text-emerald-500 focus-within:outline-none">
                      <span>Unggah gambar</span>
                      <input type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                    </label>
                    <p className="pl-1">atau drag and drop</p>
                  </div>
                  <p className="text-xs text-slate-500">PNG, JPG, WEBP hingga 5MB</p>
                </div>
              )}
            </div>
          </div>

          <Input 
            label="Nama Program" 
            placeholder="Misal: Posyandu Balita" 
            {...register('title')}
            error={errors.title?.message}
          />
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Deskripsi Lengkap</label>
            <textarea
              {...register('description')}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-y min-h-[120px]"
              placeholder="Jelaskan secara detail mengenai program ini..."
            />
            {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="ghost" onClick={handleCloseModal}>Batal</Button>
            <Button type="submit" isLoading={isCreating || isUpdating || isUploading}>
              {editingId ? 'Simpan Perubahan' : 'Tambahkan'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
