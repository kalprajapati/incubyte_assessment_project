const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/User');

describe('Auth API Integration Tests', () => {
  beforeAll(async () => {
    const mongoUri = process.env.MONGODB_URI_TEST || 'mongodb://127.0.0.1:27017/car_dealership_auth_test';
    await mongoose.connect(mongoUri);
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully with hashed password', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'Password123!',
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toMatch(/registered successfully/i);
      expect(res.body.data).toHaveProperty('token');
      expect(res.body.data.user).toHaveProperty('email', 'john@example.com');
      expect(res.body.data.user).toHaveProperty('role', 'User');
      expect(res.body.data.user).not.toHaveProperty('password');
    });

    it('should fail registration with invalid input fields', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: '',
          email: 'invalid-email',
          password: '123',
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toHaveProperty('details');
    });

    it('should reject registration if email is already in use', async () => {
      await User.create({
        name: 'Existing User',
        email: 'john@example.com',
        password: '$2a$10$hashedpasswordplaceholder',
        role: 'User',
      });

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'Password123!',
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/already exists|already registered/i);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Alice Smith',
          email: 'alice@example.com',
          password: 'Password123!',
        });
    });

    it('should login successfully with valid credentials and return JWT token', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'alice@example.com',
          password: 'Password123!',
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('token');
      expect(res.body.data.user).toHaveProperty('email', 'alice@example.com');
    });

    it('should reject login with wrong password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'alice@example.com',
          password: 'WrongPassword!',
        });

      expect(res.statusCode).toEqual(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/invalid credentials/i);
    });
  });

  describe('Protected Routes & Authorization Middleware', () => {
    let userToken;
    let adminToken;

    beforeEach(async () => {
      const userRes = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Regular User',
          email: 'user@example.com',
          password: 'Password123!',
        });
      userToken = userRes.body.data.token;

      const adminRes = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Admin User',
          email: 'admin@example.com',
          password: 'Password123!',
          role: 'Admin',
          adminSecret: process.env.ADMIN_SECRET || 'admin_secret_key_123',
        });
      adminToken = adminRes.body.data.token;
    });

    it('should grant access to protected profile for valid JWT user', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('email', 'user@example.com');
    });

    it('should deny access to admin-only route for regular user', async () => {
      const res = await request(app)
        .get('/api/auth/admin-test')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toEqual(403);
      expect(res.body.success).toBe(false);
    });

    it('should allow access to admin-only route for Admin user', async () => {
      const res = await request(app)
        .get('/api/auth/admin-test')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
    });
  });
});
