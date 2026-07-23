// ─── Route Paths ────────────────────────────────────────
export const ROUTES = {
  HOME:            '/',
  LOGIN:           '/login',
  REGISTER:        '/register',
  VEHICLES:        '/vehicles',
  VEHICLE_DETAIL:  '/vehicles/:id',
  ADMIN:           '/admin',
  NOT_FOUND:       '*',
};

// ─── User Roles ──────────────────────────────────────────
export const ROLES = {
  USER:  'User',
  ADMIN: 'Admin',
};

// ─── Local Storage Keys ──────────────────────────────────
export const STORAGE_KEYS = {
  TOKEN: 'av_token',
  USER:  'av_user',
};

// ─── Pagination Defaults ─────────────────────────────────
export const PAGINATION = {
  DEFAULT_PAGE:  1,
  DEFAULT_LIMIT: 12,
};

// ─── Toast default config (used in ToastContainer) ───────
export const TOAST_CONFIG = {
  position:        'top-right',
  autoClose:       3500,
  hideProgressBar: false,
  closeOnClick:    true,
  pauseOnHover:    true,
  draggable:       true,
  theme:           'light',
};

// ─── Vehicle Categories ──────────────────────────────────
export const VEHICLE_CATEGORIES = [
  'Sedan',
  'SUV',
  'Coupe',
  'Hatchback',
  'Truck',
  'Van',
  'Electric',
  'Convertible',
  'Wagon',
  'Other',
];
