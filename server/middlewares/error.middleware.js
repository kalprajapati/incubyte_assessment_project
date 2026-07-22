const ApiError = require('../utils/apiError');

const errorHandler = (err, req, res, next) => {
  let { statusCode, message, errors } = err;

  if (!(err instanceof ApiError)) {
    statusCode = err.statusCode || 500;
    message = err.message || 'Internal Server Error';
    errors = err.errors || [];
  }

  const response = {
    success: false,
    message,
    error: {
      ...(errors && errors.length > 0 ? { details: errors } : {}),
      ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {}),
    },
  };

  return res.status(statusCode).json(response);
};

module.exports = errorHandler;
