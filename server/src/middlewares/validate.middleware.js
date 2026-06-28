const { sendError } = require('../utils/response');

/**
 * Validate request body/query/params against a Zod schema
 * @param {import('zod').ZodSchema} schema
 * @param {'body' | 'query' | 'params'} source
 */
const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      const errors = result.error.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      }));

      return sendError(res, {
        statusCode: 400,
        message: 'Validasi gagal.',
        errors,
      });
    }

    // Replace with parsed/transformed data
    req[source] = result.data;
    next();
  };
};

module.exports = { validate };
