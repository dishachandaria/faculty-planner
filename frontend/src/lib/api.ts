import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API calls
export const auth = {
  register: async (userData: { name: string; email: string; password: string; department: string }) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
};

// Profile API calls
export const profile = {
  get: async () => {
    const response = await api.get('/profile');
    return response.data;
  },
  update: async (userData: { name: string; email: string; department: string; office: string }) => {
    const response = await api.put('/profile', userData);
    return response.data;
  },
  changePassword: async (passwordData: { oldPassword: string; newPassword: string }) => {
    const response = await api.put('/profile/change-password', passwordData);
    return response.data;
  },
  delete: async () => {
    const response = await api.delete('/profile');
    return response.data;
  },
};

// Tasks API calls
export const tasks = {
  getAll: async () => {
    const response = await api.get('/tasks');
    return response.data;
  },
  create: async (taskData: {
    title: string;
    description?: string;
    dueDate: string;
    priority: 'low' | 'medium' | 'high';
    status?: 'pending' | 'in-progress' | 'completed';
  }) => {
    // Convert frontend format to backend format
    const backendTaskData = {
      title: taskData.title,
      description: taskData.description || '',
      dueDate: new Date(taskData.dueDate).toISOString(),
      priority: taskData.priority,
      status: taskData.status || 'pending'
    };

    const response = await api.post('/tasks', backendTaskData);
    return response.data;
  },
  update: async (id: string, taskData: any) => {
    // Convert frontend format to backend format
    const backendTaskData: any = {};
    
    if (taskData.title) backendTaskData.title = taskData.title;
    if (taskData.description !== undefined) backendTaskData.description = taskData.description;
    if (taskData.dueDate) backendTaskData.dueDate = new Date(taskData.dueDate).toISOString();
    if (taskData.priority) backendTaskData.priority = taskData.priority;
    if (taskData.status) backendTaskData.status = taskData.status;

    const response = await api.put(`/tasks/${id}`, backendTaskData);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },
};

// Events API calls
export const events = {
  getAll: async () => {
    const response = await api.get('/events');
    return response.data;
  },
  create: async (eventData: {
    title: string;
    date: string;
    time?: string;
    endTime?: string;
    description?: string;
    location?: string;
    type: 'class' | 'meeting' | 'office-hours' | 'other';
    recurring?: boolean;
  }) => {
    // Convert frontend format to backend format
    const backendEventData = {
      title: eventData.title,
      description: eventData.description || '',
      startDate: new Date(`${eventData.date}T${eventData.time || '00:00'}`),
      endDate: new Date(`${eventData.date}T${eventData.endTime || '23:59'}`),
      location: eventData.location || '',
      type: eventData.type,
      recurring: eventData.recurring || false
    };

    const response = await api.post('/events', backendEventData);
    return response.data;
  },
  update: async (id: string, eventData: any) => {
    // Convert frontend format to backend format
    const backendEventData = {
      title: eventData.title,
      description: eventData.description || '',
      startDate: new Date(`${eventData.date}T${eventData.time || '00:00'}`),
      endDate: new Date(`${eventData.date}T${eventData.endTime || '23:59'}`),
      location: eventData.location || '',
      type: eventData.type,
      recurring: eventData.recurring || false
    };

    const response = await api.put(`/events/${id}`, backendEventData);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  },
};

export default api; 