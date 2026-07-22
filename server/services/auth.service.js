const User = require('../models/User');
const ApiError = require('../utils/apiError');
const { generateToken } = require('../utils/jwt');

class AuthService {
  async registerUser({ name, email, password, role, adminSecret }) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(400, 'User with this email already exists');
    }

    let userRole = 'User';
    if (role === 'Admin') {
      const validAdminSecret = process.env.ADMIN_SECRET || 'admin_secret_key_123';
      if (adminSecret && adminSecret === validAdminSecret) {
        userRole = 'Admin';
      } else {
        throw new ApiError(403, 'Invalid admin secret provided for Admin registration');
      }
    }

    const user = await User.create({
      name,
      email,
      password,
      role: userRole,
    });

    const token = generateToken({ id: user._id, role: user.role });

    return { user, token };
  }

  async loginUser({ email, password }) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(401, 'Invalid credentials');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new ApiError(401, 'Invalid credentials');
    }

    const token = generateToken({ id: user._id, role: user.role });

    return { user, token };
  }

  async getUserProfile(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User profile not found');
    }
    return user;
  }
}

module.exports = new AuthService();
