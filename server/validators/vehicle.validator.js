const { body, param } = require('express-validator');

const createVehicleValidator = [
  body('make').trim().notEmpty().withMessage('Make is required'),
  body('model').trim().notEmpty().withMessage('Model is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a number greater than or equal to 0'),
  body('quantity')
    .isInt({ min: 0 })
    .withMessage('Quantity must be an integer greater than or equal to 0'),
];

const updateVehicleValidator = [
  param('id').isMongoId().withMessage('Invalid vehicle ID format'),
  body('make').optional().trim().notEmpty().withMessage('Make cannot be empty'),
  body('model').optional().trim().notEmpty().withMessage('Model cannot be empty'),
  body('category').optional().trim().notEmpty().withMessage('Category cannot be empty'),
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a number greater than or equal to 0'),
  body('quantity')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Quantity must be an integer greater than or equal to 0'),
];

const vehicleIdValidator = [
  param('id').isMongoId().withMessage('Invalid vehicle ID format'),
];

module.exports = {
  createVehicleValidator,
  updateVehicleValidator,
  vehicleIdValidator,
};
