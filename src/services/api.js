const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://featureme-backend.onrender.com/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Get auth token from localStorage
  getToken() {
    return localStorage.getItem('featureme_accessToken');
  }

  // Set auth token
  setToken(token) {
    localStorage.setItem('featureme_accessToken', token);
  }

  // Remove auth token
  removeToken() {
    localStorage.removeItem('featureme_accessToken');
    localStorage.removeItem('featureme_refreshToken');
    localStorage.removeItem('featureme_user');
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getToken();

    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        const apiError = new Error(data.error || data.message || 'Request failed');
        apiError.response = response;
        apiError.data = data;
        apiError.status = response.status;
        // Include conflict and other error details
        if (data.conflict) apiError.conflict = data.conflict;
        if (data.message) apiError.message = data.message;
        throw apiError;
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth endpoints
  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  async refreshToken(refreshToken) {
    return this.request('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  }

  // Location endpoints
  async getLocations(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/locations?${params.toString()}`);
  }

  async getLocationById(id) {
    return this.request(`/locations/${id}`);
  }

  // Template endpoints
  async getTemplates(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/templates?${params.toString()}`);
  }

  async getTemplateById(id) {
    return this.request(`/templates/${id}`);
  }

  // Plan endpoints
  async getPlans(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/plans?${params.toString()}`);
  }

  async getPlanById(id) {
    return this.request(`/plans/${id}`);
  }

  // Schedule endpoints
  async checkAvailability(locationId, date, startTime = null, endTime = null) {
    let url = `/schedule/availability?locationId=${locationId}&date=${date}`;
    if (startTime && endTime) {
      url += `&startTime=${encodeURIComponent(startTime)}&endTime=${encodeURIComponent(endTime)}`;
    }
    return this.request(url);
  }

  async createSchedule(scheduleData) {
    return this.request('/schedule', {
      method: 'POST',
      body: JSON.stringify(scheduleData),
    });
  }

  async getUserSchedules() {
    return this.request('/schedule/user');
  }

  // Upload endpoints
  async uploadMedia(file, templateId, featureType = null) {
    const url = `${this.baseURL}/upload`;
    const token = this.getToken();
    const formData = new FormData();
    formData.append('file', file);
    if (templateId) {
      formData.append('templateId', templateId);
    }
    if (featureType) {
      formData.append('featureType', featureType);
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Upload failed');
    }

    return data;
  }

  async getUserMedia(type = null) {
    const params = type ? `?type=${type}` : '';
    return this.request(`/upload/user${params}`);
  }

  async deleteMedia(mediaId) {
    return this.request(`/upload/${mediaId}`, {
      method: 'DELETE',
    });
  }

  // Booking endpoints
  async createBooking(bookingData) {
    return this.request('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  }

  async getUserBookings(status = null) {
    const params = status ? `?status=${status}` : '';
    return this.request(`/bookings/user${params}`);
  }

  async getBookingById(id) {
    return this.request(`/bookings/${id}`);
  }

  async updateBookingStatus(id, status) {
    return this.request(`/bookings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  // Payment endpoints
  async createPaymentIntent(bookingId) {
    return this.request('/payments/create-intent', {
      method: 'POST',
      body: JSON.stringify({ bookingId }),
    });
  }

  async getPaymentStatus(paymentId) {
    return this.request(`/payments/${paymentId}`);
  }

  // Dashboard endpoint
  async getDashboard() {
    return this.request('/user/dashboard');
  }

  // User activity endpoint
  async getUserActivity() {
    return this.request('/user-activity');
  }

  // WhatsApp endpoint
  async getWhatsAppContact(message = null) {
    const params = message ? `?message=${encodeURIComponent(message)}` : '';
    return this.request(`/whatsapp/contact${params}`);
  }
}

export default new ApiService();

