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
        <div>
          <div className="font-medium text-slate-900 dark:text-white">{row.activityName}</div>
          <div className="text-xs text-slate-500 mt-1 line-clamp-1">{row.description}</div>
        </div>
      ) 
    },
    { 
      header: 'Waktu Pelaksanaan', 
      accessor: (row) => (
        <div className="flex flex-col gap-1">
          <span className="flex items-center gap-1.5 text-sm text-emerald-600 dark:text-emerald-400 font-medium">
            <Calendar className="w-4 h-4" /> {formatDate(row.date)}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-slate-500">
            <Clock className="w-3.5 h-3.5" /> {row.startTime} - {row.endTime}
          </span>
        </div>
      ) 
    },
    { 
      header: 'Lokasi', 
      accessor: (row) => (
        <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
          <MapPin className="w-4 h-4 text-slate-400" /> {row.location}
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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Jadwal Kegiatan</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Kelola agenda dan jadwal pelayanan posyandu.</p>
        </div>
        <Button onClick={() => handleOpenModal()} leftIcon={<Plus className="w-4 h-4" />}>
          Tambah Jadwal
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
          icon: Calendar,
          title: 'Tidak ada jadwal',
          description: 'Belum ada jadwal kegiatan yang ditambahkan.',
          action: (
            <Button onClick={() => handleOpenModal()} leftIcon={<Plus className="w-4 h-4" />} variant="outline">
              Buat Jadwal Pertama
            </Button>
          )
        }}
      />

      {/* Form Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        title={editingId ? 'Edit Jadwal' : 'Tambah Jadwal Baru'}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input 
            label="Nama Kegiatan" 
            placeholder="Misal: Posyandu Balita Mawar 1" 
            {...register('activityName')}
            error={errors.activityName?.message}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input 
              type="date"
              label="Tanggal Pelaksanaan" 
              {...register('date')}
              error={errors.date?.message}
            />
            <div className="grid grid-cols-2 gap-2">
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
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Deskripsi / Keterangan (Opsional)</label>
            <textarea
              {...register('description')}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-y min-h-[100px]"
              placeholder="Tambahkan keterangan tambahan jika ada..."
            />
          </div>
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
