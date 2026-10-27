import { mockStorage, STORAGE_KEYS } from './api/mockStorage';
import { DEMO_ACCOUNTS, ROLES } from '../utils/constants';

const CURRENT_USER_KEY = 'fleetflow_current_user';
const AUTH_TOKEN_KEY = 'fleetflow_auth_token';

export const authService = {
  async login({ email, password }) {
    await mockStorage.delay(300);

    const users = mockStorage.get(STORAGE_KEYS.USERS);
    // Case insensitive match
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      throw new Error('Invalid email or password. Please try again.');
    }

    // In mock mode, allow password123 or any password for testing
    const token = `jwt_mock_${user.id}_${Date.now()}`;
    const sessionUser = { ...user };
    delete sessionUser.password;

    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(sessionUser));

    return { user: sessionUser, token };
  },

  async register({ name, email, role = ROLES.DRIVER, phone = '' }) {
    await mockStorage.delay(350);

    const users = mockStorage.get(STORAGE_KEYS.USERS);
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (existing) {
      throw new Error('An account with this email already exists.');
    }

    const newUser = {
      id: `USR-${Date.now().toString().slice(-4)}`,
      name,
      email,
      role,
      title: `${role.charAt(0).toUpperCase() + role.slice(1)} Member`,
      status: 'Active',
      phone,
      joinedDate: new Date().toISOString().split('T')[0],
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`
    };

    users.push(newUser);
    mockStorage.set(STORAGE_KEYS.USERS, users);

    // Auto login
    const token = `jwt_mock_${newUser.id}_${Date.now()}`;
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));

    return { user: newUser, token };
  },

  getCurrentUser() {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    if (!raw) {
      // Default to manager demo user for immediate ease of exploration if not explicitly logged out
      const defaultUser = DEMO_ACCOUNTS[0];
      const userObj = {
        id: 'USR-01',
        name: defaultUser.name,
        email: defaultUser.email,
        role: defaultUser.role,
        title: defaultUser.title,
        avatar: defaultUser.avatar
      };
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userObj));
      localStorage.setItem(AUTH_TOKEN_KEY, 'mock-jwt-init');
      return userObj;
    }
    return JSON.parse(raw);
  },

  async quickSwitchRole(role) {
    await mockStorage.delay(100);
    const account = DEMO_ACCOUNTS.find(a => a.role === role);
    if (!account) return null;

    const userObj = {
      id: `USR-${role.toUpperCase()}`,
      name: account.name,
      email: account.email,
      role: account.role,
      title: account.title,
      avatar: account.avatar,
      driverId: account.driverId || null
    };

    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userObj));
    localStorage.setItem(AUTH_TOKEN_KEY, `mock-jwt-${role}`);
    return userObj;
  },

  logout() {
    localStorage.removeItem(CURRENT_USER_KEY);
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }
};
