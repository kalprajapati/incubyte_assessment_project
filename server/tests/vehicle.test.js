const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/User');
const Vehicle = require('../models/Vehicle');

jest.setTimeout(30000);

describe('Vehicle API Integration Tests', () => {
  let adminToken;
  let userToken;
  let testVehicle;

  beforeAll(async () => {
    const mongoUri = process.env.MONGODB_URI;
    await mongoose.connect(mongoUri);
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await Vehicle.deleteMany({});

    // Register Admin
    const adminRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Admin User',
        email: 'admin@dealership.com',
        password: 'AdminPassword123!',
        role: 'Admin',
        adminSecret: process.env.ADMIN_SECRET || 'admin_secret_key_123',
      });
    adminToken = adminRes.body.data.token;

    // Register Regular User
    const userRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Jane Customer',
        email: 'jane@example.com',
        password: 'UserPassword123!',
      });
    userToken = userRes.body.data.token;

    // Create Initial Vehicle
    testVehicle = await Vehicle.create({
      make: 'Toyota',
      model: 'Camry',
      category: 'Sedan',
      price: 25000,
      quantity: 5,
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('GET /api/vehicles', () => {
    it('should return a list of all vehicles', async () => {
      const res = await request(app).get('/api/vehicles');

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0]).toHaveProperty('model', 'Camry');
    });

    it('should return vehicle by valid ID', async () => {
      const res = await request(app).get(`/api/vehicles/${testVehicle._id}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('make', 'Toyota');
    });

    it('should return 404 for non-existent vehicle ID', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app).get(`/api/vehicles/${fakeId}`);

      expect(res.statusCode).toEqual(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/vehicles/search', () => {
    beforeEach(async () => {
      await Vehicle.create([
        { make: 'Honda', model: 'Civic', category: 'Sedan', price: 22000, quantity: 4 },
        { make: 'Honda', model: 'CR-V', category: 'SUV', price: 32000, quantity: 2 },
        { make: 'BMW', model: 'M4', category: 'Coupe', price: 75000, quantity: 1 },
        { make: 'Tesla', model: 'Model 3', category: 'Electric', price: 42000, quantity: 3 },
      ]);
    });

    it('should filter vehicles by make, category, and price range with pagination', async () => {
      const res = await request(app)
        .get('/api/vehicles/search')
        .query({
          make: 'Honda',
          category: 'Sedan',
          minPrice: 20000,
          maxPrice: 25000,
          page: 1,
          limit: 10,
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('vehicles');
      expect(res.body.data).toHaveProperty('pagination');
      expect(res.body.data.vehicles).toHaveLength(1);
      expect(res.body.data.vehicles[0]).toHaveProperty('model', 'Civic');
      expect(res.body.data.pagination).toEqual({
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
    });

    it('should filter vehicles with multiple combined parameters (minPrice & maxPrice)', async () => {
      const res = await request(app)
        .get('/api/vehicles/search')
        .query({
          minPrice: 30000,
          maxPrice: 50000,
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.vehicles).toHaveLength(2); // Honda CR-V (32k), Tesla Model 3 (42k)
    });

    it('should return empty list when no vehicles match query', async () => {
      const res = await request(app)
        .get('/api/vehicles/search')
        .query({ make: 'Porsche' });

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.vehicles).toHaveLength(0);
      expect(res.body.data.pagination.total).toBe(0);
    });

    it('should reject invalid query parameters (e.g., negative minPrice)', async () => {
      const res = await request(app)
        .get('/api/vehicles/search')
        .query({ minPrice: -50 });

      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toHaveProperty('details');
    });
  });

  describe('POST /api/vehicles', () => {
    it('should allow Admin to create a vehicle', async () => {
      const newVehicle = {
        make: 'Tesla',
        model: 'Model Y',
        category: 'SUV',
        price: 52000,
        quantity: 3,
      };

      const res = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newVehicle);

      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('make', 'Tesla');
      expect(res.body.data).toHaveProperty('model', 'Model Y');
    });

    it('should reject vehicle creation by regular non-admin user (403 Forbidden)', async () => {
      const res = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          make: 'Honda',
          model: 'Civic',
          category: 'Sedan',
          price: 22000,
          quantity: 4,
        });

      expect(res.statusCode).toEqual(403);
      expect(res.body.success).toBe(false);
    });

    it('should fail validation when required fields are missing or invalid', async () => {
      const res = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          make: '',
          model: '',
          price: -500,
          quantity: -1,
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toHaveProperty('details');
    });
  });

  describe('PUT /api/vehicles/:id', () => {
    it('should allow Admin to update an existing vehicle', async () => {
      const res = await request(app)
        .put(`/api/vehicles/${testVehicle._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          price: 27000,
          quantity: 8,
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('price', 27000);
      expect(res.body.data).toHaveProperty('quantity', 8);
    });

    it('should forbid regular user from updating vehicle (403 Forbidden)', async () => {
      const res = await request(app)
        .put(`/api/vehicles/${testVehicle._id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          price: 20000,
        });

      expect(res.statusCode).toEqual(403);
      expect(res.body.success).toBe(false);
    });
  });

  describe('DELETE /api/vehicles/:id', () => {
    it('should allow Admin to delete a vehicle', async () => {
      const res = await request(app)
        .delete(`/api/vehicles/${testVehicle._id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);

      const deletedCheck = await Vehicle.findById(testVehicle._id);
      expect(deletedCheck).toBeNull();
    });

    it('should forbid regular user from deleting vehicle (403 Forbidden)', async () => {
      const res = await request(app)
        .delete(`/api/vehicles/${testVehicle._id}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toEqual(403);
      expect(res.body.success).toBe(false);
    });
  });
});
