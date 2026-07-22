const Vehicle = require('../models/Vehicle');
const ApiError = require('../utils/apiError');

class VehicleService {
  async getAllVehicles(queryFilters = {}) {
    const filter = {};
    if (queryFilters.search) {
      filter.$or = [
        { make: { $regex: queryFilters.search, $options: 'i' } },
        { model: { $regex: queryFilters.search, $options: 'i' } },
      ];
    }
    if (queryFilters.category) {
      filter.category = queryFilters.category;
    }

    const vehicles = await Vehicle.find(filter).sort({ createdAt: -1 });
    return vehicles;
  }

  async getVehicleById(vehicleId) {
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      throw new ApiError(404, 'Vehicle not found');
    }
    return vehicle;
  }

  async createVehicle(vehicleData) {
    const vehicle = await Vehicle.create(vehicleData);
    return vehicle;
  }

  async updateVehicle(vehicleId, updateData) {
    const vehicle = await Vehicle.findByIdAndUpdate(vehicleId, updateData, {
      returnDocument: 'after',
      runValidators: true,
    });

    if (!vehicle) {
      throw new ApiError(404, 'Vehicle not found');
    }
    return vehicle;
  }

  async deleteVehicle(vehicleId) {
    const vehicle = await Vehicle.findByIdAndDelete(vehicleId);
    if (!vehicle) {
      throw new ApiError(404, 'Vehicle not found');
    }
    return vehicle;
  }
}

module.exports = new VehicleService();
