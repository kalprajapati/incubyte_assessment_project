const ApiError = require('../utils/apiError');

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'User not authenticated'));
    }

    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, `Role '${req.user.role}' is not authorized to access this resource`));
    }

    next();
  };
};

module.exports = { authorizeRoles };
