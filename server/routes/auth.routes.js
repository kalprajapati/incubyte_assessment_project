const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { registerValidator, loginValidator } = require('../validators/auth.validator');
const validate = require('../middlewares/validate.middleware');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorizeRoles } = require('../middlewares/role.middleware');
const ApiResponse = require('../utils/apiResponse');

router.post('/register', registerValidator, validate, authController.register);
router.post('/login', loginValidator, validate, authController.login);
router.post('/logout', authController.logout);

// Protected route
router.get('/me', authenticate, authController.me);

// Admin authorized test route
router.get('/admin-test', authenticate, authorizeRoles('Admin'), (req, res) => {
  return ApiResponse.send(res, 200, 'Welcome to the Admin portal', { user: req.user });
});

module.exports = router;
