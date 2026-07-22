const authService = require('../services/auth.service');
const ApiResponse = require('../utils/apiResponse');

class AuthController {
  async register(req, res, next) {
    try {
      const { name, email, password, role, adminSecret } = req.body;
      const result = await authService.registerUser({ name, email, password, role, adminSecret });

      res.cookie('token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return ApiResponse.send(res, 201, 'User registered successfully', result);
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await authService.loginUser({ email, password });

      res.cookie('token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return ApiResponse.send(res, 200, 'User logged in successfully', result);
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res) {
    res.clearCookie('token');
    return ApiResponse.send(res, 200, 'User logged out successfully', null);
  }

  async me(req, res, next) {
    try {
      const user = await authService.getUserProfile(req.user._id);
      return ApiResponse.send(res, 200, 'User profile fetched successfully', user);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
