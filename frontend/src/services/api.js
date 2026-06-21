import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Automatically inject JWT token into header if it exists in local storage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('reviora_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const authService = {
  register: async (username, email, password) => {
    const response = await api.post('/auth/register', { username, email, password });
    return response.data;
  },
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
  rotateApiKey: async () => {
    const response = await api.post('/auth/api-key');
    return response.data;
  }
};

export const repoService = {
  uploadZip: async (name, file) => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('source_type', 'zip');
    formData.append('file', file);
    const response = await api.post('/repo/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },
  connectGithub: async (name, url) => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('source_type', 'github');
    formData.append('github_url', url);
    const response = await api.post('/repo/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },
  list: async () => {
    const response = await api.get('/repo/list');
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/repo/${id}`);
    return response.data;
  }
};

export const analysisService = {
  scanBugs: async (code, filename) => {
    const response = await api.post('/analysis/bug-detection', { code, filename });
    return response.data;
  },
  scanVulnerabilities: async (code, filename) => {
    const response = await api.post('/analysis/vulnerability-detection', { code, filename });
    return response.data;
  },
  scanCodeSmells: async (code, filename) => {
    const response = await api.post('/analysis/code-smell-detection', { code, filename });
    return response.data;
  },
  generateDocs: async (code, filename) => {
    const response = await api.post('/analysis/generate-docs', { code, filename });
    return response.data;
  }
};

export const reportService = {
  list: async () => {
    const response = await api.get('/reports');
    return response.data;
  },
  getDetail: async (id) => {
    const response = await api.get(`/reports/${id}`);
    return response.data;
  }
};

export const chatService = {
  sendMessage: async (content, contextCode = null) => {
    const response = await api.post('/chat', { content, context_code: contextCode });
    return response.data;
  }
};

export default api;
