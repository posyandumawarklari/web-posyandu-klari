/**
 * Standardized API response helpers
 */

const sendSuccess = (res, { statusCode = 200, message = 'Success', data = null, meta = null }) => {
  const response = {
    success: true,
    message,
    data,
  };
  if (meta) response.meta = meta;
  return res.status(statusCode).json(response);
};

const sendError = (res, { statusCode = 500, message = 'Internal Server Error', errors = null }) => {
  const response = {
    success: false,
    message,
  };
  if (errors) response.errors = errors;
  return res.status(statusCode).json(response);
};

const sendPaginated = (res, { data, page, limit, total, message = 'Data fetched successfully' }) => {
  const totalPages = Math.ceil(total / limit);
  return sendSuccess(res, {
    message,
    data,
    meta: {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      total,
      totalPages,
    },
  });
};

module.exports = { sendSuccess, sendError, sendPaginated };
