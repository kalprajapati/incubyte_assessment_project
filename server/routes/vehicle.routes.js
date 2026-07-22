const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicle.controller');
const {
  createVehicleValidator,
  updateVehicleValidator,
  vehicleIdValidator,
  searchVehicleValidator,
} = require('../validators/vehicle.validator');
const validate = require('../middlewares/validate.middleware');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorizeRoles } = require('../middlewares/role.middleware');

router.get('/', vehicleController.getAllVehicles);
router.get('/search', searchVehicleValidator, validate, vehicleController.searchVehicles);
router.get('/:id', vehicleIdValidator, validate, vehicleController.getVehicleById);

// Admin-only protected routes
router.post(
  '/',
  authenticate,
  authorizeRoles('Admin'),
  createVehicleValidator,
  validate,
  vehicleController.createVehicle
);

router.put(
  '/:id',
  authenticate,
  authorizeRoles('Admin'),
  updateVehicleValidator,
  validate,
  vehicleController.updateVehicle
);

router.delete(
  '/:id',
  authenticate,
  authorizeRoles('Admin'),
  vehicleIdValidator,
  validate,
  vehicleController.deleteVehicle
);

module.exports = router;
