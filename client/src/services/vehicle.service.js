import api from './api';

const vehicleService = {
  /**
   * Search vehicles with filters + pagination.
   * @param {{ make?, model?, category?, minPrice?, maxPrice?, page?, limit? }} params
   * @returns {Promise<{ vehicles: Vehicle[], pagination: Pagination }>}
   */
  search: async (params = {}) => {
    // Strip out blank/undefined values so we don't send empty query strings
    const clean = Object.fromEntries(
      Object.entries(params).filter(([, v]) => v !== '' && v !== undefined && v !== null)
    );
    const res = await api.get('/vehicles/search', { params: clean });
    return res.data.data; // { vehicles, pagination }
  },

  /**
   * Fetch all vehicles (no filters).
   * @returns {Promise<Vehicle[]>}
   */
  getAll: async () => {
    const res = await api.get('/vehicles');
    return res.data.data;
  },

  /**
   * Fetch a single vehicle by ID.
   * @param {string} id
   * @returns {Promise<Vehicle>}
   */
  getById: async (id) => {
    const res = await api.get(`/vehicles/${id}`);
    return res.data.data;
  },

  // ─── Admin-only ────────────────────────────────────────

  /**
   * Create a new vehicle (Admin only).
   * @param {{ make, model, category, price, quantity }} data
   */
  create: async (data) => {
    const res = await api.post('/vehicles', data);
    return res.data.data;
  },

  /**
   * Update an existing vehicle (Admin only).
   * @param {string} id
   * @param {Partial<{make, model, category, price, quantity}>} data
   */
  update: async (id, data) => {
    const res = await api.put(`/vehicles/${id}`, data);
    return res.data.data;
  },

  /**
   * Delete a vehicle (Admin only).
   * @param {string} id
   */
  remove: async (id) => {
    const res = await api.delete(`/vehicles/${id}`);
    return res.data.data;
  },

  /**
   * Restock a vehicle's quantity (Admin only).
   * @param {string} id
   * @param {number} quantity  — number of units to add
   */
  restock: async (id, quantity) => {
    const res = await api.post(`/vehicles/${id}/restock`, { quantity });
    return res.data.data;
  },
};

export default vehicleService;
