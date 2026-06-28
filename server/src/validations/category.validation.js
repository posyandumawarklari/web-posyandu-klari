const { z } = require('zod');

const categorySchema = z.object({
  name: z
    .string({ required_error: 'Nama kategori wajib diisi' })
    .min(2, 'Nama kategori minimal 2 karakter')
    .max(100, 'Nama kategori maksimal 100 karakter')
    .trim(),
});

module.exports = { categorySchema };
