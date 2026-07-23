import api from './api';

const authService = {
  /**
   * Register a new user.
   * @param {{ name, email, password, role?, adminSecret? }} data
   * @returns {Promise<{ token, user }>}
   */
  register: async (data) => {
    const res = await api.post('/auth/register', data);
    return res.data.data; // { token, user }
  },

  /**
   * Login with email + password.
   * @param {{ email, password }} data
   * @returns {Promise<{ token, user }>}
   */
  login: async (data) => {
    const res = await api.post('/auth/login', data);
    return res.data.data; // { token, user }
  },

  /**
   * Logout — clears the httpOnly cookie server-side.
   */
  logout: async () => {
    await api.post('/auth/logout');
  },

  /**
   * Fetch the currently authenticated user's profile.
   * @returns {Promise<user>}
   */
  getMe: async () => {
    const res = await api.get('/auth/me');
    return res.data.data;
  },
};

export default authService;
