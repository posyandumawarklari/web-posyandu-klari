const { z } = require('zod');

const createUserSchema = z.object({
  name: z
    .string({ required_error: 'Nama wajib diisi' })
    .min(2, 'Nama minimal 2 karakter')
    .max(100, 'Nama maksimal 100 karakter')
    .trim(),
  email: z
    .string({ required_error: 'Email wajib diisi' })
    .email('Format email tidak valid')
    .toLowerCase()
    .trim(),
  password: z
    .string({ required_error: 'Password wajib diisi' })
    .min(6, 'Password minimal 6 karakter'),
  role: z.enum(['ADMIN', 'CADRE', 'USER'], {
    required_error: 'Role wajib diisi',
    invalid_type_error: 'Role harus ADMIN, CADRE, atau USER',
  }),
});

const updateUserSchema = z.object({
  name: z
    .string()
    .min(2, 'Nama minimal 2 karakter')
    .max(100, 'Nama maksimal 100 karakter')
    .trim()
    .optional(),
  email: z
    .string()
    .email('Format email tidak valid')
    .toLowerCase()
    .trim()
    .optional(),
  password: z
    .string()
    .min(6, 'Password minimal 6 karakter')
    .optional(),
  role: z.enum(['ADMIN', 'CADRE', 'USER'], {
    invalid_type_error: 'Role harus ADMIN, CADRE, atau USER',
  }).optional(),
});

const resetPasswordSchema = z.object({
  newPassword: z
    .string({ required_error: 'Password baru wajib diisi' })
    .min(6, 'Password baru minimal 6 karakter'),
});

module.exports = { createUserSchema, updateUserSchema, resetPasswordSchema };
