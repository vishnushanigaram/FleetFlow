/**
 * FleetFlow API Client
 * Seamless full-stack integration layer connecting the React frontend to
 * Spring Boot REST endpoints (http://localhost:8080/api/v1).
 * 
 * Features:
 * 1. Automatic connectivity detection (Spring Boot vs Local Mock Storage fallback)
 * 2. HTTP methods: GET, POST, PUT, PATCH, DELETE with Bearer auth headers
 * 3. Reactive status listeners for UI badges/toggles
 */

const DEFAULT_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

class ApiClient {
  constructor() {
    this.baseUrl = DEFAULT_BASE_URL;
    this.mode = localStorage.getItem('fleetflow_api_mode') || 'auto'; // 'auto' | 'spring' | 'mock'
    this.isSpringConnected = false;
    this.listeners = new Set();
    this.checkedOnce = false;

    // Initial silent check
    if (typeof window !== 'undefined') {
      this.checkBackendHealth();
    }
  }

  // Subscribe to connectivity status changes
  onStatusChange(listener) {
    this.listeners.add(listener);
    listener({ connected: this.isSpringConnected, mode: this.mode });
    return () => this.listeners.delete(listener);
  }

  notifyListeners() {
    for (const listener of this.listeners) {
      listener({ connected: this.isSpringConnected, mode: this.mode });
    }
  }

  setMode(mode) {
    this.mode = mode;
    localStorage.setItem('fleetflow_api_mode', mode);
    this.notifyListeners();
  }

  async checkBackendHealth() {
    if (this.mode === 'mock') {
      this.isSpringConnected = false;
      this.notifyListeners();
      return false;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1500);

      const res = await fetch(`${this.baseUrl}/vehicles`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const isConnected = res.status >= 200 && res.status < 500;
      if (this.isSpringConnected !== isConnected) {
        this.isSpringConnected = isConnected;
        this.notifyListeners();
      }
      this.checkedOnce = true;
      return isConnected;
    } catch {
      if (this.isSpringConnected !== false) {
        this.isSpringConnected = false;
        this.notifyListeners();
      }
      this.checkedOnce = true;
      return false;
    }
  }

  isBackendActive() {
    if (this.mode === 'mock') return false;
    if (this.mode === 'spring') return true;
    return this.isSpringConnected;
  }

  getHeaders() {
    const token = localStorage.getItem('fleetflow_auth_token') || 'demo-jwt-token';
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  async request(endpoint, options = {}) {
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
    const headers = { ...this.getHeaders(), ...(options.headers || {}) };

    const config = {
      ...options,
      headers
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        let errMessage = `HTTP ${response.status} ${response.statusText}`;
        try {
          const errorJson = await response.json();
          if (errorJson && errorJson.error) {
            errMessage = errorJson.error;
          } else if (errorJson && errorJson.message) {
            errMessage = errorJson.message;
          }
        } catch {
          // ignore parsing error
        }
        throw new Error(errMessage);
      }

      // Handle 204 No Content
      if (response.status === 204) {
        return null;
      }

      return await response.json();
    } catch (err) {
      // If network fails (Spring Boot offline), notify
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        this.isSpringConnected = false;
        this.notifyListeners();
      }
      throw err;
    }
  }

  async get(endpoint, params = {}) {
    let url = endpoint;
    const query = new URLSearchParams();
    for (const [key, val] of Object.entries(params)) {
      if (val !== undefined && val !== null && val !== '' && val !== 'ALL') {
        query.append(key, val);
      }
    }
    const queryString = query.toString();
    if (queryString) {
      url += (url.includes('?') ? '&' : '?') + queryString;
    }
    return this.request(url, { method: 'GET' });
  }

  async post(endpoint, data = {}, params = {}) {
    let url = endpoint;
    const query = new URLSearchParams();
    for (const [key, val] of Object.entries(params)) {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, val);
      }
    }
    const queryString = query.toString();
    if (queryString) {
      url += (url.includes('?') ? '&' : '?') + queryString;
    }
    return this.request(url, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async patch(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE'
    });
  }
}

export const apiClient = new ApiClient();
