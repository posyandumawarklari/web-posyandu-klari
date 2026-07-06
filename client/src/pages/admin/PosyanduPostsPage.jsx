import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAdminPosyanduPosts } from '../../hooks/useAdminData';
import DataTable from '../../components/ui/DataTable';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import { Plus, Edit2, Trash2, MapPin } from 'lucide-react';
import { formatDate } from '../../utils/format';

const posyanduSchema = z.object({
  name: z.string().min(1, 'Nama Posyandu wajib diisi'),
  area: z.string().min(1, 'Area/Dusun wajib diisi'),
  location: z.string().min(1, 'Lokasi kegiatan wajib diisi'),
  mapX: z.string().min(1, 'Koordinat X wajib diisi'),
  mapY: z.string().min(1, 'Koordinat Y wajib diisi'),
  headName: z.string().min(1, 'Nama ketua kader wajib diisi'),
  headPhone: z.string().min(1, 'Nomor HP ketua kader wajib diisi'),
  cadresString: z.string().min(1, 'Daftar kader wajib diisi (pisahkan dengan baris baru)'),
});

export default function PosyanduPostsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const {
    data: rawData,
    isLoading,
    createPosyandu,
    updatePosyandu,
    deletePosyandu,
    isCreating,
    isUpdating,
    isDeleting,
  } = useAdminPosyanduPosts();
  
  // API returns data as array directly for getAll without pagination in this specific implementation 
  // (check if it wraps in { data, meta } like others. If standard controller, it returns array of objects)
  const data = Array.isArray(rawData) ? rawData : (rawData?.data || []);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(posyanduSchema),
  });

  const handleOpenModal = (posyandu = null) => {
    if (posyandu) {
      setEditingId(posyandu.id);
      setValue('name', posyandu.name);
      setValue('area', posyandu.area);
      setValue('location', posyandu.location);
      setValue('mapX', posyandu.mapX);
      setValue('mapY', posyandu.mapY);
      setValue('headName', posyandu.headName);
      setValue('headPhone', posyandu.headPhone);
      setValue('cadresString', posyandu.cadres ? posyandu.cadres.join('\n') : '');
    } else {
      setEditingId(null);
      reset({
        name: '',
        area: '',
        location: '',
        mapX: '',
        mapY: '',
        headName: '',
        headPhone: '',
        cadresString: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    reset();
    setEditingId(null);
  };

  const onSubmit = async (formData) => {
    const payload = {
      name: formData.name,
      area: formData.area,
      location: formData.location,
      mapX: formData.mapX,
      mapY: formData.mapY,
      headName: formData.headName,
      headPhone: formData.headPhone,
      cadres: formData.cadresString.split('\n').map(c => c.trim()).filter(c => c !== ''),
    };

    try {
      if (editingId) {
        updatePosyandu({ id: editingId, data: payload }, {
          onSuccess: () => handleCloseModal()
        });
      } else {
        createPosyandu(payload, {
          onSuccess: () => handleCloseModal()
        });
      }
    } catch (error) {
      console.error('Failed to save posyandu:', error);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus posyandu ini?')) {
      deletePosyandu(id);
    }
  };

  const columns = [
    { 
      header: 'Nama Posyandu', 
      accessor: (row) => (
        <div className="flex items-center gap-3 py-2">
          <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center shrink-0 border border-primary-100 dark:border-primary-800">
            <MapPin className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <div className="font-bold text-content dark:text-white text-base">{row.name}</div>
            <div className="text-sm font-medium text-content-muted dark:text-gray-400 mt-0.5">{row.area}</div>
          </div>
        </div>
      ) 
    },
    { 
      header: 'Lokasi & Ketua', 
      accessor: (row) => (
        <div className="py-2">
          <div className="font-semibold text-content dark:text-gray-200">{row.location}</div>
          <div className="text-sm text-content-muted dark:text-gray-400 mt-0.5">Ketua: {row.headName} ({row.headPhone})</div>
        </div>
      ) 
    },
    {
      header: 'Anggota Kader',
      accessor: (row) => (
        <div className="py-2 flex flex-wrap gap-1 max-w-[200px]">
          {row.cadres?.slice(0, 3).map((cadre, idx) => (
            <span key={idx} className="text-xs bg-surface-100 dark:bg-gray-800 px-2 py-1 rounded-md text-content-muted dark:text-gray-300">
              {cadre}
            </span>
          ))}
          {row.cadres?.length > 3 && (
            <span className="text-xs bg-primary-50 dark:bg-primary-900/30 px-2 py-1 rounded-md text-primary-700 dark:text-primary-400 font-medium">
              +{row.cadres.length - 3} lagi
            </span>
          )}
        </div>
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
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-content dark:text-white tracking-tight">Data Posyandu & Kader</h1>
          <p className="text-base font-medium text-content-muted dark:text-gray-400 mt-2">Kelola daftar posyandu, lokasi, dan anggota kader.</p>
        </div>
        <Button onClick={() => handleOpenModal()} leftIcon={<Plus className="w-5 h-5" />} className="px-6 py-2.5 rounded-xl shadow-sm hover:shadow-soft-xl transition-all font-bold">
          Tambah Posyandu
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-soft-xl border border-surface-200 dark:border-gray-700 overflow-hidden">
        <DataTable
          columns={columns}
          data={data}
          isLoading={isLoading}
          emptyState={{
            icon: MapPin,
            title: 'Tidak ada posyandu',
            description: 'Belum ada data posyandu yang ditambahkan.',
            action: (
              <Button onClick={() => handleOpenModal()} leftIcon={<Plus className="w-4 h-4" />} variant="outline" className="rounded-xl border-surface-300 dark:border-gray-600">
                Tambah Data Pertama
              </Button>
            )
          }}
        />
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        title={editingId ? 'Edit Posyandu' : 'Tambah Posyandu Baru'}
        maxWidth="max-w-3xl"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-2">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="Nama Posyandu" 
              placeholder="Misal: Mawar 1" 
              {...register('name')}
              error={errors.name?.message}
            />
            <Input 
              label="Area / Dusun" 
              placeholder="Misal: Jetis, Klari" 
              {...register('area')}
              error={errors.area?.message}
            />
          </div>

          <Input 
            label="Lokasi Kegiatan" 
            placeholder="Misal: Masjid al Iman" 
            {...register('location')}
            error={errors.location?.message}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="Nama Ketua Kader" 
              placeholder="Nama koordinator" 
              {...register('headName')}
              error={errors.headName?.message}
            />
            <Input 
              label="No. WhatsApp Ketua" 
              placeholder="Misal: 62812345678" 
              {...register('headPhone')}
              error={errors.headPhone?.message}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="Koordinat Peta X (%)" 
              placeholder="Misal: 35%" 
              {...register('mapX')}
              error={errors.mapX?.message}
            />
            <Input 
              label="Koordinat Peta Y (%)" 
              placeholder="Misal: 45%" 
              {...register('mapY')}
              error={errors.mapY?.message}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-content dark:text-gray-300 mb-2">
              Daftar Kader Anggota (1 nama per baris)
            </label>
            <textarea
              {...register('cadresString')}
              className="w-full px-5 py-3.5 rounded-xl border border-surface-200 dark:border-gray-700 bg-surface-50 dark:bg-gray-900 text-content dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all resize-y min-h-[140px] font-medium placeholder-content-muted/50"
              placeholder="Kartina W.&#10;Sunarni&#10;Siti S."
            />
            {errors.cadresString && <p className="mt-2 text-xs font-semibold text-red-500">{errors.cadresString.message}</p>}
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-surface-100 dark:border-gray-700">
            <Button type="button" variant="ghost" onClick={handleCloseModal} className="rounded-xl">Batal</Button>
            <Button type="submit" isLoading={isCreating || isUpdating} className="rounded-xl px-6">
              {editingId ? 'Simpan Perubahan' : 'Tambahkan Posyandu'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
