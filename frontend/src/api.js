// frontend/src/api.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001/api';

export const fetchTemplates = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/templates`);
    if (!response.ok) {
      throw new Error('Netzwerkantwort war nicht ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Es gab ein Problem mit dem Fetch-Vorgang:', error);
    throw error;
  }
};


// Templates
export const getTemplates = () => axios.get(`${API_BASE_URL}/templates`);

export const getTemplateById = (id) => axios.get(`${API_BASE_URL}/templates/${id}`);

export const createTemplate = (template) => axios.post(`${API_BASE_URL}/templates`, template);

export const updateTemplate = (id, template) => axios.put(`${API_BASE_URL}/templates/${id}`, template);

export const deleteTemplate = (id) => axios.delete(`${API_BASE_URL}/templates/${id}`);

// Trash
export const getTrash = () => axios.get(`${API_BASE_URL}/templates/trash/all`);

export const restoreTemplate = (id) => axios.post(`${API_BASE_URL}/templates/trash/restore/${id}`);

export const deleteTemplateForever = (id) => axios.delete(`${API_BASE_URL}/templates/trash/${id}`);
