const { z } = require('zod');

const baseSchema = z.object({
  title: z
    .string({ required_error: 'Judul wajib diisi' })
    .min(5, 'Judul minimal 5 karakter')
    .max(200, 'Judul maksimal 200 karakter')
    .trim(),
  content: z.string().optional().nullable().default(''),
  excerpt: z.string().max(500, 'Ringkasan maksimal 500 karakter').optional().nullable().default(''),
  categoryId: z.string().optional().nullable().transform((val) => val === '' ? null : val),
  tags: z.union([
    z.array(z.string()),
    z.string().transform((val) => val ? val.split(',').map(s => s.trim()).filter(Boolean) : []),
  ]).optional().default([]),
  status: z.enum(['DRAFT', 'PUBLISHED']).optional().default('DRAFT'),
  publishDate: z.string().datetime().optional().nullable(),
  seoTitle: z.string().max(100, 'SEO title maksimal 100 karakter').optional().nullable().default(''),
  seoDescription: z.string().max(200, 'SEO description maksimal 200 karakter').optional().nullable().default(''),
});

const createArticleSchema = baseSchema.superRefine((data, ctx) => {
  if (data.status === 'PUBLISHED') {
    if (!data.content || data.content.length < 10) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Konten minimal 10 karakter untuk publikasi',
        path: ['content'],
      });
    }
    if (!data.categoryId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Kategori wajib dipilih untuk publikasi',
        path: ['categoryId'],
      });
    }
  }
});

const updateArticleSchema = baseSchema.partial().superRefine((data, ctx) => {
  if (data.status === 'PUBLISHED') {
    if (data.content !== undefined && (!data.content || data.content.length < 10)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Konten minimal 10 karakter untuk publikasi',
        path: ['content'],
      });
    }
    // For update, if categoryId is sent, it must be valid for publishing, but often it might not be sent.
    // We should enforce it if they try to change it to empty while publishing.
    if (data.categoryId !== undefined && !data.categoryId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Kategori wajib dipilih untuk publikasi',
        path: ['categoryId'],
      });
    }
  }
});

module.exports = { createArticleSchema, updateArticleSchema };
