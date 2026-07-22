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

  async searchVehicles(queryParams = {}) {
    const { make, model, category, minPrice, maxPrice, page = 1, limit = 10 } = queryParams;

    const filter = {};

    if (make) {
      filter.make = { $regex: make, $options: 'i' };
    }

    if (model) {
      filter.model = { $regex: model, $options: 'i' };
    }

    if (category) {
      filter.category = { $regex: category, $options: 'i' };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined && minPrice !== '') {
        filter.price.$gte = Number(minPrice);
      }
      if (maxPrice !== undefined && maxPrice !== '') {
        filter.price.$lte = Number(maxPrice);
      }
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const total = await Vehicle.countDocuments(filter);
    const vehicles = await Vehicle.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const totalPages = Math.ceil(total / limitNum) || 1;

    return {
      vehicles,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages,
      },
    };
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
