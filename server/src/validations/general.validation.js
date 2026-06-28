const { z } = require('zod');

const programSchema = z.object({
  title: z.string({ required_error: 'Judul program wajib diisi' }).min(3, 'Judul minimal 3 karakter').max(200).trim(),
  description: z.string({ required_error: 'Deskripsi wajib diisi' }).min(10, 'Deskripsi minimal 10 karakter'),
});

const gallerySchema = z.object({
  title: z.string({ required_error: 'Judul foto wajib diisi' }).min(2, 'Judul minimal 2 karakter').max(200).trim(),
  description: z.string().max(500).optional().nullable(),
});

const scheduleSchema = z.object({
  activityName: z.string({ required_error: 'Nama kegiatan wajib diisi' }).min(3, 'Nama minimal 3 karakter').max(200).trim(),
  description: z.string().max(1000).optional().nullable(),
  date: z.string({ required_error: 'Tanggal wajib diisi' }),
  time: z.string({ required_error: 'Waktu wajib diisi' }).min(3, 'Format waktu tidak valid'),
  location: z.string({ required_error: 'Lokasi wajib diisi' }).min(3, 'Lokasi minimal 3 karakter').max(200).trim(),
});

const settingsSchema = z.object({
  settings: z.array(z.object({
    key: z.string(),
    value: z.string(),
  })),
});

module.exports = { programSchema, gallerySchema, scheduleSchema, settingsSchema };
