import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAdminTags } from '../../hooks/useAdminData';
import DataTable from '../../components/ui/DataTable';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import { Plus, Edit2, Trash2, Tag } from 'lucide-react';
import { formatDate } from '../../utils/format';

const tagSchema = z.object({
  name: z.string().min(1, 'Nama tag wajib diisi'),
});

export default function TagsPage() {
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const {
    data,
    isLoading,
    createTag,
    updateTag,
    deleteTag,
    isCreating,
    isUpdating,
    isDeleting,
  } = useAdminTags({ page, limit: 10 });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(tagSchema),
  });

  const handleOpenModal = (tag = null) => {
    if (tag) {
      setEditingId(tag.id);
      setValue('name', tag.name);
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
      updateTag({ id: editingId, data: formData }, {
        onSuccess: () => handleCloseModal()
      });
    } else {
      createTag(formData, {
        onSuccess: () => handleCloseModal()
      });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus tag ini?')) {
      deleteTag(id);
    }
  };

  const columns = [
    { 
      header: 'Nama Tag', 
      accessor: (row) => (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-50 dark:bg-gray-800 text-sm font-bold text-content dark:text-gray-300 border border-surface-200 dark:border-gray-700">
          <Tag className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
          {row.name}
        </span>
      ) 
    },
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
          <h1 className="text-3xl font-heading font-bold text-content dark:text-white tracking-tight">Tag Artikel</h1>
          <p className="text-base font-medium text-content-muted dark:text-gray-400 mt-2">Kelola tag untuk mengkategorikan spesifik topik artikel.</p>
        </div>
        <Button onClick={() => handleOpenModal()} leftIcon={<Plus className="w-5 h-5" />} className="px-6 py-2.5 rounded-xl shadow-sm hover:shadow-soft-xl transition-all font-bold">
          Tambah Tag
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
            icon: Tag,
            title: 'Tidak ada tag',
            description: 'Belum ada tag yang dibuat.',
            action: (
              <Button onClick={() => handleOpenModal()} leftIcon={<Plus className="w-4 h-4" />} variant="outline" className="rounded-xl border-surface-300 dark:border-gray-600">
                Buat Tag Pertama
              </Button>
            )
          }}
        />
      </div>

      {/* Form Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        title={editingId ? 'Edit Tag' : 'Tambah Tag Baru'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-2">
          <Input 
            label="Nama Tag" 
            placeholder="Misal: imunisasi" 
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
