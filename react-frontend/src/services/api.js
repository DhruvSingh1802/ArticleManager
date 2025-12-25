import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const articleService = {
  getAll: async (params = {}) => {
    try {
      const response = await apiClient.get('/articles', { params });
      return response.data.data || response.data;
    } catch (error) {
      console.error('Failed to fetch articles:', error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await apiClient.get(`/articles/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch article ${id}:`, error);
      throw error;
    }
  },

  scrape: async () => {
    try {
      await apiClient.post('/articles/scrape');
    } catch (error) {
      console.error('Failed to scrape articles:', error);
      throw error;
    }
  },
};

export default apiClient;
