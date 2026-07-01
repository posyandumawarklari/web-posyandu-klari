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
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden shrink-0">
            {row.avatar ? (
              <img src={row.avatar} alt={row.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                {row.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <div className="font-medium text-slate-900 dark:text-white">{row.name}</div>
            <div className="text-xs text-slate-500">{row.email}</div>
          </div>
        </div>
      ) 
    },
    { header: 'Peran', accessor: (row) => getRoleBadge(row.role) },
    { header: 'Terdaftar', accessor: (row) => formatDate(row.createdAt) },
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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Kelola Pengguna</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manajemen akun admin dan kader posyandu.</p>
        </div>
        <Button onClick={() => handleOpenModal()} leftIcon={<Plus className="w-4 h-4" />}>
          Tambah Pengguna
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
          title: 'Tidak ada pengguna',
          description: 'Sistem belum memiliki data pengguna selain Anda.',
        }}
      />

      {/* Form Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        title={editingId ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input 
            label="Nama Lengkap" 
            placeholder="Masukkan nama lengkap" 
            {...register('name')}
            error={errors.name?.message}
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
