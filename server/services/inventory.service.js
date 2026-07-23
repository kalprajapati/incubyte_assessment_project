const Vehicle = require('../models/Vehicle');
const ApiError = require('../utils/apiError');

class InventoryService {
  async purchaseVehicle(vehicleId) {
    // We use findOneAndUpdate with condition quantity > 0 to prevent race conditions
    const vehicle = await Vehicle.findOneAndUpdate(
      { _id: vehicleId, quantity: { $gt: 0 } },
      { $inc: { quantity: -1 } },
      { returnDocument: 'after', runValidators: true }
    );

    if (!vehicle) {
      // Check if vehicle exists at all to return a precise error
      const existingVehicle = await Vehicle.findById(vehicleId);
      if (!existingVehicle) {
        throw new ApiError(404, 'Vehicle not found');
      }
      throw new ApiError(400, 'Vehicle is out of stock and cannot be purchased');
    }

    return vehicle;
  }

  async restockVehicle(vehicleId, quantityToAdd) {
    if (quantityToAdd <= 0 || !Number.isInteger(quantityToAdd)) {
      throw new ApiError(400, 'Invalid restock quantity. Must be a positive integer.');
    }

    const vehicle = await Vehicle.findByIdAndUpdate(
      vehicleId,
      { $inc: { quantity: quantityToAdd } },
      { new: true, runValidators: true }
    );

    if (!vehicle) {
      throw new ApiError(404, 'Vehicle not found');
    }

    return vehicle;
  }
}

module.exports = new InventoryService();
