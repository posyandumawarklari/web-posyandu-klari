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
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300">
          <Tag className="w-3 h-3 text-emerald-500" />
          {row.name}
        </span>
      ) 
    },
    { header: 'Slug', accessor: 'slug', className: 'text-slate-500' },
    { header: 'Dibuat Pada', accessor: (row) => formatDate(row.createdAt) },
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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Tag Artikel</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Kelola tag untuk mengkategorikan spesifik topik artikel.</p>
        </div>
        <Button onClick={() => handleOpenModal()} leftIcon={<Plus className="w-4 h-4" />}>
          Tambah Tag
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
          icon: Tag,
          title: 'Tidak ada tag',
          description: 'Belum ada tag yang dibuat.',
          action: (
            <Button onClick={() => handleOpenModal()} leftIcon={<Plus className="w-4 h-4" />} variant="outline">
              Buat Tag Pertama
            </Button>
          )
        }}
      />

      {/* Form Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        title={editingId ? 'Edit Tag' : 'Tambah Tag Baru'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input 
            label="Nama Tag" 
            placeholder="Misal: imunisasi" 
            {...register('name')}
            error={errors.name?.message}
          />
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="ghost" onClick={handleCloseModal}>Batal</Button>
            <Button type="submit" isLoading={isCreating || isUpdating}>
              {editingId ? 'Simpan Perubahan' : 'Tambahkan'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
