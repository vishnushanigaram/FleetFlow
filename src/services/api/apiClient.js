/**
 * FleetFlow API Client
 * Designed according to Section 5 & 25:
 * Target architecture: React -> Service/API Layer -> Mock REST API
 * Future backend: React -> REST API -> Spring Boot Controller -> Service -> JPA/MySQL
 */

const BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

class ApiClient {
  constructor() {
    this.baseUrl = BASE_URL;
  }

  // Generic request interceptor simulating headers, auth token, etc.
  getHeaders() {
    const token = localStorage.getItem('fleetflow_auth_token') || 'mock-jwt-token-xyz';
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  handleResponse(response) {
    return response;
  }
}

export const apiClient = new ApiClient();
