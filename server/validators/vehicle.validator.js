const { body, param, query } = require('express-validator');

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

const searchVehicleValidator = [
  query('make').optional().trim().isString().withMessage('Make must be a string'),
  query('model').optional().trim().isString().withMessage('Model must be a string'),
  query('category').optional().trim().isString().withMessage('Category must be a string'),
  query('minPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum price must be a number greater than or equal to 0'),
  query('maxPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum price must be a number greater than or equal to 0'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer starting from 1'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be an integer between 1 and 100'),
];

const restockVehicleValidator = [
  param('id').isMongoId().withMessage('Invalid vehicle ID format'),
  body('quantity')
    .notEmpty()
    .withMessage('Quantity is required')
    .isInt({ min: 1 })
    .withMessage('Quantity must be a positive integer'),
];

module.exports = {
  createVehicleValidator,
  updateVehicleValidator,
  vehicleIdValidator,
  searchVehicleValidator,
  restockVehicleValidator,
};
