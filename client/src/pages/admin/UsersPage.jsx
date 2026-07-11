import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAdminUsers } from '../../hooks/useAdminData';
import DataTable from '../../components/ui/DataTable';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Modal from '../../components/ui/Modal';
import Badge from '../../components/ui/Badge';
import { Plus, Edit2, Trash2, Users } from 'lucide-react';
import { formatDate } from '../../utils/format';

const userSchema = z.object({
  name: z.string().min(1, 'Nama wajib diisi'),
  email: z.string().email('Format email tidak valid'),
  role: z.enum(['ADMIN', 'CADRE', 'USER']),
  password: z.string().min(6, 'Password minimal 6 karakter').optional().or(z.literal('')),
});

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const {
    data,
    isLoading,
    createUser,
    updateUser,
    deleteUser,
    isCreating,
    isUpdating,
    isDeleting,
  } = useAdminUsers({ page, limit: 10 });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      role: 'KADER'
    }
  });

  const handleOpenModal = (user = null) => {
    if (user) {
      setEditingId(user.id);
      reset({ ...user, password: '' });
    } else {
      setEditingId(null);
      reset({ name: '', email: '', role: 'CADRE', password: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    reset();
    setEditingId(null);
  };

  const onSubmit = (formData) => {
    // If editing and password is empty, remove it from payload
    const payload = { ...formData };
    if (editingId && !payload.password) {
      delete payload.password;
    }

    if (editingId) {
      updateUser({ id: editingId, data: payload }, {
        onSuccess: () => handleCloseModal()
      });
    } else {
      // Create requires password
      if (!payload.password) {
        alert('Password wajib diisi untuk pengguna baru');
        return;
      }
      createUser(payload, {
        onSuccess: () => handleCloseModal()
      });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) {
      deleteUser(id);
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'ADMIN': return <Badge variant="primary">Admin</Badge>;
      case 'CADRE': return <Badge variant="success">Kader</Badge>;
      case 'USER': return <Badge variant="default">User</Badge>;
      default: return <Badge>{role}</Badge>;
    }
  };

  const columns = [
    { 
      header: 'Pengguna', 
      accessor: (row) => (
        <div className="flex items-center gap-4 py-1">
          <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 overflow-hidden shrink-0 border border-primary-200 dark:border-primary-800/30 shadow-sm flex items-center justify-center text-primary-700 dark:text-primary-300 font-bold text-lg">
            {row.avatar ? (
              <img src={row.avatar} alt={row.name} className="w-full h-full object-cover"  onError={(e) => { e.target.onerror = null; e.target.src="/placeholder-image.jpg"; }} />
            ) : (
              row.name.charAt(0).toUpperCase()
            )}
          </div>
          <div>
            <div className="font-bold text-content dark:text-white text-base">{row.name}</div>
            <div className="text-sm font-medium text-content-muted dark:text-gray-400 mt-0.5">{row.email}</div>
          </div>
        </div>
      ) 
    },
    { header: 'Peran', accessor: (row) => getRoleBadge(row.role) },
    { header: 'Terdaftar', accessor: (row) => <span className="font-medium">{formatDate(row.createdAt)}</span> },
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
          <h1 className="text-3xl font-heading font-bold text-content dark:text-white tracking-tight">Kelola Pengguna</h1>
          <p className="text-base font-medium text-content-muted dark:text-gray-400 mt-2">Manajemen akun admin, kader, dan pengguna posyandu.</p>
        </div>
        <Button onClick={() => handleOpenModal()} leftIcon={<Plus className="w-5 h-5" />} className="px-6 py-2.5 rounded-xl shadow-sm hover:shadow-soft-xl transition-all font-bold">
          Tambah Pengguna
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
            title: 'Tidak ada pengguna',
            description: 'Sistem belum memiliki data pengguna selain Anda.',
          }}
        />
      </div>

      {/* Form Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        title={editingId ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-2">
          <Input 
            label="Nama Lengkap" 
            placeholder="Masukkan nama lengkap" 
            {...register('name')}
            error={errors.name?.message}
            className="font-bold"
          />
          <Input 
            label="Alamat Email" 
            type="email"
            placeholder="email@example.com" 
            {...register('email')}
            error={errors.email?.message}
          />
          <Select label="Peran" {...register('role')} error={errors.role?.message}>
            <option value="USER">Public User</option>
            <option value="CADRE">Kader</option>
            <option value="ADMIN">Administrator</option>
          </Select>
          <Input 
            label="Password" 
            type="password"
            placeholder={editingId ? 'Kosongkan jika tidak ingin diubah' : 'Minimal 6 karakter'} 
            {...register('password')}
            error={errors.password?.message}
            helperText={editingId ? 'Biarkan kosong untuk mempertahankan password lama.' : ''}
          />

          <div className="flex justify-end gap-3 pt-6 border-t border-surface-100 dark:border-gray-700">
            <Button type="button" variant="ghost" onClick={handleCloseModal} className="rounded-xl">Batal</Button>
            <Button type="submit" isLoading={isCreating || isUpdating} className="rounded-xl px-6">
              {editingId ? 'Simpan Perubahan' : 'Tambahkan Pengguna'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
