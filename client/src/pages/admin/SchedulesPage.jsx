import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAdminSchedules } from '../../hooks/useAdminData';
import DataTable from '../../components/ui/DataTable';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import { Plus, Edit2, Trash2, Calendar, MapPin, Clock } from 'lucide-react';
import { formatDate } from '../../utils/format';

const scheduleSchema = z.object({
  activityName: z.string().min(1, 'Nama kegiatan wajib diisi'),
  date: z.string().min(1, 'Tanggal wajib diisi'),
  startTime: z.string().min(1, 'Waktu mulai wajib diisi'),
  endTime: z.string().min(1, 'Waktu selesai wajib diisi'),
  location: z.string().min(1, 'Lokasi wajib diisi'),
  description: z.string().optional(),
});

export default function SchedulesPage() {
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const {
    data,
    isLoading,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    isCreating,
    isUpdating,
    isDeleting,
  } = useAdminSchedules({ page, limit: 10 });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(scheduleSchema),
  });

  const handleOpenModal = (schedule = null) => {
    if (schedule) {
      setEditingId(schedule.id);
      setValue('activityName', schedule.activityName);
      // Format date for datetime-local or date input
      const dateObj = new Date(schedule.date);
      const formattedDate = dateObj.toISOString().split('T')[0];
      setValue('date', formattedDate);
      setValue('startTime', schedule.startTime);
      setValue('endTime', schedule.endTime);
      setValue('location', schedule.location);
      setValue('description', schedule.description || '');
    } else {
      setEditingId(null);
      reset({ activityName: '', date: '', startTime: '', endTime: '', location: '', description: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    reset();
    setEditingId(null);
  };

  const onSubmit = (formData) => {
    // Backend expects ISO string for date
    const dateObj = new Date(formData.date);
    const payload = { ...formData, date: dateObj.toISOString() };

    if (editingId) {
      updateSchedule({ id: editingId, data: payload }, {
        onSuccess: () => handleCloseModal()
      });
    } else {
      createSchedule(payload, {
        onSuccess: () => handleCloseModal()
      });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus jadwal ini?')) {
      deleteSchedule(id);
    }
  };

  const columns = [
    { 
      header: 'Kegiatan', 
      accessor: (row) => (
        <div className="py-2 group">
          <div className="font-bold text-content dark:text-white group-hover:text-primary-800 dark:group-hover:text-primary-400 transition-colors text-base">{row.activityName}</div>
          <div className="text-sm font-medium text-content-muted dark:text-gray-400 mt-1 line-clamp-2 leading-snug">{row.description}</div>
        </div>
      ) 
    },
    { 
      header: 'Waktu Pelaksanaan', 
      accessor: (row) => (
        <div className="flex flex-col gap-1.5 py-2">
          <span className="inline-flex items-center gap-2 text-sm text-primary-800 dark:text-primary-400 font-bold bg-primary-50 dark:bg-primary-900/20 px-3 py-1.5 rounded-lg w-fit border border-primary-100 dark:border-primary-800/30">
            <Calendar className="w-4 h-4" /> {formatDate(row.date)}
          </span>
          <span className="flex items-center gap-2 text-sm font-medium text-content-muted dark:text-gray-400 px-1">
            <Clock className="w-4 h-4 opacity-70" /> {row.startTime} - {row.endTime}
          </span>
        </div>
      ) 
    },
    { 
      header: 'Lokasi', 
      accessor: (row) => (
        <span className="flex items-center gap-2 text-content dark:text-gray-300 font-medium">
          <MapPin className="w-4 h-4 text-primary-600" /> {row.location}
        </span>
      ) 
    },
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
          <h1 className="text-3xl font-heading font-bold text-content dark:text-white tracking-tight">Jadwal Kegiatan</h1>
          <p className="text-base font-medium text-content-muted dark:text-gray-400 mt-2">Kelola agenda dan jadwal pelayanan posyandu.</p>
        </div>
        <Button onClick={() => handleOpenModal()} leftIcon={<Plus className="w-5 h-5" />} className="px-6 py-2.5 rounded-xl shadow-sm hover:shadow-soft-xl transition-all font-bold">
          Tambah Jadwal
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
            icon: Calendar,
            title: 'Tidak ada jadwal',
            description: 'Belum ada jadwal kegiatan yang ditambahkan.',
            action: (
              <Button onClick={() => handleOpenModal()} leftIcon={<Plus className="w-4 h-4" />} variant="outline" className="rounded-xl border-surface-300 dark:border-gray-600">
                Buat Jadwal Pertama
              </Button>
            )
          }}
        />
      </div>

      {/* Form Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        title={editingId ? 'Edit Jadwal' : 'Tambah Jadwal Baru'}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-2">
          <Input 
            label="Nama Kegiatan" 
            placeholder="Misal: Posyandu Balita Mawar 1" 
            {...register('activityName')}
            error={errors.activityName?.message}
            className="font-bold text-lg"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
              type="date"
              label="Tanggal Pelaksanaan" 
              {...register('date')}
              error={errors.date?.message}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input 
                type="time"
                label="Mulai" 
                {...register('startTime')}
                error={errors.startTime?.message}
              />
              <Input 
                type="time"
                label="Selesai" 
                {...register('endTime')}
                error={errors.endTime?.message}
              />
            </div>
          </div>
          <Input 
            label="Lokasi" 
            placeholder="Misal: Balai RW 05" 
            {...register('location')}
            error={errors.location?.message}
          />
          <div>
            <label className="block text-sm font-bold text-content dark:text-gray-300 mb-2">Deskripsi / Keterangan (Opsional)</label>
            <textarea
              {...register('description')}
              className="w-full px-5 py-3.5 rounded-xl border border-surface-200 dark:border-gray-700 bg-surface-50 dark:bg-gray-900 text-content dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 hover:border-primary-300 transition-all resize-y min-h-[120px] font-medium placeholder-content-muted/50"
              placeholder="Tambahkan keterangan tambahan jika ada..."
            />
          </div>
          <div className="flex justify-end gap-3 pt-6 border-t border-surface-100 dark:border-gray-700">
            <Button type="button" variant="ghost" onClick={handleCloseModal} className="rounded-xl">Batal</Button>
            <Button type="submit" isLoading={isCreating || isUpdating} className="rounded-xl px-6">
              {editingId ? 'Simpan Perubahan' : 'Tambahkan Jadwal'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
