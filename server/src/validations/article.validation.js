const { z } = require('zod');

const createArticleSchema = z.object({
  title: z
    .string({ required_error: 'Judul wajib diisi' })
    .min(5, 'Judul minimal 5 karakter')
    .max(200, 'Judul maksimal 200 karakter')
    .trim(),
  content: z
    .string({ required_error: 'Konten wajib diisi' })
    .min(10, 'Konten minimal 10 karakter'),
  excerpt: z.string().max(500, 'Ringkasan maksimal 500 karakter').optional().nullable(),
  categoryId: z.string().optional().nullable(),
  tags: z.union([
    z.array(z.string()),
    z.string().transform((val) => val ? val.split(',').map(s => s.trim()).filter(Boolean) : []),
  ]).optional().default([]),
  status: z.enum(['DRAFT', 'PUBLISHED']).optional().default('DRAFT'),
  publishDate: z.string().datetime().optional().nullable(),
  seoTitle: z.string().max(100, 'SEO title maksimal 100 karakter').optional().nullable(),
  seoDescription: z.string().max(200, 'SEO description maksimal 200 karakter').optional().nullable(),
});

const updateArticleSchema = createArticleSchema.partial().extend({
  title: z.string().min(5, 'Judul minimal 5 karakter').max(200).trim().optional(),
  content: z.string().min(10, 'Konten minimal 10 karakter').optional(),
});

module.exports = { createArticleSchema, updateArticleSchema };
