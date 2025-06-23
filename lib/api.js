const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class ApiService {
  constructor() {
    this.baseURL = API_URL;
    this.token = null;
  }

  setToken(token) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  }

  getToken() {
    if (this.token) return this.token;
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('token');
    }
    return this.token;
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getToken();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      
      if (response.status === 401) {
        this.clearToken();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        throw new Error('Unauthorized');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return response;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth methods
  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: userData,
    });
  }

  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: credentials,
    });
  }

  // Monitor methods
  async getMonitors() {
    return this.request('/api/v1/monitors');
  }

  async createMonitor(monitorData) {
    return this.request('/api/v1/monitors', {
      method: 'POST',
      body: monitorData,
    });
  }

  async updateMonitor(id, monitorData) {
    return this.request(`/api/v1/monitors/${id}`, {
      method: 'PUT',
      body: monitorData,
    });
  }

  async deleteMonitor(id) {
    return this.request(`/api/v1/monitors/${id}`, {
      method: 'DELETE',
    });
  }

  async checkMonitor(id) {
    return this.request(`/api/v1/monitors/${id}/check`, {
      method: 'POST',
    });
  }

  // WebSocket connection
  createWebSocket(path) {
    const wsURL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000';
    const token = this.getToken();
    const url = `${wsURL}${path}${token ? `?token=${token}` : ''}`;
    return new WebSocket(url);
  }
}

export const api = new ApiService();