const { z } = require('zod');

const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email wajib diisi' })
    .email('Format email tidak valid')
    .toLowerCase()
    .trim(),
  password: z
    .string({ required_error: 'Password wajib diisi' })
    .min(6, 'Password minimal 6 karakter'),
});

const refreshTokenSchema = z.object({
  refreshToken: z
    .string({ required_error: 'Refresh token wajib diisi' })
    .min(1, 'Refresh token tidak boleh kosong'),
});

const changePasswordSchema = z.object({
  currentPassword: z
    .string({ required_error: 'Password lama wajib diisi' })
    .min(6, 'Password minimal 6 karakter'),
  newPassword: z
    .string({ required_error: 'Password baru wajib diisi' })
    .min(6, 'Password baru minimal 6 karakter'),
  confirmPassword: z
    .string({ required_error: 'Konfirmasi password wajib diisi' }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Konfirmasi password tidak cocok',
  path: ['confirmPassword'],
});

const updateProfileSchema = z.object({
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
});

module.exports = {
  loginSchema,
  refreshTokenSchema,
  changePasswordSchema,
  updateProfileSchema,
};
