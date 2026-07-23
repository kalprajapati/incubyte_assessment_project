const vehicleService = require('../services/vehicle.service');
const inventoryService = require('../services/inventory.service');
const ApiResponse = require('../utils/apiResponse');

class VehicleController {
  async getAllVehicles(req, res, next) {
    try {
      const vehicles = await vehicleService.getAllVehicles(req.query);
      return ApiResponse.send(res, 200, 'Vehicles retrieved successfully', vehicles);
    } catch (error) {
      next(error);
    }
  }

  async searchVehicles(req, res, next) {
    try {
      const result = await vehicleService.searchVehicles(req.query);
      return ApiResponse.send(res, 200, 'Vehicles retrieved successfully', result);
    } catch (error) {
      next(error);
    }
  }

  async getVehicleById(req, res, next) {
    try {
      const vehicle = await vehicleService.getVehicleById(req.params.id);
      return ApiResponse.send(res, 200, 'Vehicle retrieved successfully', vehicle);
    } catch (error) {
      next(error);
    }
  }

  async createVehicle(req, res, next) {
    try {
      const vehicle = await vehicleService.createVehicle(req.body);
      return ApiResponse.send(res, 201, 'Vehicle created successfully', vehicle);
    } catch (error) {
      next(error);
    }
  }

  async updateVehicle(req, res, next) {
    try {
      const vehicle = await vehicleService.updateVehicle(req.params.id, req.body);
      return ApiResponse.send(res, 200, 'Vehicle updated successfully', vehicle);
    } catch (error) {
      next(error);
    }
  }

  async deleteVehicle(req, res, next) {
    try {
      await vehicleService.deleteVehicle(req.params.id);
      return ApiResponse.send(res, 200, 'Vehicle deleted successfully', null);
    } catch (error) {
      next(error);
    }
  }

  async purchaseVehicle(req, res, next) {
    try {
      const vehicle = await inventoryService.purchaseVehicle(req.params.id);
      return ApiResponse.send(res, 200, 'Vehicle purchased successfully', vehicle);
    } catch (error) {
      next(error);
    }
  }

  async restockVehicle(req, res, next) {
    try {
      const vehicle = await inventoryService.restockVehicle(req.params.id, req.body.quantity);
      return ApiResponse.send(res, 200, 'Vehicle restocked successfully', vehicle);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new VehicleController();
