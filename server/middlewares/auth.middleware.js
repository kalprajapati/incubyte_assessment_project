const { verifyToken } = require('../utils/jwt');
const ApiError = require('../utils/apiError');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return next(new ApiError(401, 'Authentication token missing or invalid'));
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new ApiError(401, 'User account no longer exists'));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(new ApiError(401, 'Invalid or expired authentication token'));
  }
};

module.exports = { authenticate };
