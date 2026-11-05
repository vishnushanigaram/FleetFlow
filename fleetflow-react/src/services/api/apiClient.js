/**
 * FleetFlow API Client
 * Seamless full-stack integration layer connecting the React frontend to
 * Spring Boot REST endpoints (supports port 8090, port 8080, or /api/v1 proxy).
 * 
 * Features:
 * 1. Automatic connectivity detection across candidate backend ports
 * 2. HTTP methods: GET, POST, PUT, PATCH, DELETE with Bearer auth headers
 * 3. Reactive status listeners for UI badges/toggles
 */

const CANDIDATE_URLS = [
  import.meta.env.VITE_API_URL,
  '/api/v1',
  'http://localhost:8090/api/v1',
  'http://localhost:8080/api/v1'
].filter(Boolean);

class ApiClient {
  constructor() {
    this.baseUrl = CANDIDATE_URLS[0] || 'http://localhost:8090/api/v1';
    this.mode = localStorage.getItem('fleetflow_api_mode') || 'auto'; // 'auto' | 'spring' | 'mock'
    this.isSpringConnected = false;
    this.listeners = new Set();
    this.checkedOnce = false;

    // Initial check
    if (typeof window !== 'undefined') {
      this.checkBackendHealth();
    }
  }

  // Subscribe to connectivity status changes
  onStatusChange(listener) {
    this.listeners.add(listener);
    listener({ connected: this.isSpringConnected, mode: this.mode, baseUrl: this.baseUrl });
    return () => this.listeners.delete(listener);
  }

  notifyListeners() {
    for (const listener of this.listeners) {
      listener({ connected: this.isSpringConnected, mode: this.mode, baseUrl: this.baseUrl });
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

    // Probe candidate URLs (proxy /api/v1, port 8090, port 8080)
    for (const candidate of CANDIDATE_URLS) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1200);

        const res = await fetch(`${candidate}/vehicles`, {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (res.status >= 200 && res.status < 500) {
          this.baseUrl = candidate;
          this.isSpringConnected = true;
          this.notifyListeners();
          this.checkedOnce = true;
          return true;
        }
      } catch {
        // try next candidate URL
      }
    }

    if (this.isSpringConnected !== false) {
      this.isSpringConnected = false;
      this.notifyListeners();
    }
    this.checkedOnce = true;
    return false;
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
