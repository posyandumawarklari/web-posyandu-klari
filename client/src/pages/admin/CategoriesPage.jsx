import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAdminCategories } from '../../hooks/useAdminData';
import DataTable from '../../components/ui/DataTable';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import { Plus, Edit2, Trash2, Folder } from 'lucide-react';
import { formatDate } from '../../utils/format';

const categorySchema = z.object({
  name: z.string().min(1, 'Nama kategori wajib diisi'),
});

export default function CategoriesPage() {
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const {
    data,
    isLoading,
    createCategory,
    updateCategory,
    deleteCategory,
    isCreating,
    isUpdating,
    isDeleting,
  } = useAdminCategories({ page, limit: 10 });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(categorySchema),
  });

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditingId(category.id);
      setValue('name', category.name);
    } else {
      setEditingId(null);
      reset({ name: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    reset();
    setEditingId(null);
  };

  const onSubmit = (formData) => {
    if (editingId) {
      updateCategory({ id: editingId, data: formData }, {
        onSuccess: () => handleCloseModal()
      });
    } else {
      createCategory(formData, {
        onSuccess: () => handleCloseModal()
      });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus kategori ini? Artikel yang terkait mungkin akan kehilangan kategorinya.')) {
      deleteCategory(id);
    }
  };

  const columns = [
    { header: 'Nama Kategori', accessor: (row) => <span className="font-bold text-content dark:text-white text-base">{row.name}</span> },
    { header: 'Slug', accessor: 'slug', className: 'text-content-muted font-medium' },
    { header: 'Dibuat Pada', accessor: (row) => <span className="font-medium">{formatDate(row.createdAt)}</span> },
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
          <h1 className="text-3xl font-heading font-bold text-content dark:text-white tracking-tight">Kategori Artikel</h1>
          <p className="text-base font-medium text-content-muted dark:text-gray-400 mt-2">Kelola kategori untuk mengelompokkan artikel Anda.</p>
        </div>
        <Button onClick={() => handleOpenModal()} leftIcon={<Plus className="w-5 h-5" />} className="px-6 py-2.5 rounded-xl shadow-sm hover:shadow-soft-xl transition-all font-bold">
          Tambah Kategori
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
            icon: Folder,
            title: 'Tidak ada kategori',
            description: 'Anda belum membuat kategori artikel satupun.',
            action: (
              <Button onClick={() => handleOpenModal()} leftIcon={<Plus className="w-4 h-4" />} variant="outline" className="rounded-xl border-surface-300 dark:border-gray-600">
                Buat Kategori Pertama
              </Button>
            )
          }}
        />
      </div>

      {/* Form Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        title={editingId ? 'Edit Kategori' : 'Tambah Kategori Baru'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-2">
          <Input 
            label="Nama Kategori" 
            placeholder="Misal: Kesehatan Anak" 
            {...register('name')}
            error={errors.name?.message}
          />
          <div className="flex justify-end gap-3 pt-6 border-t border-surface-100 dark:border-gray-700">
            <Button type="button" variant="ghost" onClick={handleCloseModal} className="rounded-xl">Batal</Button>
            <Button type="submit" isLoading={isCreating || isUpdating} className="rounded-xl px-6">
              {editingId ? 'Simpan Perubahan' : 'Tambahkan'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
