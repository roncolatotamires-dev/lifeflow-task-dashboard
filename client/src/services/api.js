const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    const errorMsg = data.error || 'Ocorreu um erro na requisição.';
    throw new Error(errorMsg);
  }
  return data;
};

export const api = {
  // Auth
  async login(email, password) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return handleResponse(res);
  },

  async register(name, email, password) {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    return handleResponse(res);
  },

  async getMe() {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  // Dashboard
  async getDashboardStats() {
    const res = await fetch(`${API_BASE_URL}/dashboard/stats`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  // Tasks
  async getTasks(params = {}) {
    const query = new URLSearchParams(params).toString();
    const url = query ? `${API_BASE_URL}/tasks?${query}` : `${API_BASE_URL}/tasks`;
    const res = await fetch(url, { headers: getAuthHeaders() });
    return handleResponse(res);
  },

  async getTask(id) {
    const res = await fetch(`${API_BASE_URL}/tasks/${id}`, { headers: getAuthHeaders() });
    return handleResponse(res);
  },

  async createTask(taskData) {
    const res = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(taskData)
    });
    return handleResponse(res);
  },

  async updateTask(id, taskData) {
    const res = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(taskData)
    });
    return handleResponse(res);
  },

  async toggleTaskStatus(id) {
    const res = await fetch(`${API_BASE_URL}/tasks/${id}/toggle`, {
      method: 'PATCH',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  async deleteTask(id) {
    const res = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  // Subtasks
  async addSubtask(taskId, title) {
    const res = await fetch(`${API_BASE_URL}/tasks/${taskId}/subtasks`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ title })
    });
    return handleResponse(res);
  },

  async toggleSubtask(subtaskId) {
    const res = await fetch(`${API_BASE_URL}/tasks/subtasks/${subtaskId}/toggle`, {
      method: 'PATCH',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  async deleteSubtask(subtaskId) {
    const res = await fetch(`${API_BASE_URL}/tasks/subtasks/${subtaskId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  // Categories
  async getCategories() {
    const res = await fetch(`${API_BASE_URL}/categories`, { headers: getAuthHeaders() });
    return handleResponse(res);
  },

  async createCategory(data) {
    const res = await fetch(`${API_BASE_URL}/categories`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  async updateCategory(id, data) {
    const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  async deleteCategory(id) {
    const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  // Tags
  async getTags() {
    const res = await fetch(`${API_BASE_URL}/tags`, { headers: getAuthHeaders() });
    return handleResponse(res);
  },

  async createTag(data) {
    const res = await fetch(`${API_BASE_URL}/tags`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  async deleteTag(id) {
    const res = await fetch(`${API_BASE_URL}/tags/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  }
};
