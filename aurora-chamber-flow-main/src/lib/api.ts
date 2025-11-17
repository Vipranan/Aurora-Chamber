const API_BASE_URL = 'http://localhost:5001/api';

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }
    
    return response.json();
  },

  verifyToken: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/verify`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Token verification failed');
    }
    
    return response.json();
  },
};

// Bookings API
export const bookingsAPI = {
  getAll: async (params?: { date?: string; chamber?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.date) queryParams.append('date', params.date);
    if (params?.chamber) queryParams.append('chamber', params.chamber);
    
    const response = await fetch(`${API_BASE_URL}/bookings?${queryParams}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch bookings');
    }
    
    return response.json();
  },

  getBookedSlots: async (chamber: string, date: string) => {
    const response = await fetch(
      `${API_BASE_URL}/bookings/booked-slots?chamber=${encodeURIComponent(chamber)}&date=${encodeURIComponent(date)}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch booked slots');
    }
    
    return response.json();
  },

  create: async (booking: {
    chamber: string;
    date: string;
    timeSlot: string;
    name: string;
    email: string;
    company?: string;
    antenna?: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(booking),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create booking');
    }
    
    return response.json();
  },

  delete: async (id: number, token: string) => {
    const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete booking');
    }
    
    return response.json();
  },

  update: async (id: number, booking: any, token: string) => {
    const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(booking),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update booking');
    }
    
    return response.json();
  },
};
