const { z } = require('zod');

const posyanduValidation = {
  create: z.object({
    name: z.string({ required_error: 'Nama Posyandu wajib diisi' }).min(1, 'Nama Posyandu wajib diisi'),
    area: z.string({ required_error: 'Area/Dusun wajib diisi' }).min(1, 'Area/Dusun wajib diisi'),
    location: z.string({ required_error: 'Lokasi kegiatan wajib diisi' }).min(1, 'Lokasi kegiatan wajib diisi'),
    mapX: z.string({ required_error: 'Koordinat X peta wajib diisi' }).min(1, 'Koordinat X peta wajib diisi'),
    mapY: z.string({ required_error: 'Koordinat Y peta wajib diisi' }).min(1, 'Koordinat Y peta wajib diisi'),
    headName: z.string({ required_error: 'Nama ketua kader wajib diisi' }).min(1, 'Nama ketua kader wajib diisi'),
    headPhone: z.string({ required_error: 'Nomor HP ketua kader wajib diisi' }).min(1, 'Nomor HP ketua kader wajib diisi'),
    cadres: z.array(z.string()).min(1, 'Minimal harus ada 1 nama kader anggota')
  }),

  update: z.object({
    name: z.string().min(1).optional(),
    area: z.string().min(1).optional(),
    location: z.string().min(1).optional(),
    mapX: z.string().min(1).optional(),
    mapY: z.string().min(1).optional(),
    headName: z.string().min(1).optional(),
    headPhone: z.string().min(1).optional(),
    cadres: z.array(z.string()).min(1).optional()
  })
};

module.exports = posyanduValidation;
