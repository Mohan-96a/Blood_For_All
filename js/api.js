
const API_BASE_URL = '/api';



const api = {
 
  setToken(token) {
    localStorage.setItem('token', token);
  },

 
  getToken() {
    return localStorage.getItem('token');
  },


  async request(endpoint, options = {}) {
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

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    let data;
    try {
      data = await response.json();
    } catch {
      data = {};
    }

    if (!response.ok) {
      // Auto-logout on auth failure
      if (response.status === 401) {
        localStorage.clear();
        window.location.href = 'login.html?error=unauthorized';
      }
      const msg =
        data.error ||
        data.message ||
        (data.details ? `${data.error || 'Error'}: ${data.details}` : null) ||
        'API request failed';
      throw new Error(msg);
    }

    return data;
  },

  // User Authentication
  async login(credentials) {
    return this.request('/users/login', {
      method: 'POST',
      body: credentials,
    });
  },

  async register(userData) {
    return this.request('/users/register', {
      method: 'POST',
      body: userData,
    });
  },

  // User Profile
  async getProfile() {
    return this.request('/users/profile');
  },

  async updateProfile(profileData) {
    return this.request('/users/profile', {
      method: 'PATCH',
      body: profileData,
    });
  },

  
  async createDonation(donationData) {
    return this.request('/donations', {
      method: 'POST',
      body: donationData,
    });
  },

  async getDonations() {
    return this.request('/donations');
  },

  async updateDonationStatus(donationId, status) {
    return this.request(`/donations/${donationId}`, {
      method: 'PATCH',
      body: { status },
    });
  },

 
  async getStats() {
    return this.request('/users/stats');
  },

  async getDonationStats() {
    return this.request('/donations/stats');
  },

  
  async getAllUsers() {
    return this.request('/users/all');
  },

  async deleteUser(userId) {
    return this.request(`/users/${userId}`, {
      method: 'DELETE',
    });
  },
};


if (typeof module !== 'undefined' && module.exports) {
  module.exports = api;
}
