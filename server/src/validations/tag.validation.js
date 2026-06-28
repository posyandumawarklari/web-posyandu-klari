const { z } = require('zod');

const tagSchema = z.object({
  name: z
    .string({ required_error: 'Nama tag wajib diisi' })
    .min(2, 'Nama tag minimal 2 karakter')
    .max(50, 'Nama tag maksimal 50 karakter')
    .trim(),
});

module.exports = { tagSchema };
